<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const activeTab = ref('articles')
const articles = ref([])
const messages = ref([])
const loading = ref(false)
const error = ref(null)
const router = useRouter()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/articles')
    articles.value = response.data.articles.map(article => ({
      ...article,
      createTime: formatDate(article.createTime),
      updateTime: formatDate(article.updateTime)
    }))
  } catch (err) {
    console.error('获取文章列表失败:', err)
    error.value = '获取文章列表失败,请稍后再试'
  } finally {
    loading.value = false
  }
}

const fetchMessages = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/messages')
    messages.value = response.data.map(message => ({
      ...message,
      createTime: formatDate(message.createTime)
    }))
  } catch (err) {
    console.error('获取留言列表失败:', err)
    error.value = '获取留言列表失败,请稍后再试'
  } finally {
    loading.value = false
  }
}

const deleteArticle = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await axios.delete(`/api/articles/${id}`)
    articles.value = articles.value.filter(article => article.id !== id)
    ElMessage({
      type: 'success',
      message: '文章已成功删除'
    })
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除文章失败:', err)
      error.value = '删除文章失败,请稍后再试'
      ElMessage({
        type: 'error',
        message: '删除文章失败'
      })
    }
  }
}

const deleteMessage = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条留言吗?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await axios.delete(`/api/messages/${id}`)
    messages.value = messages.value.filter(message => message.id !== id)
    ElMessage({
      type: 'success',
      message: '留言已成功删除'
    })
  } catch (err) {
    if (err !== 'cancel') {
      console.error('删除留言失败:', err)
      error.value = '删除留言失败,请稍后再试'
      ElMessage({
        type: 'error',
        message: '删除留言失败'
      })
    }
  }
}

const addArticle = () => {
  router.push({ name: 'adminArticle', params: { id: 'new' } })
}

const editArticle = (article) => {
  router.push({ name: 'adminArticle', params: { id: article.id.toString() } })
}

onMounted(() => {
  fetchArticles()
  fetchMessages()
})
</script>

<template>
  <div class="admin-view">
    <h1>后台管理</h1>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="文章管理" name="articles">
        <el-table :data="articles" style="width: 100%">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="danger" @click="deleteArticle(scope.row.id)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
              <el-button size="small" type="primary" @click="editArticle(scope.row)">
                <el-icon><Edit /></el-icon>编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addArticle">添加文章</el-button>
      </el-tab-pane>
      <el-tab-pane label="留言管理" name="messages">
        <el-table :data="messages" style="width: 100%">
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="danger" @click="deleteMessage(scope.row.id)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.admin-view {
  padding: 20px;
}
</style>
