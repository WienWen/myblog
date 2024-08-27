<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const formRef = ref(null)
const messages = ref([])
const name = ref('')
const email = ref('')
const content = ref('')
const loading = ref(false)
const error = ref(null)

const nameRules = [
  { required: true, message: '请输入名称', trigger: 'blur' },
  { max: 10, message: '名称长度不能超过10个字符', trigger: 'blur' }
]

const emailRules = [
  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
  { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
]

const contentRules = [
  { required: true, message: '请输入留言内容', trigger: 'blur' }
]

const fetchMessages = async () => {
  try {
    const response = await axios.get('/api/messages')
    messages.value = response.data
  } catch (err) {
    console.error('获取留言时出错:', err)
    error.value = '获取留言失败，请稍后再试'
  }
}

const submitMessage = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true
      try {
        const response = await axios.post('/api/messages', {
          name: name.value,
          email: email.value,
          content: content.value
        })
        messages.value.unshift(response.data)
        name.value = ''
        email.value = ''
        content.value = ''
        error.value = null
        formRef.value.resetFields()
      } catch (err) {
        console.error('提交留言时出错:', err)
        error.value = '提交留言失败，请稍后再试'
      } finally {
        loading.value = false
      }
    } else {
      console.log('表单验证失败:', fields)
    }
  })
}

onMounted(fetchMessages)
</script>

<template>
  <div class="msg-view">
    <h2>留言板</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="messages">
      <div v-for="message in messages" :key="message.id" class="message">
        <div class="header">
          <span class="name">{{ message.name }}</span>
          <span class="email">{{ message.email }}</span>
          <span class="time">{{ new Date(message.createTime).toLocaleString() }}</span>
        </div>
        <div class="content">{{ message.content }}</div>
      </div>
    </div>
    <el-form ref="formRef" :model="{ name, email, content }" class="form" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="名称" prop="name" :rules="nameRules">
            <el-input v-model="name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email" :rules="emailRules">
            <el-input v-model="email" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="留言内容" prop="content" :rules="contentRules">
        <el-input v-model="content" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item class="submit-button-container">
        <el-button :loading="loading" type="primary" @click="submitMessage">提交留言</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="css" scoped>
.msg-view {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px); /* 假设头部高度为40px，根据实际情况调整 */
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.form {
  background-color: rgba(226, 224, 224, 0.54);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.message {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.header {
  display: flex;
  justify-content: space-between;
}

.name {
  font-weight: bold;
}

.email {
  color: #666;
}

.time {
  color: #999;
}

.content {
  margin-top: 10px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
