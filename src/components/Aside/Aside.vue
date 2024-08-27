<script setup>
import { ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import {
    Document,
    Message,
    Setting,
    Fold,
    Expand
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const router = useRouter()

const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
}

const showEmail = () => {
    const email = '780348918@qq.com'
    ElMessageBox.alert(email, '个人邮箱', {
        confirmButtonText: '复制',
        // center: true,
        callback: (action) => {
            if (action === 'confirm') {
                navigator.clipboard.writeText(email).then(() => {
                    ElMessage({
                        type: 'success',
                        message: '邮箱地址已复制到剪贴板'
                    })
                }).catch(() => {
                    ElMessage({
                        type: 'error',
                        message: '复制失败,请手动复制'
                    })
                })
            }
        }
    })
}

const goToGitHub = () => {
    window.open('https://github.com/WienWen', '_blank')
}

const goToAdmin = () => {
    router.push('/admin')
}
</script>

<template>
    <div class="aside">
        <el-menu class="el-menu-vertical-demo" :collapse="isCollapse" background-color="rgba(0, 0, 0, 0)">
            <div class="collapse-button" @click="toggleCollapse">
                <el-icon :size="20">
                    <Expand v-show="isCollapse" />
                    <Fold v-show="!isCollapse" />
                </el-icon>
            </div>
            <img class="img-me" v-show="!isCollapse" src="@/assets/images/goat.jpg" alt="goat"><br>
            <el-menu-item @click="showEmail" class="white-text">
                <el-icon><Message /></el-icon>
                <template #title>个人邮箱</template>
            </el-menu-item>
            <el-menu-item @click="goToGitHub" class="white-text">
                <el-icon><Document /></el-icon>
                <template #title>个人GitHub</template>
            </el-menu-item>
            <el-menu-item @click="goToAdmin" class="white-text">
                <el-icon><Setting /></el-icon>
                <template #title>后台管理</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<style lang="css" scoped>
.aside {
    height: 100%;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100vh;
}

.el-menu-vertical-demo {
    height: 100%;
    min-height: 100vh;
}

.img-me {
    width: 180px;
    border-radius: 10px;
    margin-top: 25px;
}

.collapse-button {
    padding: 15px;
    text-align: center;
    cursor: pointer;
    color: #ffffff;
}

.collapse-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.white-text {
    color: #ffffff !important;
}

.white-text:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
}
</style>