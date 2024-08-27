<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search,ArrowLeft } from '@element-plus/icons-vue'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const activeIndex = ref('0')
const searchItem = ref('')
const router = useRouter()
const route = useRoute()

const handleSelect = (key, keyPath) => {
    switch (key) {
        case '0':
            router.push('/')
            break
        case '1':
            router.push('/msg')
            break
        case '2':
            router.push('/other')
            break
        default:
            break
    }
}

const goBack = (event) => {
    event.preventDefault();
    router.go(-1)
    setTimeout(() => {
        updateActiveIndex(route.path)
    }, 0)
}

watch(() => route.path, (newPath) => {
    updateActiveIndex(newPath)
})

const updateActiveIndex = (path) => {
    switch (path) {
        case '/':
            activeIndex.value = '0'
            break
        case '/msg':
            activeIndex.value = '1'
            break
        case '/other':
            activeIndex.value = '2'
            break
        default:
            activeIndex.value = '0'
    }
}

const handleSearch = (event) => {
    event.preventDefault();
    if (searchItem.value.trim()) {
        router.push({ name: 'search', query: { keyword: searchItem.value } })
    } else {
        router.push({ name: 'article' })
    }
}
</script>

<template>
    <el-header class="header">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis=false
            @select="handleSelect" background-color="rgba(0, 0, 0, 0)" style="font-size: large;">
            <div class="back-button" @click="goBack">
                <el-icon><ArrowLeft /></el-icon>
            </div>
            <el-menu-item index="0" style="margin-left: 15px;">Wien Wen's BLOG</el-menu-item>
            <el-menu-item>
                <el-input v-model="searchItem" placeholder="请输入搜索内容" clearable @keyup.enter="handleSearch">
                    <template #append>
                        <el-button class="search-icon" :icon="Search" @click="handleSearch">
                        </el-button>
                    </template>
                </el-input>
            </el-menu-item>
            <el-menu-item index="1">留言</el-menu-item>
            <el-menu-item index="2" style="margin-right: 25px;">其他</el-menu-item>
        </el-menu>
    </el-header>
</template>

<style lang="css" scoped>
.el-menu--horizontal>.el-menu-item:nth-child(2) {
    margin-right: auto;
}

header {
    font-weight: bold;
    --el-menu-text-color: #fff;
}

.search-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
}

.el-input {
    --el-input-focus-border: var(--el-border);
    --el-input-focus-border-color: var(--el-border-color);
}

.back-button {
    display: flex;
    align-items: center;
    padding: 0 20px;
    cursor: pointer;
    height: 100%;
    color: #fff;
}

.back-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.el-menu--horizontal {
    display: flex;
    align-items: center;
}
</style>