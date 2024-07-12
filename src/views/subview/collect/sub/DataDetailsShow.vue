<template>
  <div class="root">
    <ChangeTaskDialog />
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      :header-cell-style="tableHeaderStyle"
      table-layout="auto"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="car" label="详情" />
      <el-table-column prop="people" label="车辆" />
      <el-table-column prop="time_quantum" label="地点" />
      <el-table-column prop="duration" label="人员" />
      <el-table-column prop="data_count" label="起始里程" />
      <el-table-column prop="data_count" label="结束里程" />
      <el-table-column prop="data_count" label="里程" />
      <el-table-column prop="data_count" label="起始时间" />
      <el-table-column prop="data_count" label="结束时间" />
      <el-table-column prop="data_count" label="时长" />
      <el-table-column prop="data_count" label="状态" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button
            text
            type="primary"
            size="small"
            @click.prevent="details(scope.$index)"
          >
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import ChangeTaskDialog from "./ChangeTaskDialog.vue";
import { ref, provide } from "vue";
import { tableHeaderStyle } from "@/utils/style";

const changeTaskDialogVisible = ref(false);
provide("changeTaskDialogVisible", changeTaskDialogVisible);

const tableData = ref([{ name: "任务一", car: "1", people: "1" }]);

// const emit = defineEmits<{
//   (e: "details", isshow: boolean): void;
// }>();

function details(data: any) {
  console.log(data);
  changeTaskDialogVisible.value = true;
}
</script>

<style scoped src="@/assets/css/base.css"></style>
