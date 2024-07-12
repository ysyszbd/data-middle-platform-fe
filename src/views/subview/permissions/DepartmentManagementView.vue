<template>
  <div class="root">
    <OperationBar
      creatButton="创建部门"
      deleteButton="删除选中"
      @onCreatButtonHandel="dialogVisible = true"
      @onDeleteButtonHandel="deleteSelection"
    />
    <DeptInfoEdit @submit="createData" />
    <DeptInfoUpdate @update="updateData" />
    <DeptRoleEdit @update="updateRole" />
    <div style="height: calc(100vh - 142px)">
      <el-table
        ref="mainTable"
        :data="tableData"
        row-key="id"
        height="calc(100%)"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :header-cell-style="tableHeaderStyle"
        table-layout="auto"
        lazy
        :load="loadChildren"
        :tree-props="{ children: 'children', hasChildren: 'has_child' }"
      >
        <el-table-column prop="id" label="ID" />
        <!-- <el-table-column prop="parent_id" label="parent_id" /> -->
        <el-table-column prop="name" label="部门" />
        <el-table-column prop="status" label="状态" />
        <el-table-column type="selection" />
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="editRole(scope.row)"
            >
              编辑角色
            </el-button>
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
import DeptInfoEdit from "@/components/subComponents/DeptInfoEdit.vue";
import DeptInfoUpdate from "@/components/subComponents/DeptInfoUpdate.vue";
import DeptRoleEdit from "@/components/subComponents/DeptRoleEdit.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";

import type { DeptInfo } from "@/utils/data";
import { dept_create, dept_delete, dept_deleteBatch, dept_findChild, dept_update, set_dept_roles } from "@/utils/urlset";

const multipleSelection = ref<DeptInfo[]>();

const tableData = ref([
  {
    id: 0,
    date: "",
    name: "",
    has_child: true,
  },
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

const dialogUpdateRadioVisible = ref(false);
provide("dialogUpdateRadioVisible", dialogUpdateRadioVisible);

const updateTableData = ref();
provide("updateTableData", updateTableData);

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function createData(form: any) {
  create(dept_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(dept_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  if (multipleSelection.value === undefined) {
    return;
  }
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element: DeptInfo = multipleSelection.value[index];
    if (element.id != undefined) data.push(element.id);
  }
  deleteRow(dept_deleteBatch, { ids: data }, getTableData);
}

function editRole(index: any) {
  dialogUpdateRadioVisible.value = true;
  updateTableData.value = index;
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function updateData(form: any) {
  updateIdParameter(dept_update, form, getTableData);
}

function updateRole(id: any, value: any) {
  let data = {
    dept_id: id,
    role_ids: value,
  };

  updateIdParameter(set_dept_roles, data, getTableData);
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
  dialogUpdateRadioVisible.value = false;
  dialogUpdateVisible.value = false;
  getData(dept_findChild, { id: 0 }, updateValue);
  for (let [key, value] of loadMap) {
    reloadTree(key);
  }
}

function loadChildren(
  row: DeptInfo,
  treeNode: unknown,
  resolve: (data: DeptInfo[]) => void
) {
  getData(dept_findChild, { id: row.id }, (data) => {
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
