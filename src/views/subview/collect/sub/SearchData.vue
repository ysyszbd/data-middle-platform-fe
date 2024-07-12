<template>
  <el-row class="root">
    <el-col :span="7"><FilterData></FilterData></el-col>
    <el-col :span="16" :offset="1">
      <DataShow @details="showDetails"></DataShow>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import FilterData from "./FilterData.vue";
import DataShow from "./DataShow.vue";

const emit = defineEmits<{
  (e: "details", isshow: boolean): void;
}>();

function showDetails() {
  console.log("showDetails true");
  emit("details", true);
}
</script>

<style scoped src="@/assets/css/base.css"></style>
