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
      <el-table-column prop="source_id" label="源" />
      <el-table-column prop="target_id" label="目标" />
      <el-table-column prop="pick_type" label="类型" />
      <el-table-column prop="amount" label="amount" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column fixed="right" label="操作" width="220">
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
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, deleteRow, updateIdParameter } from "@/utils/axios";
import { pickimage_delete, pickimage_list, pickimage_update } from "@/utils/urlset";

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

function deleteData(index: number) {
  deleteRow(pickimage_delete, { id: index }, getTableData);
}

function updateData(form: any) {
  updateIdParameter(pickimage_update, form, getTableData);
}

function getTableData() {
  getData(
    pickimage_list,
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
