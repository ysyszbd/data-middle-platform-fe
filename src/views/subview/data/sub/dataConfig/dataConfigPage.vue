<template>
  <div class="time_task_box">
    <taskMenu
      :activeIndex="activeIndex"
      :type="Keyword"
      @tableFun="tableFun"
      @callback="handleActiveIndex"
      @handleOffline="handleOffline"
      @openDetail="openDetail"
      @handleBatch="handleBatch"
    />
    <taskTable
      :activeIndex="activeIndex"
      :data="taskList[activeIndex][Keyword][taskList.cur_page - 1] || []"
      :listColunms="infos[activeIndex][Keyword]?.list_columns || {}"
      :labelColumns="
        {
          ...public_label_columns,
          ...infos[activeIndex][Keyword]?.label_columns,
        } || {}
      "
      :colsWidth="infos[activeIndex][Keyword]?.cols_width"
      :Keyword="Keyword"
      :loading="loading"
      :loadingText="loadingText"
      :tableBtns="menu_data[Keyword].table_btns[Number(activeIndex) - 1]"
      @tableFun="tableFun"
      @handleSelectionChange="handleSelectionChange"
      @handleOffline="handleOffline"
      @stopWorkflow="stopWorkflow"
    />
    <div class="task_pagination_css">
      <el-pagination
        v-model:current-page="taskList.cur_page"
        v-model:page-size="taskList.page_size"
        :page-sizes="[10, 20]"
        layout="sizes, prev, pager, next"
        :total="taskList.total_count"
        @size-change="handleSizeChange"
        @current-change="getTaskList()"
      />
    </div>
    <!-- 详情和修改弹窗 -->
    <taskDetailDialog
      ref="taskDialogRef"
      :dialogVisible="taskDetail.sign"
      :detailData="taskDetail.data"
      :infoData="infos"
      :activeIndex="activeIndex"
      :Keyword="Keyword"
      :labelColumns="
        {
          ...public_label_columns,
          ...infos[activeIndex][Keyword]?.label_columns,
        } || {}
      "
      :type="taskDetail.type"
      :changeInfo="changeInfo"
      :title="menu_data[Keyword].page_title[Number(activeIndex) - 1]"
      @handleDialog="handleDialog"
    />
    <!-- 弹窗 -->
    <delDialog
      :showSign="baseDialog.sign"
      :showType="baseDialog.type"
      :showKey="baseDialog.key"
      :taskingList="taskingList"
      @submit="baseFun"
      @handleDialog="handleBaseDialog"
    />
  </div>
</template>

<script setup lang="ts">
import {
  taskMenu,
  taskDetailDialog,
  taskTable,
  delDialog,
} from "@/components/dataSub/dataComponents";
import { projectGroupAPI } from "@/axios/projectGroupAPIs";
import { trainTemplateAPIs } from "@/axios/trainTemplateAPIs";
import { serviceInferenceAPIs } from "@/axios/serviceInference";
import { imageManagementAPIs } from "@/axios/imageManagement";
import { taskAPIs } from "@/axios/taskAPIs";
import { notebookAPI } from "@/axios/notebookAPIs";
import { ref, watch, nextTick, onUnmounted, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { GetRequest } from "@/utils/util";
import { menu_data, page_infos } from "@/components/dataSub/config/configData";
import public_label_columns from "@/components/dataSub/config/config";

onUnmounted(() => {
  initPage();
  init();
});

const route = useRoute();
const router = useRouter();

const activeIndex = ref((route.query.activeIndex as string) || "1"),
  Keyword = ref(),
  taskDetail = ref({
    sign: false,
    data: {},
    type: "",
  }),
  taskList: { [key: string]: any } = ref({
    cur_page: 1,
    "1": {
      repository: [[]], // 镜像仓库 // 根据页数进行新增数组管理[ [], [], [] ]
      construct: [[]], // 镜像构建
      images: [[]], // 镜像管理
      job_template_group: [[]], // 项目组--模板分类
      org_group: [[]], // 项目组--项目分组
      model_group: [[]], // 项目组--模型分组
      model_manager: [[]], // 推理服务--模型管理
      cron: [[]], // 定时处理
      offline: [[]], // 离线处理
      realtime: [[]], // 实时处理
      argo: [[]], // argo--任务模板
      notebook: [[]], // notebook
    }, // 根据页数进行新增数组管理[ [], [], [] ]
    "2": {
      cron: [[]],
      offline: [[]],
      realtime: [[]],
      argo: [[]], // argo--任务流
    },
    page_size: 20,
    total_count: 0,
    page: 1,
  }),
  infos: { [key: string]: any } = ref(page_infos),
  changeInfo = ref({}),
  baseDialog: any = ref({
    sign: false,
    list: [],
    type: "",
    operationType: "", // 批量操作batch、单个操作one
    key: "",
  }),
  taskingList: any = ref({
    name: "",
    list: [],
  }), // 任务调度列表
  loadingText = ref(""),
  loading = ref(false),
  taskDialogRef = ref();

provide("TASK_PROVIDE", {
  handleDialog,
  updateFun,
  addFun,
  Keyword,
  getTaskList,
});

const routerWatch = watch(
  () => route.path,
  (val) => {
    if (menu_data[route.name as string]) {
      init();
      activeIndex.value = "1";
      handleLoading(true);
      Keyword.value = route.name;
      console.log(Keyword.value, "Keyword.value+++++++++++");
      getTaskList();
    } else {
      routerWatch();
    }
  },
  { deep: true }
);
Keyword.value = route.name;

handleLoading(true);
getTaskList();
async function stopWorkflow(id) {
  try {
    const res: any = await taskAPIs.stopWorkflowApi(id);
    ElMessage({
      message: res.response.message,
      type: "success",
    });
  } catch (err) {
    console.log(err, "err---stopWorkflow");
  }
}
// 更新
async function updateFun(form, index = 0, type) {
  try {
    const updateArr = {
      "1": {
        repository: [imageManagementAPIs.updateRepositoryApi],
        construct: [imageManagementAPIs.updateConstructApi],
        images: [imageManagementAPIs.updateImagesApi],
        argo: [trainTemplateAPIs.updateJobTemplateApi],
        model_manager: [serviceInferenceAPIs.updateModelApi],
        job_template_group: [projectGroupAPI.updateDetailApi],
        model_group: [projectGroupAPI.updateDetailApi],
        org_group: [projectGroupAPI.updateDetailApi],
        cron: [
          taskAPIs.updateScheduleApi,
          taskAPIs.updateOfflineTwoApi,
          taskAPIs.updateOfflineThreeApi,
        ],
        offline: [
          taskAPIs.updateOfflineApi,
          taskAPIs.updateOfflineTwoApi,
          taskAPIs.updateOfflineThreeApi,
        ],
        realtime: [taskAPIs.updateRealtimeApi],
        notebook: [notebookAPI.updateDetailApi],
      },
      "2": {
        argo: [trainTemplateAPIs.updatePipelineApi],
      },
    };
    if (index != 2) form = handleParamsProject(form);
    form = {
      ...form,
      alert_status: String(form.alert_status),
    };
    const res = await updateArr[activeIndex.value][Keyword.value][index](form);
    taskDialogRef.value.handleLoading(false);
    if (type === 0) {
      ElMessage({
        message: "更新成功",
        type: "success",
      });
      handleDialog(false);
      getTaskList(true);
    } else if (type === 1) {
      let params = res.data;
      if (
        (Keyword.value === "offline" || Keyword.value === "cron") &&
        taskDialogRef.value.step_active_index === 0
      ) {
        params = {
          ...res.data,
        };
      } else if (
        (Keyword.value === "offline" || Keyword.value === "cron") &&
        taskDialogRef.value.step_active_index === 1
      ) {
        Object.keys(res.data.jobs).forEach((key) => {
          res.data.jobs[key].workflow_instance_id = res.data.instance.id;
        });

        params = {
          ...res.data.jobs,
        };
      }
      taskDialogRef.value.handleStep({ ...params });
    } else {
      ElMessage({
        message: "当前表单数据保存成功",
        type: "success",
      });
    }
  } catch (err: any) {
    console.log(err, "err--updateFun");
    if (err.response.status == 400) {
      ElMessage({
        message: "先删除job_template中的，再来删iamge！",
        type: "error",
      });
      taskDialogRef.value.handleLoading(false);
      handleDialog(false);
    }
  }
}

/**
 * @description: 创建
 * @param {*} form   创建表单数据
 * @param {*} index  创建的步骤[数组下标]
 * @param {*} type 0：当前页--关闭弹窗；1：切换下一页；2: 当前页--不关闭弹窗
 * @return {*}
 */
async function addFun(form, index, type) {
  try {
    const addArr = {
      "1": {
        repository: [imageManagementAPIs.addRepositoryApi],
        construct: [imageManagementAPIs.addConstructApi],
        images: [imageManagementAPIs.addImagesApi],
        argo: [trainTemplateAPIs.addJobTemplateApi],
        model_manager: [serviceInferenceAPIs.addModelApi],
        job_template_group: [projectGroupAPI.addApi],
        model_group: [projectGroupAPI.addApi],
        org_group: [projectGroupAPI.addApi],
        cron: [
          taskAPIs.addScheduleApi,
          taskAPIs.addOfflineTwoApi,
          taskAPIs.addOfflineThreeApi,
        ],
        offline: [
          taskAPIs.addOfflineApi,
          taskAPIs.addOfflineTwoApi,
          taskAPIs.addOfflineThreeApi,
        ],
        realtime: [taskAPIs.addRealtimeApi],
        notebook: [notebookAPI.addApi],
      },
      "2": {
        argo: [trainTemplateAPIs.addPipelineApi],
      },
    };
    if (index != 2) form = handleParamsProject(form);
    const res = await addArr[activeIndex.value][Keyword.value][index](form);
    taskDialogRef.value.handleLoading(false);
    if (type === 0) {
      ElMessage({
        message: "新建成功",
        type: "success",
      });
      init();
      handleDialog(false);
      getTaskList(true);
    } else if (type === 1) {
      let params = res.data;
      if (
        (Keyword.value === "offline" || Keyword.value === "cron") &&
        taskDialogRef.value.step_active_index === 0
      ) {
        params = {
          ...res.data.argoWorkflow,
          task_id: res.data.task.id,
        };
      } else if (
        (Keyword.value === "offline" || Keyword.value === "cron") &&
        taskDialogRef.value.step_active_index === 1
      ) {
        Object.keys(res.data.job_templates).forEach((key) => {
          res.data.job_templates[key].workflow_instance_id =
            res.data.instance.id;
          res.data.job_templates[key].job_template_id =
            res.data.job_templates[key].id;
        });

        params = {
          ...res.data.job_templates,
        };
      }
      taskDialogRef.value.handleStep({ ...params });
    } else {
      ElMessage({
        message: "当前表单数据保存成功",
        type: "success",
      });
    }
  } catch (err) {
    ElMessage({
      message: "创建失败，请重试！",
      type: "error",
    });
    taskDialogRef.value.handleLoading(false);
    handleDialog(false);
    console.log(err, "err --- addFun");
  }
}

// 获取页面配置信息
async function getInfos(id = null) {
  try {
    handleLoading(true);
    changeInfo.value = infos.value[activeIndex.value][Keyword.value];
  } catch (err) {
    console.log(err, "err--getInfos");
  }
}
// 获取任务详情
async function getTaskDetail(id) {
  try {
    const detailArr = {
      "1": {
        cron: taskAPIs.getScheduleDetailApi,
        offline: taskAPIs.getOfflineDetailApi,
        realtime: taskAPIs.getRealtimeDetailApi,
        repository: imageManagementAPIs.getRepositoryDetailApi,
        construct: imageManagementAPIs.getConstructDetailApi,
        images: imageManagementAPIs.getImageDetailApi,
        job_template_group: projectGroupAPI.getDetailApi,
        model_group: projectGroupAPI.getDetailApi,
        org_group: projectGroupAPI.getDetailApi,
        argo: trainTemplateAPIs.getJobTemplateDetailApi,
        model_manager: serviceInferenceAPIs.getModelDetailApi,
        notebook: notebookAPI.getDetailApi,
      },
      "2": {
        cron: taskAPIs.getTasklogDetailApi,
        offline: taskAPIs.getTasklogDetailApi,
        realtime: taskAPIs.getTasklogDetailApi,
        argo: trainTemplateAPIs.getPipelineApi,
      },
    };
    let params = { id: id };
    taskDialogRef.value.handleLoading(true);
    params = handleParamsProject(params);
    const res: any = await detailArr[activeIndex.value][Keyword.value](params);
    taskDetail.value.data = res.data;
    nextTick(() => {
      handleLoading(false);
    });
  } catch (err) {
    console.log(err, "err--getTaskDetailApi");
  }
}
//
async function tableFun(key, item) {
  console.log(item, "item");
  // return;
  taskDetail.value.type = key;
  if (key === "enter") {
    let srcObj = {
      argo: "/data/data-process/task-detail",
      offline: "/data/data-process/task-iframe",
      cron: "/data/data-process/task-iframe",
      // notebook: "/notebook/jupyter/" + item.name + "/#/home/project",
    };
    if (Keyword.value === "notebook") {
      window.open(
        `http://192.168.1.111/notebook/jupyter/${item.name}/#/home/project`,
        "_blank"
      ) as Window;
    } else {
      router.replace({
        path: srcObj[Keyword.value],
        query: {
          id: item.id,
          page: route.path,
          name: item.name,
          keyword: Keyword.value,
        },
      });
    }
    return;
  }
  if (key === "update") {
    getInfos(item.id);
  }
  if (key === "update" || key === "detail") {
    getTaskDetail(item.id);
    handleDialog(true);
    return;
  }
  let dialogObj = {
    del: "删除",
    clear: "clear",
    debug: "debug",
    cron: "执行 定时",
    offline: "执行 离线",
    stop: "stop",
    reset: "reset",
    list: "任务调度列表",
  };
  if (dialogObj[key]) {
    baseDialog.value.list = [item.id];
    if (key === "list") getLists(item.name);
    if (key === "del" || key === "stop") handleBatch();
    baseDialog.value.type = dialogObj[key];
    baseDialog.value.key = key;
    handleBaseDialog(true);
    return;
  }
  if (key === "add") {
    taskDetail.value.type = key;
    handleDialog(true);
    return;
  }
}
// 获取任务调度列表
async function getLists(name) {
  try {
    const res: any = await taskAPIs.getListing({ name: name });
    taskingList.value.name = name;
    taskingList.value.list = res.data;
  } catch (err) {
    console.log(err, "err---getLists");
    
  }
}
// 查看详情
function openDetail(val, type) {
  taskDetail.value.type = type;
  if (type === "修改") {
    getInfos(val.id);
  }
  if (type != "新增") {
    getTaskDetail(val.id);
  }
  console.log(val, "val");
  handleDialog(true);
}
function handleDialog(val) {
  taskDetail.value.sign = val;
  if (!val) {
    taskDetail.value.type = "";
    taskDetail.value.data = {};
    changeInfo.value = {};
  }
}

// 获取列表  refreshSign:强制获取列表数据标识
async function getTaskList(refreshSign = false) {
  try {
    if (
      !refreshSign &&
      taskList.value[activeIndex.value][Keyword.value] &&
      taskList.value[activeIndex.value][Keyword.value]?.length > 0 &&
      taskList.value[activeIndex.value][Keyword.value][
        taskList.value.cur_page - 1
      ]?.length
    )
      return;
    loadingText.value = `列表加载中，请稍等...`;
    loading.value = true;
    const ListArr = {
      "1": {
        cron: taskAPIs.getArgoworkflowInstanceListApi,
        offline: taskAPIs.getArgoworkflowInstanceListApi,
        realtime: taskAPIs.getRealtimeListApi,
        repository: imageManagementAPIs.getRepositoryListApi,
        construct: imageManagementAPIs.getConstructListApi,
        images: imageManagementAPIs.getImagesListApi,
        argo: trainTemplateAPIs.getJobTemplateListApi,
        model_manager: serviceInferenceAPIs.getModelListApi,
        job_template_group: projectGroupAPI.getListApi,
        model_group: projectGroupAPI.getListApi,
        org_group: projectGroupAPI.getListApi,
        notebook: notebookAPI.getListApi,
      },
      "2": {
        cron: taskAPIs.getTaskinstanceListApi,
        offline: taskAPIs.getTaskinstanceListApi,
        realtime: taskAPIs.getTaskinstanceListApi,
        argo: trainTemplateAPIs.getPipelineListApi,
      },
    };
    let params = {
      page: taskList.value.cur_page,
      page_size: taskList.value.page_size,
    };
    params = handleParamsProject(params);
    const res: any = await ListArr[activeIndex.value][Keyword.value](params);
    taskList.value.cur_page = res.cur_page;
    taskList.value.total_count = res.total_count;
    taskList.value.page = Math.ceil(res.total_count / taskList.value.page_size);

    taskList.value[activeIndex.value][Keyword.value] = new Array(
      taskList.value.page
    ).fill([]);
    taskList.value[activeIndex.value][Keyword.value][res.cur_page - 1] =
      res.list;
    nextTick(() => {
      // debugger
      loadingText.value = ``;
      loading.value = false;
      handleLoading(false);
    });
  } catch (err) {
    console.log(err, "err---getTaskInfos");
  }
}
// 批量处理事件
function handleOffline(val, type, list = []) {
  if (
    !baseDialog.value.list.length &&
    (type === "offline" || type === "cron")
  ) {
    ElMessage({
      message: "请先选择要操作的任务！",
      type: "warning",
    });
    return;
  }
  if (type === "one") {
    baseDialog.value.list = list;
  }
  handleBaseDialog(true);
  baseDialog.value.type = val;
  baseDialog.value.operationType = type;
}
// 基础弹窗确定事件
function baseFun(data = null) {
  if (baseDialog.value.key === "del") {
    delFun();
    return;
  }
  notebookFun(baseDialog.value.key, baseDialog.value.list[0], data);
  argoFun(baseDialog.value.key, baseDialog.value.list[0], data);
}
async function notebookFun(type, id, data) {
  // debugger
  try {
    if (Keyword.value !== "notebook") return;
    const apiArr = {
      1: {
        stop: notebookAPI.stopApi,
        reset: notebookAPI.resetApi,
      },
    };
    if (!apiArr[activeIndex.value][type]) return;
    loadingText.value = `${type} 中，请稍等...`;
    loading.value = true;
    const res = await apiArr[activeIndex.value][type](baseDialog.value.list);
    if (res.code === 200) {
      ElMessage({
        message: `${type} 成功！`,
        type: "success",
      });
    } else {
      ElMessage({
        message: "接口调用失败，请点击重试！",
        type: "error",
      });
    }
    loadingText.value = ``;
    loading.value = false;
    handleBaseDialog(false);
  } catch (err) {
    loadingText.value = ``;
    loading.value = false;
    ElMessage({
      message: "接口调用失败，请点击重试！",
      type: "error",
    });
    handleBaseDialog(false);
    console.log(err, "err--notebookFun");
  }
}
// 删除
async function delFun() {
  try {
    const delArr = {
      "1": {
        cron: trainTemplateAPIs.delArgoworkflowInstanceApi,
        offline: trainTemplateAPIs.delArgoworkflowInstanceApi,
        realtime: taskAPIs.delTaskRealtimeApi,
        repository: imageManagementAPIs.delRepositoryApi,
        construct: imageManagementAPIs.delConstructApi,
        images: imageManagementAPIs.delImagesApi,
        argo: trainTemplateAPIs.delJobTemplateApi,
        model_manager: serviceInferenceAPIs.delModelApi,
        job_template_group: projectGroupAPI.delApi,
        model_group: projectGroupAPI.delApi,
        org_group: projectGroupAPI.delApi,
        notebook: notebookAPI.delApi,
      },
      "2": {
        cron: taskAPIs.delTasklogApi,
        offline: taskAPIs.delTasklogApi,
        realtime: taskAPIs.delTasklogApi,
        argo: trainTemplateAPIs.delPipelineApi,
      },
    };
    let params = { ids: baseDialog.value.list };
    params = handleParamsProject(params);
    const res = await delArr[activeIndex.value][Keyword.value](params);
    handleBaseDialog(false);
    getTaskList(true);
    baseDialog.value.list = [];
    baseDialog.value.type = "";
    baseDialog.value.operationType = "";
    ElMessage({
      message: `${baseDialog.value.type}成功！`,
      type: "warning",
    });
  } catch (err: any) {
    if (err.response.status == 400) {
      ElMessage({
        message: "删除失败！",
        // message: "先删除job_template中的，再来删iamge！",
        type: "error",
      });
      handleBaseDialog(false);
    }
    console.log(err, "delFun");
  }
}
function handleBaseDialog(val) {
  if (val === baseDialog.value.sign) return;
  baseDialog.value.sign = val;
}
// 当前选中的菜单tab的下标
function handleActiveIndex(index) {
  if (index === activeIndex.value) return;
  handleURL(window.location.href, [{ key: "activeIndex", value: index }]);
  initPage();
  activeIndex.value = index;
  // needLogin.value = true;
  handleLoading(true);
  getTaskList(false);
}
function handleLoading(val) {
  loading.value = val;
}
// 多选table事件
function handleSelectionChange(val) {
  baseDialog.value.list = [];
  val.forEach((item) => {
    baseDialog.value.list.push(item.id);
  });
}
function handleURL(url, objArr) {
  const queryObj: { [key: string]: any } =
    GetRequest(window.location.search) || {};
  let str = "";
  objArr.forEach((ele) => {
    queryObj[ele.key] = ele.value;
  });
  const arr = Object.keys(queryObj);
  arr.forEach((ele, index) => {
    str = `${str}${ele}=${queryObj[ele]}${index != arr.length - 1 ? "&" : ""}`;
  });
  const path = window.location.origin + window.location.pathname + "?" + str;
  history.pushState("", "", path); // 不刷新页面
}
// 处理个别页面需要加额外参数得情况
function handleParamsProject(params) {
  const projectType = {
    job_template_group: "job-template",
    model_group: "model",
    org_group: "org",
    cron: "cron",
    offline: "offline",
    realtime: "realtime",
    // argo: "cron",
  };
  const typeObj = {
    cron: "cron",
    offline: "offline",
  };
  let obj = params;
  if (projectType[Keyword.value]) {
    obj = {
      ...params,
      keyword: projectType[Keyword.value],
      type: typeObj[Keyword.value] ? typeObj[Keyword.value] : null,
    };
  }
  return obj;
}
// argo-任务模板操作事件
async function argoFun(type, id, data) {
  try {
    if (Keyword.value !== "argo") return;
    const apiArr = {
      1: {
        debug: taskAPIs.taskWorkDebugApi,
        clear: taskAPIs.taskWorkClearApi,
      },
      2: {
        cron: taskAPIs.argoRunCron,
        offline: taskAPIs.argoRunOffline,
      },
    };
    if (!apiArr[activeIndex.value][type]) return;
    loadingText.value = `${type} 中，请稍等...`;
    loading.value = true;
    const res = await apiArr[activeIndex.value][type]({
      id: id,
      ...data,
    });
    if (res.code === 200) {
      if (type === "debug") {
        // const data: any = await taskAPIs.taskApi(res.data, {});
        // if (data.code === 200) {
        // }
        openNewPage(`http://192.168.1.111${res.data}`);
        loadingText.value = ``;
        loading.value = false;
      } else {
        ElMessage({
          message: `${type} 成功！`,
          type: "success",
        });
      }
      getTaskList(true);
    } else {
      ElMessage({
        message: res.response.message,
        type: "warning",
      });
      loadingText.value = ``;
      loading.value = false;
    }
    handleBaseDialog(false);
  } catch (err) {
    loadingText.value = ``;
    loading.value = false;
    ElMessage({
      message: "接口调用失败，请点击重试！",
      type: "error",
    });
    handleBaseDialog(false);
    console.log(err, "err---argoFun");
  }
}
function openNewPage(url) {
  window.open(url, "_blank") as Window;
  // newWeb.location.href = `http://192.168.1.48${data.data.url}`;
}
// 批量处理事件
function handleBatch(obj = { text: "", key: "" }) {
  // debugger
  if (!baseDialog.value.list.length) {
    ElMessage({
      message: "请先选择要操作的任务！",
      type: "warning",
    });
  } else {
    baseDialog.value.type = obj.text;
    baseDialog.value.key = obj.key;
    handleBaseDialog(true);
  }
}

// 修改每一页的个数
function handleSizeChange(val) {
  handleLoading(true);
  taskList.value.page_size = val;
  initPage();
  getTaskList();
}
function initPage() {
  taskList.value = {
    ...taskList.value,
    cur_page: 1,
    "1": {
      repository: [[]], // 镜像仓库 // 根据页数进行新增数组管理[ [], [], [] ]
      construct: [[]], // 镜像构建
      images: [[]], // 镜像管理
      job_template_group: [[]], // 项目组--模板分类
      org_group: [[]], // 项目组--项目分组
      model_group: [[]], // 项目组--模型分组
      model_manager: [[]], // 推理服务--模型管理
      cron: [[]], // 定时处理
      offline: [[]], // 离线处理
      realtime: [[]], // 实时处理
      argo: [[]], // argo--任务【任务模板】
      notebook: [[]], // notebook
    }, // 根据页数进行新增数组管理[ [], [], [] ]
    "2": {
      cron: [[]],
      offline: [[]],
      realtime: [[]],
      argo: [[]], // argo--任务流
    },
    total_count: 0,
  };
}
function init() {
  taskDetail.value = {
    sign: false,
    data: {},
    type: "",
  };
  initPage();
  changeInfo.value = {};
}
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped lang="scss">
:deep(.el-main) {
  padding: 20px 0 0 0 !important;
}
.time_task_box {
  min-width: 1200px;
  .task_pagination_css {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: row-reverse;
  }
}
.del_dialog_text {
  display: flex;
  align-items: center;
  .del_icon {
    margin-right: 5px;
  }
}
</style>
