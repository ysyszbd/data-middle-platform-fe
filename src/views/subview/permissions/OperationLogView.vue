<template>
  <div class="root">
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      :header-cell-style="tableHeaderStyle"
      table-layout="auto"
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="user_id" label="user_id" />
      <el-table-column prop="status" label="status">
        <template #default="scope">
          <el-tag
            :type="scope.row.status === 'login success' ? 'success' : ''"
            disable-transitions
            >{{ scope.row.status }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="time" label="time" />
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
    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getData, deleteRow } from "@/utils/axios";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import { syslog_delete, syslog_list } from "@/utils/urlset";

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

function deleteData(index: number) {
  deleteRow(syslog_delete, { id: index }, getTableData);
}

function getTableData() {
  getData(
    syslog_list,
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
