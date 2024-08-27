<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const article = reactive({
  title: '',
  content: ''
})

const loading = ref(false)
const isEditing = ref(false)

const formRef = ref(null)

const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度应在 1 到 100 个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

onMounted(async () => {
  if (route.params.id && route.params.id !== 'new') {
    isEditing.value = true
    await fetchArticle()
  }
})

const fetchArticle = async () => {
  loading.value = true
  try {
    const response = await axios.get(`/api/articles/${route.params.id}`)
    Object.assign(article, response.data)
  } catch (err) {
    console.error('获取文章失败:', err)
    ElMessage.error('获取文章失败,请稍后再试')
  } finally {
    loading.value = false
  }
}

const saveArticle = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        if (isEditing.value) {
          const updatedArticle = {
            ...article,
            updateTime: new Date().toISOString()
          }
          await axios.put(`/api/articles/${route.params.id}`, updatedArticle)
          ElMessage.success('文章更新成功')
        } else {
          await axios.post('/api/articles', article)
          ElMessage.success('文章添加成功')
        }
        router.push({ name: 'admin' })
      } catch (err) {
        console.error('保存文章失败:', err)
        ElMessage.error('保存文章失败,请稍后再试')
      } finally {
        loading.value = false
      }
    } else {
      console.log('表单验证失败', fields)
    }
  })
}
</script>

<template>
  <div class="admin-article-view">
    <h1>{{ isEditing ? '编辑文章' : '添加文章' }}</h1>
    <el-form 
      ref="formRef"
      :model="article"
      :rules="rules"
      label-width="80px"
      v-loading="loading"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="article.title" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="article.content" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item class="button-container">
        <el-button type="primary" @click="saveArticle">保存</el-button>
        <el-button @click="router.push({ name: 'admin' })">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.admin-article-view {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.button-container {
  display: flex;
  justify-content: center;
}

.button-container .el-button {
  margin: 0 10px;
}
</style>
