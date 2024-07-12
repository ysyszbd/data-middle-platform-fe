<!--
 * @LastEditTime: 2023-07-26 13:27:58
 * @Description: 
-->
<template>
  <div class="root">
    <el-container>
      <el-header class="header">
        <img src="@/assets/image/logo.png" alt="加载失败" class="logo" />
      </el-header>
      <el-main class="main-view">
        <div class="login">
          <h1 style="margin: 10px">用户登录</h1>
          <LoginForm></LoginForm>
        </div>
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
import LoginForm from "@/components/LoginForm.vue";
</script>

<style scoped>
.root {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/image/login_bg.png");
  /* background-image: url("@/assets/image/login_view.png"); */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
}
.login {
  position: absolute;
  text-align: center;
  top: 50%;
  left: 50%;
  width: 20%;
  transform: translate(-50%, -70%);
  padding: 1em 1em;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
}
.logo {
  height: 40px;
  margin-left: 10px;
}
.header {
  padding: 10px 10px;
  background-color: #00000067;
  box-shadow: 0 1px 3px rgb(0 21 41 / 8%);
}
.main-view {
  height: calc(100vh - 120px);
  /* background-image: url("@/assets/image/background.png"); */
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  background-attachment: fixed;
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
</style>
