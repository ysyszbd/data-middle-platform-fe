<template>
  <div class="root">
    <OperationBar
      creatButton="创建API"
      deleteButton="删除选中"
      @onCreatButtonHandel="dialogVisible = true"
      @onDeleteButtonHandel="deleteSelection"
    />
    <APIInfoEdit @submit="createData" />
    <APIInfoUpdate @update="updateData" />
    <div ref="dataRoot" style="height: 100%">
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
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="method" label="方法">
          <template #default="scope">
            <el-tag disable-transitions :type="getType(scope.row.method)">{{
              scope.row.method
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="group" label="分组" />
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
    </div>
    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from "vue";
import APIInfoEdit from "@/components/subComponents/APIInfoEdit.vue";
import APIInfoUpdate from "@/components/subComponents/APIInfoUpdate.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import type { ApiInfo } from "@/utils/data";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import {
  api_create,
  api_delete,
  api_deleteBatch,
  api_update,
  api_list,
} from "@/utils/urlset";
import { windowResizeEvent } from "@/utils/util";

const dataRoot = ref();
const tableHeight = ref(600);
const multipleSelection = ref<ApiInfo[]>([]);
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

function getType(status) {
  switch (status) {
    case "GET":
      return "success";
    case "POST":
      return "warning";
    case "DELETE":
      return "danger";
  }
}

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function createData(form: any) {
  create(api_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(api_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];
    data.push(element.id);
  }
  deleteRow(api_deleteBatch, { ids: data }, getTableData);
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function updateData(form: any) {
  updateIdParameter(api_update, form, getTableData);
}

function getTableData() {
  dialogVisible.value = false;
  dialogUpdateVisible.value = false;
  getData(
    api_list,
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

function getTableDivHeight() {
  tableHeight.value = dataRoot.value.clientHeight;
  pageSize.value = Math.floor((tableHeight.value - 122) / 41);
  getTableData();
}

onMounted(() => {
  getTableDivHeight();
  windowResizeEvent(getTableDivHeight);
});
onUnmounted(() => {
  window.onresize = null;
});
</script>

<style scoped src="@/assets/css/base.css"></style>
