<template>
  <el-button
    link
    type="success"
    size="small"
    @click.prevent="$emit('onUpdate')"
  >
    更新
  </el-button>
  <el-popconfirm
    confirm-button-text="确定"
    cancel-button-text="取消"
    icon-color="#626AEF"
    title="确定删除本条数据吗？"
    @confirm="$emit('onDelete')"
  >
    <template #reference>
      <el-button link type="danger" size="small">删除</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "onUpdate"): void;
  (e: "onDelete"): void;
}>();
</script>

<style scoped></style>
