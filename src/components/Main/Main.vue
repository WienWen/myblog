<script setup>
import Signature from './Signature.vue';
</script>

<template>
    <el-row>
        <el-col :span="18">
            <div class="main">
                <router-view></router-view>
            </div>
        </el-col>
        <el-col :span="6">
            <div class="aside">
                <Signature />
            </div>
        </el-col>
    </el-row>


</template>

<style lang="css" scoped>
.main {
    background-color: rgba(177, 224, 250, 0.5);
    height: 100vh;
    border-radius: 25px;
    margin: 20px 10px 20px 20px;
    overflow-y: auto;
}

.aside {
    background-color: rgba(177, 224, 250, 0.5);
    height: 100vh;
    border-radius: 25px;
    margin: 20px 20px 20px 10px;
    overflow-y: auto;
}
</style>