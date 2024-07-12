<template>
  <h4 class="margin-top">数据总览</h4>
  <el-card class="box-card margin-top">
    <el-row :gutter="20">
      <el-col :span="4">
        <span>今日新增数据集</span>
        <span class="margin-top">{{ count }} 个</span>
      </el-col>
      <el-col :span="4">
        <span>今日新增数据量</span>
        <span class="margin-top">{{ count }} 个</span>
      </el-col>
      <el-col :span="4">
        <span>累计数据集</span>
        <span class="margin-top">{{ count }} %</span>
      </el-col>
      <el-col :span="4">
        <span>累计批次</span>
        <span class="margin-top">{{ count }} %</span>
      </el-col>
      <el-col :span="4">
        <span>今日新增批次</span>
        <span class="margin-top">{{ count }} %</span>
      </el-col>
      <el-col :span="4">
        <span>累计数据量</span>
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
