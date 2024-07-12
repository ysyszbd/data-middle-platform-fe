<template>
  <div class="root">
    <ExportDataDialog
      :ablum_id="exportDataId"
      title="导出数据"
      @submit="exportData"
    />
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect($event)"
    >
      <el-menu-item
        :index="item.key"
        v-for="item in workPoints.options"
        :key="item.key"
        >{{ item.name }}</el-menu-item
      >
      <div class="flex-grow"></div>
      <div class="draw_list_top">
        <el-select v-model="workRole.key" class="m-2" placeholder="请选择角色">
          <el-option
            v-for="item in workRoleList"
            :key="item.key"
            :label="item.name"
            :value="item.key"
            @click="selectRole(item)"
          />
        </el-select>
      </div>
    </el-menu>

    <div ref="dataRoot" class="task_list">
      <el-table
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :header-cell-style="tableHeaderStyle"
        table-layout="auto"
      >
        <el-table-column prop="id" label="任务ID" />
        <el-table-column prop="album_id" label="文件ID" />
        <el-table-column prop="album_name" label="文件名" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="handler" label="人员" />
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="goDetails(scope.row)"
              :disabled="workRole.order > 0 && workRole.order != activeIndex"
            >
              {{
                activeIndex == "7"
                  ? "查看"
                  : scope.row.work_order_info.work_flow_info.work_flow_step[
                      Number(activeIndex)
                    ].name
              }}
            </el-button>
            <el-button
              v-for="(ele, i) in scope.row.work_order_info.work_flow_info
                .work_flow_step[Number(activeIndex)].operation_action"
              :key="i"
              link
              :type="taskBtnArr[ele].type"
              size="small"
              :disabled="workRole.order > 0 && workRole.order != activeIndex"
              @click.prevent="openTaskDialog(scope.row, ele)"
            >
              {{ taskBtnArr[ele].value }}
            </el-button>
            <el-button
              type="info"
              link
              size="small"
              @click="openDrawer(scope.row, scope.$index)"
              >详情</el-button
            >
            <el-button
              link
              type="success"
              size="small"
              v-if="scope.row.status == 7"
              @click.prevent="exportD(scope.row?.album_id)"
            >
              导出
            </el-button>
            <!-- <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="确定删除本条数据吗？"
              @confirm="deleteData(scope.row.id)"
            >
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
    <!-- 修改任务状态弹窗 -->
    <el-dialog
      v-model="operationData.sign"
      title="操作提示"
      width="350"
      align-center
      :close-on-click-modal="false"
      class="operation_dialog"
      @close="operationData.sign = false"
    >
      <h3 class="operation_text">
        {{
          `确定要 ${taskBtnArr[operationData.type].value} 任务( ID:${
            operationData.data.id
          } )吗？`
        }}
      </h3>
      <div class="operation_footer">
        <el-button type="danger" class="submit_btn" @click="updataTask">
          {{ `确定${taskBtnArr[operationData.type].value}` }}
        </el-button>
        <el-button @click="operationData.sign = false">取消</el-button>
      </div>
    </el-dialog>
    <el-drawer
      v-model="drawerData.sign"
      :title="`标注任务( ID:${operationData.data.id} )详情`"
      direction="rtl"
      @close="closeDrawer"
    >
      <div class="task_detail_draw">
        <taskWorkStep
          :class="['task_work_box_disabled']"
          v-if="drawerData.tabIndex === 0"
          :workFlowInfo="
            operationData.data?.work_order_info?.work_flow_info
              ?.work_flow_step || []
          "
          :work_order_id="operationData.data.work_order_id"
          :currentStep="operationData.data?.work_order_info?.current_step"
          :activeIndex="drawerData.tabIndex"
          :sign="0"
          :seat="`list`"
          @callback="updateTaskEnd"
          :disabled="workRole.order > 0 && workRole.order != activeIndex"
        />
        <taskHistory
          v-if="drawerData.tabIndex === 1"
          class="task_history"
          :taskHistoryList="operationData.data?.work_order_info?.history || []"
        />
        <div class="draw_tabs_box task_footer">
          <div
            :class="[
              'draw_tab',
              drawerData.tabIndex === index ? 'draw_tab_active' : '',
            ]"
            v-for="(item, index) in drawerData.tabsArr"
            :key="index"
            @click="drawerData.tabIndex = index"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from "vue";
import ExportDataDialog from "@/components/subComponents/ExportDataDialog.vue";
import TablePagination from "@/components/TablePagination.vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, deleteRow } from "@/utils/axios";
import { useRouter } from "vue-router";
import { useStateStore } from "@/stores/state";
import { labeltask_delete, labeltask_list } from "@/utils/urlset";
import { windowResizeEvent } from "@/utils/util";
import { workRoleList, workPoints } from "@/components/draw/drawData";
import { ElMessage } from "element-plus";
import { updataTaskApi } from "@/axios/markResultsView";
import { taskWorkStep, taskHistory } from "@/components/draw/drawComponents";

const store = useStateStore();
const router = useRouter();

const activeIndex = ref(workPoints.options[0].key),
  workRole: any = ref({
    key: workRoleList[0].key,
    name: workRoleList[0].name,
  }),
  drawerData = ref({
    tabsArr: ["父工作流", "历史"],
    sign: false,
    tabIndex: 0,
    taskIndex: -1,
  }),
  operationData: any = ref({
    sign: false,
    data: { work_order_id: "" },
    type: "",
  }),
  taskBtnArr = {
    approve: {
      value: "提交",
      type: "success",
    },
    annotation_reject: {
      value: "打回",
      type: "danger",
    },
  };

const dataRoot = ref();
const tableHeight = ref(600);
const multipleSelection = ref([]);
const tableData = ref([]);
const total = ref(0);
const pageSize = ref(15);
const currentPage = ref(1);
const exportDataId = ref();
const exportDataDialogVisible = ref(false);
provide("exportDataDialogVisible", exportDataDialogVisible);

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};
function closeDrawer() {
  console.log("closeDrawer");
  drawerData.value.tabIndex = 0;
  drawerData.value.taskIndex = 0;
  operationData.value.data = {};
  drawerData.value.sign = false;
}
function openDrawer(item, index) {
  drawerData.value.taskIndex = index;
  drawerData.value.sign = true;
  operationData.value.data = item;
}
function updateTaskEnd(order, operation) {
  ElMessage({
    message: `${taskBtnArr[operation].value} 任务完成！`,
    type: "success",
  });
  getTableData();
  closeDrawer();
}
async function updataTask() {
  try {
    const res = (await updataTaskApi({
      work_order_id: operationData.value.data.work_order_id,
      operation: operationData.value.type,
      comment: `${store.getUser} 作为 ${workRole.value.name} ${
        taskBtnArr[operationData.value.type].value
      } 该任务;`,
    })) as { code: number; message: string };
    if (res.code === 200) {
      getTableData();
      ElMessage({
        message: res.message,
        type: "success",
      });
      operationData.value.sign = false;
    }
  } catch (err) {
    console.log(err, "updataTask--err");
  }
}
// 选择工作节点
function handleSelect(val) {
  activeIndex.value = val;
  console.log(activeIndex.value, "activeIndex.value");

  getTableData();
}
// 选择角色
function selectRole(val) {
  workRole.value = { ...val };
  getTableData();
}
function openTaskDialog(item, type) {
  operationData.value.type = type;
  operationData.value.sign = true;
  operationData.value.data = item;
}
function goDetails(row) {
  store.setTimeLineTaskId(row.album_id);
  store.setDrawTaskData({
    album_id: row.album_id,
    task_id: row.id,
    role: workRole.value.order,
    work_order_id: row.work_order_id,
  });
  store.setMarkTaskType(row.object);
  router.push({ name: "timeline-task-details" });
  // router.push({ name: "image-mark-results" });
}

function exportD(id) {
  exportDataDialogVisible.value = true;
  exportDataId.value = [id];
}

function exportData() {
  // exportDataDialogVisible.value = false;
}

function deleteData(index: number) {
  deleteRow(labeltask_delete, { id: index }, getTableData);
}

function getTableData() {
  exportDataDialogVisible.value = false;
  getData(
    labeltask_list,
    {
      page: currentPage.value,
      page_size: pageSize.value,
      keyword: store.getUserId,
      type: "env_tag",
      work_flow_order: activeIndex.value,
      role_type: workRole.value.key,
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
// 根据浏览器的高度计算每页需要多少条数据--只判断高度
function getTableDivHeight() {
  if (tableHeight.value !== dataRoot.value.clientHeight) {
    tableHeight.value = dataRoot.value.clientHeight;
    pageSize.value = Math.floor((tableHeight.value - 82) / 41);
    getTableData();
  }
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
<style scoped src="@/assets/css/draw.scss"></style>
<style lang="scss" scoped>
.root {
  min-width: 1200px;
  .task_list {
    height: calc(100% - 100px);
  }
  .draw_list_top {
    padding: 0px 20px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .top_name {
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
  }
  .flex-grow {
    flex-grow: 1;
  }
  .operation_dialog {
    .operation_text {
      width: 100%;
      height: 90px;
      text-align: center;
    }
    .operation_footer {
      height: 40px;
      display: flex;
      flex-direction: row-reverse;
      .submit_btn {
        width: 100px;
        margin-left: 10px;
      }
    }
  }
}
.task_detail_draw {
  width: 100%;
  height: 100%;
  position: relative;
  .task_work_box_disabled {
    :deep(.work_step_btn_box) {
      .work_step_btn_item {
        :deep(.box-inner) {
          background-image: linear-gradient(
              rgba(2, 31, 64, 0.5),
              rgba(79, 80, 82, 0.5)
            ),
            linear-gradient(
              180deg,
              rgba(36, 144, 220, 0.41),
              rgb(151, 152, 153)
            ) !important;
        }
      }
    }
  }
  .task_history {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    padding-bottom: 40px;
  }
  .task_footer {
    position: absolute;
    bottom: 0;
  }
}
:deep(.el-drawer__body) {
  padding: 0 !important;
}
</style>
