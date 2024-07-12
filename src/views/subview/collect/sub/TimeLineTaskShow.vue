<template>
  <div class="root">
    <OperationBar
      creatButton=""
      deleteButton="删除选中"
      @onDeleteButtonHandel="deleteSelection"
    />
    <TimelineInfoUpdate @update="updateData" />
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
      <el-table-column prop="source_id" label="源" />
      <el-table-column prop="handler" label="人员" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button
            text
            type="primary"
            size="small"
            @click.prevent="details(scope.row.id)"
          >
            详情
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
import { tableHeaderStyle } from "@/utils/style";
import { getData, deleteRow, updateIdParameter } from "@/utils/axios";
import { useRouter } from "vue-router";

import TimelineInfoUpdate from "@/components/subComponents/TimelineInfoUpdate.vue";
import OperationBar from "@/components/OperationBar.vue";
import TableOperation from "@/components/TableOperation.vue";
import TablePagination from "@/components/TablePagination.vue";

import { useStateStore } from "@/stores/state";
import {
  labeltask_delete,
  labeltask_deleteBatch,
  labeltask_list,
  labeltask_update,
} from "@/utils/urlset";

const store = useStateStore();
const router = useRouter();

const multipleSelection = ref([]);

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

function details(data) {
  router.push({
    name: "timeline-task-details",
    params: { id: data },
  });
}

function deleteData(index: number) {
  deleteRow(labeltask_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element: any = multipleSelection.value[index];
    data.push(element.id);
  }
  deleteRow(labeltask_deleteBatch, { ids: data }, getTableData);
}

function update(index: any) {
  dialogUpdateVisible.value = true;
  updateTableData.value = index;
}

function updateData(form: any) {
  updateIdParameter(labeltask_update, form, getTableData);
}

function getTableData() {
  dialogUpdateVisible.value = false;
  getData(
    labeltask_list,
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
