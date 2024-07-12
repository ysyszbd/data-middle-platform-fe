<template>
  <div class="root">
    <OperationBar
      creatButton="创建采集任务"
      deleteButton=""
      @onCreatButtonHandel="dialogVisible = true"
    />
    <CollectInfoEdit @submit="createData" />
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
      <el-table-column prop="car_plate" label="车辆" />
      <!-- <el-table-column prop="parent_id" label="ParentID" /> -->
      <!-- <el-table-column prop="handler" label="handler" /> -->
      <!-- <el-table-column prop="place" label="Place" /> -->
      <el-table-column prop="start_mile" label="开始里程" />
      <el-table-column prop="end_mile" label="结束里程" />
      <el-table-column prop="start_time" label="起始时间" />
      <el-table-column prop="end_time" label="结束时间" />
      <el-table-column prop="remarks" label="Remarks" />
      <el-table-column prop="status" label="状态" />
      <el-table-column fixed="right" label="操作" width="80">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click.prevent="details(scope.row.id)"
          >
            详情
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
import { tableHeaderStyle } from "@/utils/style";
import { create, getData } from "@/utils/axios";
import CollectInfoEdit from "@/components/subComponents/CollectInfoEdit.vue";
import OperationBar from "@/components/OperationBar.vue";
import TablePagination from "@/components/TablePagination.vue";
import { useRouter } from "vue-router";
import { collectiontask_create, collectiontask_list } from "@/utils/urlset";

const router = useRouter();

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const multipleSelection = ref([]);

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function createData(form: any) {
  create(collectiontask_create, form, getTableData);
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData();
};

function getTableData() {
  dialogVisible.value = false;
  getData(
    collectiontask_list,
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

// function deleteSelection() {
//   let data = new Array<number>();
//   for (let index = 0; index < multipleSelection.value.length; index++) {
//     const element = multipleSelection.value[index];
//     data.push(element.id);
//   }
//   deleteRow(collectiontask_deleteBatch, { ids: data }, getTableData);
// }

onMounted(() => {
  getTableData();
});

function details(data: any) {
  router.push({
    name: "collect-task-details",
    params: { id: data },
  });
}
</script>

<style scoped src="@/assets/css/base.css"></style>
