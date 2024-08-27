<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

const searchKeyword = ref('')
const articles = ref([])
const router = useRouter()
const loading = ref(true)
const error = ref(null)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

const handleClick = (item) => {
  router.push('/about/' + item.id + '/')
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/articles', {
      params: {
        page: currentPage.value,
        pageSize: pageSize.value,
        search: searchKeyword.value
      }
    })
    articles.value = response.data.articles.map(article => ({
      ...article,
      createTime: new Date(article.createTime).toLocaleString(),
      updateTime: new Date(article.updateTime).toLocaleString()
    }))
    total.value = response.data.total
  } catch (err) {
    console.error('获取文章列表时出错:', err)
    error.value = '获取文章列表失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchArticles()
}

watch(searchKeyword, () => {
  currentPage.value = 1
  fetchArticles()
})

onMounted(fetchArticles)

</script>

<template>
  <div class="article-view">
    <div v-if="loading" class="loading">正在加载文章列表...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="articles-container">
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in articles" :key="item.id" @click="handleClick(item)">
            <div class="article">
              <div class="title">{{ item.title }}</div>
              <div class="content">{{ item.content }}...</div>
              <div class="time">创建时间: {{ item.createTime }}</div>
              <div class="time">更新时间: {{ item.updateTime }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
          layout="prev, pager, next"
          class="pagination"
        />
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped>
.article-view {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  margin: 20px;
}

.loading, .error {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.articles-container {
  flex-grow: 1;
}

.article {
  align-content: center;
  background-color: rgba(145, 246, 236, 0.377);
  border-radius: 25px;
  height: auto;
  margin-top: 20px;
  padding: 20px;
  cursor: pointer;
}

.title {
  font-weight: bold;
  margin-bottom: 10px;
}

.content {
  margin-bottom: 10px;
}

.time {
  font-size: 0.8em;
  color: #666;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination {
  margin-bottom: 0px;
}

:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-hover-color: rgba(255, 255, 255, 0.5);
}

:deep(.el-pagination .el-pager li),
:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  background-color: transparent !important;
  color: var(--el-text-color-primary);
}

:deep(.el-pagination .el-pager li.is-active) {
  color: var(--el-color-primary);
}

:deep(.el-pagination .el-pager li.is-disabled),
:deep(.el-pagination .btn-prev.is-disabled),
:deep(.el-pagination .btn-next.is-disabled) {
  background-color: transparent !important;
  color: var(--el-text-color-placeholder) !important;
  opacity: 0.5;
}

:deep(.el-pager li:focus) {
  background-color: transparent !important;
}

:deep(.el-pagination button:disabled) {
  background-color: transparent !important;
}
</style>