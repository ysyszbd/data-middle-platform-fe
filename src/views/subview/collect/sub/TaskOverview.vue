<template>
  <h4 class="margin-top">任务总览</h4>
  <el-card class="box-card margin-top">
    <el-row :gutter="20">
      <el-col :span="8">
        <span>总任务量</span>
        <span class="margin-top">{{ count }} 个</span>
      </el-col>
      <el-col :span="8">
        <span>已完成量</span>
        <span class="margin-top">{{ count }} 个</span>
      </el-col>
      <el-col :span="8">
        <span>任务完成率</span>
        <span class="margin-top">{{ count }} %</span>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<style scoped src="@/assets/css/base.css"></style>
