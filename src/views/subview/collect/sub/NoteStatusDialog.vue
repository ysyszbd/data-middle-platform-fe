<template>
  <el-dialog v-model="statusDialogVisible" title="标注状态" draggable>
    处理人
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";

const statusDialogVisible = inject("statusDialogVisible", ref(false));
</script>

<style scoped></style>
