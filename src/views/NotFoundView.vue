<template>
  <el-result title="404" sub-title="对不起,请求错误">
    <template #icon>
      <el-image :src="imageUrl" />
    </template>
    <template #extra>
      <el-button type="primary" @click="goHome()">返回首页</el-button>
    </template>
  </el-result>
</template>

<script setup lang="ts">
import imageUrl from "@/assets/image/404.gif";
import { useRouter } from "vue-router";

const router = useRouter();

function goHome() {
  router.push("/");
}
</script>

<style scoped></style>
