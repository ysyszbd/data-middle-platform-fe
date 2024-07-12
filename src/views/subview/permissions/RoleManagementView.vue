<template>
  <div class="root">
    <OperationBar
      creatButton="创建角色"
      deleteButton="删除选中"
      @onCreatButtonHandel="dialogVisible = true"
      @onDeleteButtonHandel="deleteSelection"
    />
    <RoleInfoEdit @submit="createData" />
    <RoleInfoUpdate @update="updateData" />
    <RoleMenuEdit @update="updateMenu" />
    <RoleApiEdit @update="updateApi" />
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
      <el-table-column prop="name" label="角色" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="status" label="状态" />
      <el-table-column fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="updateRoleMenu(scope.row)"
          >
            编辑菜单
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="updateRoleAPI(scope.row)"
          >
            编辑API
          </el-button>
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

import RoleInfoEdit from "@/components/subComponents/RoleInfoEdit.vue";
import RoleInfoUpdate from "@/components/subComponents/RoleInfoUpdate.vue";
import RoleMenuEdit from "@/components/subComponents/RoleMenuEdit.vue";
import RoleApiEdit from "@/components/subComponents/RoleApiEdit.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import type { RoleInfo } from "@/utils/data";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import { role_create, role_delete, role_delteBatch, role_list, role_update, set_role_apis, set_role_menus } from "@/utils/urlset";

const multipleSelection = ref<RoleInfo[]>([]);

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const dialogUpdateVisible = ref(false);
provide("dialogUpdateVisible", dialogUpdateVisible);

const dialogUpdateMenuVisible = ref(false);
provide("dialogUpdateMenuVisible", dialogUpdateMenuVisible);

const dialogUpdateAPIVisible = ref(false);
provide("dialogUpdateAPIVisible", dialogUpdateAPIVisible);

const updateTableData = ref();
provide("updateTableData", updateTableData);

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function createData(form: any) {
  create(role_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(role_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];

    data.push(element.id);
  }
  deleteRow(role_delteBatch, { ids: data }, getTableData);
}

function updateRoleMenu(index: any) {
  dialogUpdateMenuVisible.value = true;
  updateTableData.value = index;
}

function updateRoleAPI(index: any) {
  dialogUpdateAPIVisible.value = true;
  updateTableData.value = index;
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function updateData(form: any) {
  updateIdParameter(role_update, form, getTableData);
}

function updateMenu(id: any, value: any) {
  let data = {
    role_id: id,
    menu_ids: value,
  };

  updateIdParameter(set_role_menus, data, getTableData);
}

function updateApi(id: any, value: any) {
  let data = {
    role_id: id,
    api_ids: value,
  };

  updateIdParameter(set_role_apis, data, getTableData);
}

function getTableData() {
  dialogVisible.value = false;
  dialogUpdateAPIVisible.value = false;
  dialogUpdateMenuVisible.value = false;
  dialogUpdateVisible.value = false;
  getData(
    role_list,
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
