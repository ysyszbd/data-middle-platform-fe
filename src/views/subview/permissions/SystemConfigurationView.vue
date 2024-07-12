<template>
  <div class="root">
    <OperationBar
      creatButton="创建配置"
      deleteButton="删除选中"
      @onCreatButtonHandel="dialogVisible = true"
      @onDeleteButtonHandel="deleteSelection"
    />
    <SystemCfgEdit @submit="createData" />
    <SystemCfgUpdate @update="updateData" />
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
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="key" label="键" />
      <el-table-column prop="type" label="类型" />
      <el-table-column prop="group" label="分组" />
      <el-table-column prop="value" label="值" />
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
import SystemCfgEdit from "@/components/subComponents/SystemCfgEdit.vue";
import SystemCfgUpdate from "@/components/subComponents/SystemCfgUpdate.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import type { SystemInfo } from "@/utils/data";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import { config_create, config_delete, config_deleteBatch, config_list, config_update } from "@/utils/urlset";

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const multipleSelection = ref<SystemInfo[]>([]);

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
  create(config_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(config_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];

    data.push(element.id);
  }
  deleteRow(config_deleteBatch, { ids: data }, getTableData);
}

function updateData(form: any) {
  updateIdParameter(config_update, form, getTableData);
}

function getTableData() {
  dialogVisible.value = false;
  dialogUpdateVisible.value = false;
  getData(
    config_list,
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

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
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
