<template>
  <div class="root">
    <OperationBar
      creatButton="创建车辆"
      deleteButton="删除选中"
      @onCreatButtonHandel="dialogVisible = true"
      @onDeleteButtonHandel="deleteSelection"
    />
    <VehicleInfoEdit @submit="createData" />
    <VehicleInfoUpdate @update="updateData" />
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :header-cell-style="tableHeaderStyle"
      table-layout="auto"
    >
      <el-table-column type="selection" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="plate" label="车牌" />
      <el-table-column prop="brand" label="品牌" />
      <el-table-column prop="no" label="编号" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <TableOperation
            @onUpdate="update(scope.row)"
            @onDelete="deleteData(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import VehicleInfoEdit from "@/components/subComponents/VehicleInfoEdit.vue";
import VehicleInfoUpdate from "@/components/subComponents/VehicleInfoUpdate.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import type { VehicleInfo } from "@/utils/data";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import { car_create, car_delete, car_deleteBatch, car_list, car_update } from "@/utils/urlset";

const multipleSelection = ref<VehicleInfo[]>([]);

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const dialogUpdateVisible = ref(false);
provide("dialogUpdateVisible", dialogUpdateVisible);

const updateTableData = ref();
provide("updateTableData", updateTableData);

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function createData(form: any) {
  create(car_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(car_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];
    data.push(element.id);
  }
  deleteRow(car_deleteBatch, { ids: data }, getTableData);
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function updateData(form: any) {
  updateIdParameter(car_update, form, getTableData);
}

function getTableData() {
  dialogVisible.value = false;
  dialogUpdateVisible.value = false;
  getData(
    car_list,
    {
      page: currentPage.value,
      page_size: pageSize.value,
    },
    (data: any) => {
      tableData.value = data.list;
      total.value = data.total_count;
    }
  );
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData();
};

onMounted(() => {
  getTableData();
});
</script>

<style scoped src="@/assets/css/base.css"></style>
