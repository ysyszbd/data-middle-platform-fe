<template>
  <div class="root">
    <div ref="dataRoot" style="height: 100%">
      <el-table
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        :header-cell-style="tableHeaderStyle"
        table-layout="auto"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="user_name" label="用户名" />
        <el-table-column prop="ip" label="ip" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag disable-transitions :type="getType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="确定删除本条数据吗？"
              @confirm="deleteData(scope.row.id)"
            >
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
import { ref, onMounted, onUnmounted } from "vue";
import { getData, deleteRow } from "@/utils/axios";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import { loginlog_delete, loginlog_list } from "@/utils/urlset";
import { windowResizeEvent } from "@/utils/util";

const dataRoot = ref();
const tableHeight = ref(600);
const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

function getType(status) {
  return status === "login success" ? "success" : "";
}

function deleteData(index: number) {
  deleteRow(loginlog_delete, { id: index }, getTableData);
}

function getTableData() {
  getData(
    loginlog_list,
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
  pageSize.value = Math.floor((tableHeight.value - 82) / 41);
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
