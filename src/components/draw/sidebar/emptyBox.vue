<!--
 * @LastEditTime: 2023-06-30 10:19:00
 * @Description: 空状态组件
-->
<template>
  <div class="empty_box">
    {{ props.text }}
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
const props = defineProps(["text"]);
</script>

<style lang="scss" scoped>
.empty_box {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  text-align: center;
  color: var(--empty-text);
  height: 20px;
  box-sizing: border-box;
}
</style>
