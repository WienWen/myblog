<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
    <el-footer class="footer">
        <div class="copyright">
            © {{ currentYear }} Wien Wen's Blog. 保留所有权利。
        </div>
    </el-footer>
</template>

<style lang="css" scoped>
.footer {
    background-color: rgba(0, 0, 0, 0);
    padding: 20px 0;
    margin: 0;
    width: 100%;
}

.copyright {
    margin-bottom: 10px;
    color: #ffffff;
    text-align: center;
    line-height: 60px;
}
</style>