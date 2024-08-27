<script setup>
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'

const images = ref([])
const humor = ref([])

async function fetchImages() {
    try {
        const response = await fetch('https://api.vvhan.com/api/bing?type=json&rand=sj')
        if (!response.ok) {
            throw new Error('Network response was not ok.')
        }
        const data = await response.json()
        images.value.push(data.data)
    } catch (error) {
        console.error('Error fetching images:', error)
    }
}

async function fetchHumor() {
    try {
        const response = await fetch('https://api.xygeng.cn/one')
        if (!response.ok) {
            throw new Error('Network response was not ok.')
        }
        const data = await response.json()
        humor.value.push(data)
    } catch (error) {
        console.error('Error fetching images:', error)
    }
}

onMounted(() => {
    for (let i = 0; i < 3; i++) {
        fetchImages()
        fetchHumor()
    }
})
</script>

<template>
    <div class="signature">
        <div class="picture">
            <el-carousel height="250px" motion-blur>
                <el-carousel-item v-for="item in images" :key="item.id">
                    <img width="100%" :src="item.url" :alt="item.title"></img>
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="text">
            <ul>
                <li style="font-size: 16px;margin-top: 20px;" v-for="item in humor" :key="item">
                    {{ item.data.content }} ——{{ item.data.origin }}</li>
            </ul>
        </div>
    </div>
</template>

<style lang="css" scoped>
.picture {
    padding: 20px;
}

.text {
    padding: 20px;
    height: 100%;
    margin: 0 20px;
}

img {
    width: 100%;
    height: 100%;
}
</style>
