<template>
  <div class="icon_box">
    <CaretTop :width="props.w" v-show="props.openSign" />
    <CaretBottom :width="props.w" v-show="!props.openSign" />
  </div>
</template>

<script lang="ts" setup>
import { CaretTop, CaretBottom } from "@element-plus/icons-vue";
import { defineProps } from "vue";
const props = defineProps(["w", "openSign"]);
</script>

<style lang="scss" scoped>
.icon_box {
  margin-left: 5px;
  pointer-events: auto;
  cursor: pointer;
}
</style>
