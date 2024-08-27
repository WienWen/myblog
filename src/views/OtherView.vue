<script setup>
import { ref } from 'vue'

const links = ref([
  { title: '个人GitHub', url: 'https://github.com/WienWen' },
  { title: '个人博客', url: 'https://wienwen.com' },
  { title: '联系邮箱', url: 'mailto:wienwen@example.com' }
])

const skills = ref([
  { name: 'Vue.js', level: 85 },
  { name: 'JavaScript', level: 75 },
  { name: 'Node.js', level: 70 },
  { name: 'Java', level: 70 }
])

const interests = ref([
  '编程', '阅读', '电影', '篮球', '音乐'
])
</script>

<template>
  <div class="other-view">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>关于我</span>
            </div>
          </template>
          <p>我是一名热爱技术的 Web 开发者。我喜欢探索新技术，解决复杂问题，并不断学习以提升自己的技能。</p>
          <h4>兴趣爱好</h4>
          <el-tag v-for="interest in interests" :key="interest" class="interest-tag">{{ interest }}</el-tag>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>技能水平</span>
            </div>
          </template>
          <div v-for="skill in skills" :key="skill.name" class="skill-item">
            <span>{{ skill.name }}</span>
            <el-progress :percentage="skill.level" :format="(percentage) => `${percentage}%`" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider />

  </div>
</template>

<style scoped>
.other-view {
  padding: 20px;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-item {
  margin-bottom: 15px;
}

.interest-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>