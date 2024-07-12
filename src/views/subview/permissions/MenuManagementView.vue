<template>
  <div class="root">
    <OperationBar
      creatButton="创建菜单"
      deleteButton="删除选中"
      @onCreatButtonHandel="dialogVisible = true"
      @onDeleteButtonHandel="deleteSelection"
    />
    <MenuInfoEdit @submit="createData" />
    <MenuInfoUpdate @update="updateData" />
    <div class="table-div">
      <el-table
        ref="mainTable"
        :data="tableData"
        row-key="id"
        height="100%"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :header-cell-style="tableHeaderStyle"
        lazy
        :load="loadChildren"
        :tree-props="{ children: 'children', hasChildren: 'has_child' }"
      >
        <el-table-column prop="id" label="ID" width="200" />
        <!-- <el-table-column prop="parent_id" label="parent_id" /> -->
        <el-table-column prop="name" label="名称" width="300"/>
        <!-- <el-table-column prop="icon" label="图标" /> -->
        <el-table-column prop="type" label="类型" width="200" />
        <el-table-column prop="url" label="路径" />
        <el-table-column type="selection" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";

import MenuInfoEdit from "@/components/subComponents/MenuInfoEdit.vue";
import MenuInfoUpdate from "@/components/subComponents/MenuInfoUpdate.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import { tableHeaderStyle } from "@/utils/style";
import type { MenuInfo } from "@/utils/data";

import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import {
  menu_create,
  menu_delete,
  menu_deleteBatch,
  menu_findChild,
  menu_update
} from "@/utils/urlset";

const multipleSelection = ref<MenuInfo[]>([]);

const tableData = ref([
  {
    id: 0,
    date: "",
    name: "",
    has_child: true
  }
]);
const mainTable = ref();
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const loadMap = new Map();

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
  create(menu_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(menu_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];
    data.push(element.id);
  }
  deleteRow(menu_deleteBatch, { ids: data }, getTableData);
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function updateData(form: any) {
  updateIdParameter(menu_update, form, getTableData);
}

function updateValue(data) {
  tableData.value = data.list;
  if (Object.hasOwn(data, "totalCount")) {
    total.value = data.totalCount;
  } else if (Object.hasOwn(data, "total_count")) {
    total.value = data.total_count;
  }
}

function getTableData() {
  dialogVisible.value = false;
  dialogUpdateVisible.value = false;
  getData(menu_findChild, { id: 0 }, updateValue);
  for (let [key] of loadMap) {
    reloadTree(key);
  }
}

function loadChildren(
  row: MenuInfo,
  treeNode: unknown,
  resolve: (data: MenuInfo[]) => void
) {
  getData(menu_findChild, { id: row.id }, (data) => {
    resolve(data.list);
  });
  loadMap.set(row.id, { row, treeNode, resolve });
}

const reloadTree = (parentId: any) => {
  parentId = parentId ? parseInt(parentId) : 0;
  const { row, treeNode, resolve } = loadMap.get(parentId);
  if (
    mainTable.value.store.states.lazyTreeNodeMap.value[parentId].length == 1
  ) {
    mainTable.value.store.states.lazyTreeNodeMap.value[parentId] = [];
  }
  loadChildren(row, treeNode, resolve);
};

onMounted(() => {
  getTableData();
});
</script>

<style scoped src="@/assets/css/base.css"></style>
