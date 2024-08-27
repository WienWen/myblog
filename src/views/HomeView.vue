<script setup>
import Header from '@/components/Header/Header.vue';
import Footer from '@/components/Footer/Footer.vue';
import Main from '@/components/Main/Main.vue';
import Aside from '@/components/Aside/Aside.vue';

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <Aside></Aside>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <Main></Main>
        </el-main>
        <el-footer>
          <Footer></Footer>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="css" scoped>
.common-layout {
  background: url('@/assets/images/bg.jpg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;
}
</style>