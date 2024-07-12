<template>
  <div class="root">
    <el-scrollbar>
      <TaskOverview></TaskOverview>
      <DataOverview></DataOverview>
      <el-row>
        <el-col :span="11"><DeviceType></DeviceType></el-col>
        <el-col :span="11" :offset="2"><CityData></CityData></el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import TaskOverview from "./sub/TaskOverview.vue";
import DataOverview from "./sub/DataOverview.vue";
import DeviceType from "./sub/DeviceType.vue";
import CityData from "./sub/CityData.vue";
</script>

<style scoped src="@/assets/css/base.css"></style>
