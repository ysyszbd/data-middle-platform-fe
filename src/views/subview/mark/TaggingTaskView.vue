<!--
 * @Author: yinshunyu
 * @Date: 2022-11-16 17:51:25
 * @LastEditors: yinshunyu
 * @LastEditTime: 2023-01-12 18:30:20
 * @FilePath: \DataClient\src\views\subview\mark\TaggingTaskView.vue
 * @Description: 
 * 
-->
<template>
  <div class="root">
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      @selection-change="handleSelectionChange"
      :header-cell-style="tableHeaderStyle"
      table-layout="auto"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="source_id" label="源" />
      <el-table-column prop="handler" label="人员" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="goDetails(scope.row.source_id)"
          >
            标注
          </el-button>
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
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, deleteRow } from "@/utils/axios";
import { useRouter } from "vue-router";
import { useStateStore } from "@/stores/state";

const store = useStateStore();
const router = useRouter();
const multipleSelection = ref([]);
const tableData = ref([
  {
    id: 0,
    source_id: 23,
    handler: 1,
    status: 1,
    remarks: 1,
  },
]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function goDetails(id) {
  store.setImageMarkId(id);
  router.push({ name: "image-mark-results" });
}

function deleteData(index: number) {
  deleteRow("", { id: index }, getTableData);
}

function getTableData() {
  dialogVisible.value = false;
  // getData(
  //   "",
  //   {
  //     page: currentPage.value,
  //     page_size: pageSize.value,
  //   },
  //   (data: any) => {
  //     tableData.value = data.list;
  //     total.value = data.total_count;
  //   }
  // );
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
