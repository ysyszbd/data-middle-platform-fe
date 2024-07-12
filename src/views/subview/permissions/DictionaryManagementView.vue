<template>
  <div class="root">
    <OperationBar
      creatButton="创建字典"
      deleteButton="删除选中"
      @onCreatButtonHandel="dialogVisible = true"
      @onDeleteButtonHandel="deleteSelection"
    />
    <DictionaryEdit @submit="createData" />
    <DictionaryUpdate @update="updateData" />
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
      <el-table-column prop="acronym" label="缩写" />
      <el-table-column prop="code" label="代码" />
      <el-table-column prop="encode" label="编码" />
      <el-table-column prop="short_code" label="short_code" />
      <el-table-column prop="short_name" label="short_name" />
      <el-table-column prop="type_code" label="type_code" />
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
import DictionaryEdit from "@/components/subComponents/DictionaryEdit.vue";
import DictionaryUpdate from "@/components/subComponents/DictionaryUpdate.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import type { DictionaryInfo } from "@/utils/data";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import {
  dict_create,
  dict_update,
  dict_delete,
  dict_deleteBatch,
  dict_list,
} from "@/utils/urlset";

const multipleSelection = ref<DictionaryInfo[]>([]);
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
  create(dict_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(dict_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];

    data.push(element.id);
  }
  deleteRow(dict_deleteBatch, { ids: data }, getTableData);
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function updateData(form: any) {
  updateIdParameter(dict_update, form, getTableData);
}

function getTableData() {
  dialogVisible.value = false;
  dialogUpdateVisible.value = false;
  getData(
    dict_list,
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
