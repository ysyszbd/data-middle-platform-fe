<template>
  <el-page-header title="首页" @back="goBack">
    <template #content>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="item in route.matched"
          :key="item.path"
          :to="{ path: item.path }"
        >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </template>
  </el-page-header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const goBack = () => {
  router.push("/");
};
</script>

<style scoped></style>
