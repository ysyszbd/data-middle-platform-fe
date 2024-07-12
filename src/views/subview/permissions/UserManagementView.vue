<template>
  <div class="root">
    <OperationBar
      creatButton="创建用户"
      deleteButton=""
      @onCreatButtonHandel="dialogVisible = true"
    />
    <UserInfoEdit @submit="createData" />
    <UserRoleEdit @update="updateRole" />
    <UserInfoUpdate @update="updateData" />
    <UserFileRoleAttribute
      v-model:visible="dialogFileRoleVisible"
      :data="updateTableData"
      @submit="updateFileRole"
    />
    <div class="table-div">
      <el-table
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        :header-cell-style="tableHeaderStyle"
        table-layout="auto"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="user_name" label="用户名" />
        <el-table-column prop="nick_name" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column fixed="right" label="操作" width="250">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="editRole(scope.row)"
            >
              编辑角色
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="editFileRole(scope.row)"
            >
              编辑权限
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
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import UserInfoEdit from "@/components/subComponents/UserInfoEdit.vue";
import UserRoleEdit from "@/components/subComponents/UserRoleEdit.vue";
import UserInfoUpdate from "@/components/subComponents/UserInfoUpdate.vue";
import UserFileRoleAttribute from "./sub/UserFileRoleAttribute.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import {
  set_user_roles,
  user_create,
  user_delete,
  user_list,
  user_update,
  set_user_file_roles
} from "@/utils/urlset";

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(15);
const currentPage = ref(1);

const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const dialogUpdateVisible = ref(false);
provide("dialogUpdateVisible", dialogUpdateVisible);

const dialogFileRoleVisible = ref(false);

const dialogUpdateRadioVisible = ref(false);
provide("dialogUpdateRadioVisible", dialogUpdateRadioVisible);

const updateTableData = ref();
provide("updateTableData", updateTableData);

function createData(form: any) {
  create(user_create, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(user_delete, { id: index }, getTableData);
}

function updateData(form: any) {
  updateIdParameter(user_update, form, getTableData);
}

function updateFileRole(id, data) {
  updateIdParameter(
    set_user_file_roles,
    { user_id: id, file_role_ids: data },
    getTableData
  );
}

function getTableData() {
  dialogVisible.value = false;
  dialogUpdateRadioVisible.value = false;
  dialogUpdateVisible.value = false;
  dialogFileRoleVisible.value = false;
  getData(
    user_list,
    {
      page: currentPage.value,
      page_size: pageSize.value
    },
    (data: any) => {
      tableData.value = data.list;
      total.value = data.total_count;
    }
  );
}

function updateRole(id: number, value: Array<number>) {
  const data = {
    user_id: id,
    role_ids: value
  };
  updateIdParameter(set_user_roles, data, getTableData);
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function editRole(index: any) {
  dialogUpdateRadioVisible.value = true;
  updateTableData.value = index;
}

function editFileRole(index: any) {
  dialogFileRoleVisible.value = true;
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
