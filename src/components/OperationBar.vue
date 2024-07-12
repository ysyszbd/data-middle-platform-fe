<template>
  <div class="operation">
    <el-button
      v-show="button1Show"
      class="btn"
      type="primary"
      @click="$emit('onCreatButtonHandel')"
    >
      {{ creatButton }}
    </el-button>
    <el-popconfirm
      confirm-button-text="确定"
      cancel-button-text="取消"
      icon-color="#626AEF"
      title="确定删除这些数据吗？"
      @confirm="$emit('onDeleteButtonHandel')"
    >
      <template #reference>
        <el-button v-show="button2Show" class="btn" type="danger">
          {{ deleteButton }}</el-button
        >
      </template>
    </el-popconfirm>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ creatButton: string; deleteButton?: string }>();

const emit = defineEmits<{
  (e: "onCreatButtonHandel"): void;
  (e: "onDeleteButtonHandel"): void;
}>();

const button1Show = computed(() => {
  return props.creatButton != "" ? true : false;
});

const button2Show = computed(() => {
  return props.deleteButton != "" ? true : false;
});
</script>

<style scoped src="@/assets/css/base.css"></style>
