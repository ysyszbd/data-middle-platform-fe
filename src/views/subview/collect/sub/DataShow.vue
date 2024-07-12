<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      highlight-current-row
      :header-cell-style="tableHeaderStyle"
      table-layout="auto"
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="car_plate" label="车辆" />
      <el-table-column prop="people" label="人员" />
      <el-table-column prop="duration" label="时长" />
      <el-table-column prop="mileage" label="里程" />
      <el-table-column prop="data_count" label="数据量" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button
            text
            type="primary"
            size="small"
            @click.prevent="details(scope.row.id)"
          >
            打开详情
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
import { getData } from "@/utils/axios";
import { useRouter } from "vue-router";
import TablePagination from "@/components/TablePagination.vue";
import { collectiontask_list } from "@/utils/urlset";

const router = useRouter();

const tableData = ref([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData();
};

function getTableData() {
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

onMounted(() => {
  getTableData();
});

function details(data: any) {
  router.push({
    name: "data-management-details",
    params: { id: data },
  });
}
</script>

<style scoped src="@/assets/css/base.css"></style>
