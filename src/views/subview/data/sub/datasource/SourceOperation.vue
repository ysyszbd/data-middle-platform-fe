<template>
  <div class="operation">
    <el-button type="primary" @click="create">添加</el-button>
    <el-button @click="create">添加权限</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const emit = defineEmits(["cmd"]);

function create() {
  emit("cmd", "add");
}
</script>

<style scoped>
.operation {
  width: 100%;
  box-sizing: border-box;
}
</style>
