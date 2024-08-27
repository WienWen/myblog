<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { marked } from 'marked'

const route = useRoute()
const article = ref({ title: '', content: '', createTime: '', updateTime: '' })
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get(`/api/articles/${route.params.id}`)
    article.value = {
      title: response.data.title,
      content: marked(response.data.content), // 使用 marked 解析 Markdown
      createTime: new Date(response.data.createTime).toLocaleString(),
      updateTime: new Date(response.data.updateTime).toLocaleString()
    }
    loading.value = false
  } catch (err) {
    console.error('获取文章数据时出错:', err)
    error.value = '获取文章失败，请稍后再试'
    loading.value = false
  }
})
</script>

<template>
  <div class="about">
    <div v-if="loading">正在加载文章...</div>
    <div v-else-if="error">{{ error }}</div>
    <template v-else>
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-content" v-html="article.content"></div>
      <div class="article-meta">
        <span>创建时间：{{ article.createTime }}</span>
        <span>更新时间：{{ article.updateTime }}</span>
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped>
.article-content {
  line-height: 1.6;
  font-size: 16px;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5,
.article-content h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.article-content p {
  margin-bottom: 16px;
}

.article-content ul,
.article-content ol {
  margin-bottom: 16px;
  padding-left: 2em;
}

.article-content pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.article-content code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

.article-content pre > code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.about {
  padding: 20px;
  position: relative;
  min-height: calc(100vh - 100px); /* 假设头部和底部总高度为100px，根据实际情况调整 */
}

.article-title {
  margin-bottom: 20px;
}

.article-content {
  margin-bottom: 60px; /* 为底部元数据留出空间 */
}

.article-meta {
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 0.8em;
  color: #666;
}

.article-meta span {
  display: block;
  text-align: right;
}
</style>
