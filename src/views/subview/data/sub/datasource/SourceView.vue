<template>
  <el-card style="height: 100%; box-sizing: border-box">
    <template #header>
      <el-button type="primary" @click="onHandleCmd('add')">添加</el-button>
    </template>
    <div style="position: relative; height: 100%">
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        height="100%"
        highlight-current-row
        stripe
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="id" label="ID" width="120" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="url" label="地址" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="statusToType(scope.row.status)">
              {{ keyToName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" @click="trusteeship(scope.row)"
              >托管
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddSourceDialog v-model:visible="addDialogVisible" @add="addSource" />
    <CreateTrusteeshipDialog
      v-model:visible="trusteeshipDialogVisible"
      :source="selectSource"
      parent-type="dso"
      @create="createTrusteeship"
    />
  </el-card>
</template>

<script setup lang="ts">
import SourceOperation from "./SourceOperation.vue";
import AddSourceDialog from "./AddSourceDialog.vue";
import CreateTrusteeshipDialog from "./CreateTrusteeshipDialog.vue";
import EE from "@/utils/event";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { tableHeaderStyle } from "@/utils/style";
import { create, getData } from "@/utils/axios";
import { statusToType, keyToName } from "@/utils/util";
import { source_create, source_all, workorder_apply } from "@/utils/urlset";

const addDialogVisible = ref(false),
  trusteeshipDialogVisible = ref(false),
  detailsDrawerVisible = ref(false),
  selectSource = ref(),
  tableData = ref(),
  loading = ref(false);
function onHandleCmd(cmd) {
  switch (cmd) {
    case "add":
      addDialogVisible.value = true;
      break;
    case "reviewer":
      ElMessage.success("审核.");
      break;
    case "details":
      detailsDrawerVisible.value = true;
      ElMessage.success("详情.");
      break;
    default:
      break;
  }
}


function trusteeship(row) {
  trusteeshipDialogVisible.value = true;
  selectSource.value = row;
}

function addSource(data) {
  addDialogVisible.value = false;
  create(source_create, data, () => {
    getTableData();
  });
}

function createTrusteeship(data) {
  trusteeshipDialogVisible.value = false;
  create(workorder_apply, data, () => {
    getTableData();
  });
}

function getTableData() {
  loading.value = true;
  getData(source_all, {}, (responseData) => {
    tableData.value = responseData.data.sources;
    console.log(tableData.value, "tableData.value");
    
    loading.value = false;
  });
}

function init() {
  EE.off("refresh");
  EE.on(
    "refresh",
    () => {
      getTableData();
    },
    { data: "source" }
  );
}

onMounted(() => {
  init();
  getTableData();
});
</script>

<style scoped>
.el-menu--horizontal {
  border-bottom: 0px;
}
.el-card {
  --el-card-padding: 10px;
}
:deep(.el-card__body) {
  padding: 0px;
}

:deep(.el-card__body) {
  height: calc(100% - 49px);
  box-sizing: border-box;
}
/* :deep(.el-table .el-table__cell) {
  text-align: center;
} */
</style>
