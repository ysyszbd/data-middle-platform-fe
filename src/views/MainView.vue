<!--
 * @LastEditTime: 2023-07-26 11:45:55
 * @Description: 
-->
<template>
  <div class="common">
    <el-container>
      <el-header class="header v-center">
        <img src="@/assets/image/logo.png" alt="加载失败" class="left" />
        <div class="right">
          <NavBar></NavBar>
        </div>
      </el-header>
      <el-main class="main-view">
        <MainMenu></MainMenu>
      </el-main>
      <el-footer class="v-center footer">
        <span style="display: block; color: #ffffff">
          ©2022 Powered by 易航智能
        </span>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
import MainMenu from "../components/MainMenu.vue";
</script>

<style scoped>
.main-view {
  height: calc(100vh - 120px);
}

.header {
  padding: 10px 10px;
  background-color: #0000001f;
  box-shadow: 0 1px 3px rgb(0 21 41 / 8%);
}

.footer {
  background-color: #0000001f;
  box-shadow: 0 -1px 3px rgb(0 21 41 / 8%);
  z-index: 1;
}
.v-center {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.right {
  position: absolute;
  right: 20px;
}

.left {
  position: absolute;
  height: 40px;
  left: 20px;
}

.common {
  width: 100%;
  height: 100vh;
  background: url("@/assets/image/main_bg.png") no-repeat center fixed transparent;
  background-size: cover;
}
</style>
