<template>
  <div class="root-div">
    <div style="position: relative; height: calc(100% - 40px)">
      <el-table
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        height="100%"
        highlight-current-row
        stripe
      >
        <el-table-column prop="creator_id" label="创建者ID" width="120" />
        <el-table-column
          prop="details.source_url.value"
          label="数据源地址"
          width="520"
        />
        <el-table-column
          prop="details.source_type.value"
          label="数据源类型"
          width="100"
        />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="statusToType(scope.row.status)">
              {{ keyToName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button
              v-for="item in getCurrentStepOperationAction(scope.row)"
              :key="item"
              link
              type="primary"
              @click="onReviewHandel(scope.row, item)"
            >
              {{ getActionName(item) }}
            </el-button>
            <el-button link @click="details(scope.row)"> 详情 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
    <ReviewDialog v-model:visible="reviewDialogVisible" @review="reviewer" />
    <el-drawer v-model="detailsDrawerVisible" direction="ltr">
      <template #header>
        <h4>详情</h4>
      </template>
      <template #default>
        <json-viewer :value="selectWorkflow" copyable></json-viewer>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import TablePagination from "@/components/TablePagination.vue";
import ReviewDialog from "./ReviewDialog.vue";
import JsonViewer from "vue-json-viewer";
import EE from "@/utils/event";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { tableHeaderStyle } from "@/utils/style";
import { getData, put } from "@/utils/axios";
import { useStateStore } from "@/stores/state";
import { workorder_list, workorder_confirm } from "@/utils/urlset";
import { statusToType, keyToName } from "@/utils/util";

const props = defineProps(["type"]);
const reviewDialogVisible = ref(false);
const tableData = ref();
const pageSize = ref(16);
const total = ref(0);
const currentPage = ref(1);
const selectWorkflow = ref();
const detailsDrawerVisible = ref(false);
const loading = ref(false);

function getActionName(actionName) {
  if ("approve" === actionName) {
    return "审核";
  }

  return "未定义";
}

function getCurrentStepOperationAction(row) {
  const current_step = row.current_step;
  const step = row.work_flow_info.work_flow_step.find(
    (obj) => obj.order === current_step
  );
  if (undefined == step) {
    return [];
  }
  return step.operation_action;
}

function onReviewHandel(row, action) {
  selectWorkflow.value = row;
  reviewDialogVisible.value = true;
}

async function reviewer(from) {
  reviewDialogVisible.value = false;
  const store = useStateStore();
  const params = {
    work_order_id: selectWorkflow.value.id,
    operator_id: store.getUserId,
    operation: "approve",
    comment: from.comment
  };
  await put(workorder_confirm, params);
  ElMessage.success("审核成功.");
  getTableData();
}

function details(row) {
  selectWorkflow.value = row;
  detailsDrawerVisible.value = true;
  // getData(workorder_detail, {}, (responseData) => {
  //   tableData.value = responseData.list;
  // });
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData();
};

function getTableData() {
  loading.value = true;
  const store = useStateStore();
  const filter = {
    work_flow_id: {
      type: "string",
      operation: "$eq",
      value: "source_entrusting"
    }
  };

  if ("flowing" == props.type) {
    filter["current_operator"] = {
      type: "int",
      operation: "$eq",
      value: String(store.getUserId)
    };
    filter["status"] = {
      type: "string",
      operation: "$eq",
      value: props.type
    };
  } else if ("finished" == props.type) {
    filter["work_flow_info.work_flow_step.review_account"] = {
      type: "int",
      operation: "$eq",
      value: String(store.getUserId)
    };
    filter["status"] = {
      type: "string",
      operation: "$eq",
      value: props.type
    };
  } else if ("all" == props.type) {
    filter["creator_id"] = {
      type: "int",
      operation: "$eq",
      value: String(store.getUserId)
    };
  }

  const params = {
    page: currentPage.value,
    page_size: pageSize.value,
    filter: JSON.stringify(filter)
  };
  getData(workorder_list, params, (responseData) => {
    tableData.value = responseData.list;
    total.value = responseData.total_count;
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
    { data: props.type }
  );
}

onMounted(() => {
  init();
  getTableData();
});
</script>
<style scoped>
.root-div {
  position: relative;
  height: 100%;
  border: 1px solid #ebeef5;
  box-sizing: border-box;
}
.el-menu--horizontal {
  border-bottom: 0px;
}
.el-card {
  --el-card-padding: 10px;
}
:deep(.el-card__body) {
  height: 100%;
  box-sizing: border-box;
}
/* :deep(.el-table .el-table__cell) {
  text-align: center;
} */
.pagination {
  position: absolute;
  right: 50px;
  margin-top: 4px;
}
</style>
