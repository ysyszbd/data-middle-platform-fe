import { get, post, put, delBody } from "@/utils/axios";
const cubeConfig = {
  baseURL: "/cube",
  header: {
    "content-type": "application/x-www-form-urlencoded",
  },
};
export function getTaskTools(params) {
  return get("/api/preprocess/task/labeltask/task_tools", params);
}
export function getFilesApi(params) {
  return get("/api/file/file/list", params);
}

// 登录cube
export function taskLoginApi(params) {
  return post("/login/", params, {
    baseURL: "/cube",
    header: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });
}
// 新增任务--定时
export function addScheduleApi(params) {
  return post("/api/dataprocessing/scheduletask/create", params);
}
// 新增任务--离线--第一步
export function addOfflineApi(params) {
  return post("/api/dataprocessing/offlinetask/create", params);
}
// 新增任务--离线--第2步
export function addOfflineTwoApi(params) {
  return post("/api/dataprocessing/argoworkflowinstance/create", params);
}
// 新增任务--离线--第3步
export function addOfflineThreeApi(params) {
  return post("/api/dataprocessing/jobinstance/create", params);
}
// 新增任务--实时
export function addRealtimeApi(params) {
  return post("/api/dataprocessing/realtimetask/create", params);
}
// 获取列表--定时
// export function getScheduleListApi(params) {
//   return get("/api/dataprocessing/argoworkflowinstance/list", params);
// }
// 获取列表--实时
export function getRealtimeListApi(params) {
  return get("/api/dataprocessing/realtimetask/list", params);
}
// 获取列表--离线
export function getArgoworkflowInstanceListApi(params) {
  return get("/api/dataprocessing/argoworkflowinstance/list", params);
}
// 获取列表--实例--根据参数区分【定时、离线、实时】
export function getTaskinstanceListApi(params) {
  return get("/api/dataprocessing/jobinstance/list", params);
}
// 获取列表--日志--根据参数区分【定时、离线、实时】
export function getTasklogListApi(params) {
  return get("/api/dataprocessing/tasklog/list", params);
}
// 获取任务流列表--任务流历史
export function getTaskHistoryApi(params) {
  return get("/api/data/history/list", params);
}
// 获取任务流配置
export function getCubeListInfos(params) {
  return get("/pipeline_modelview/api/_info", { id: params }, cubeConfig);
}
// 获取调度配置
export function getCubeLogInfos(params) {
  return get("/runhistory_modelview/api/_info", { id: params }, cubeConfig);
}
// 获取运行实例配置
export function getCubeRunInfos(params) {
  return get("/workflow_modelview/api/_info", { id: params }, cubeConfig);
}
// 获取任务详情--定时
export function getScheduleDetailApi(params) {
  return get("/api/dataprocessing/scheduletask/detail", params);
}
// 获取任务详情--离线
export function getOfflineDetailApi(params) {
  return get("/api/dataprocessing/offlinetask/detail", params);
}
// 获取任务详情--实时
export function getRealtimeDetailApi(params) {
  return get("/api/dataprocessing/realtimetask/detail", params);
}
// 获取任务详情--实例--根据参数区分【定时、离线、实时】
export function getTaskinstanceDetailApi(params) {
  return get("/api/dataprocessing/taskinstance/detail", params);
}
// 获取任务详情--日志--根据参数区分【定时、离线、实时】
export function getTasklogDetailApi(params) {
  return get("/api/dataprocessing/tasklog/detail", params);
}
// 获取任务详情--日志
export function getTaskHistoryDetailApi(params) {
  return get("/api/data/history/detail", params);
}
// 获取任务详情--实例
export function getTaskWorkflowDetailApi(params) {
  return get("/api/data/workflow/detail", params);
}
// 修改任务详情信息--定时
export function updateScheduleApi(params) {
  return put("/api/dataprocessing/scheduletask/update", params);
}
// 修改任务详情信息--离线--第1步
export function updateOfflineApi(params) {
  return put("/api/dataprocessing/offlinetask/update", params);
}
// 修改任务详情信息--离线--第2步
export function updateOfflineTwoApi(params) {
  return put("/api/dataprocessing/argoworkflowinstance/update", params);
}
// 修改任务详情信息--离线--第3步
export function updateOfflineThreeApi(params) {
  return put("/api/dataprocessing/jobinstance/update", params);
}
// 修改任务详情信息--实时
export function updateRealtimeApi(params) {
  return put("/api/dataprocessing/realtimetask/update", params);
}
// 批量删除任务--实时
export function delTaskRealtimeApi(params) {
  return delBody("/api/dataprocessing/realtimetask/delete", params);
}
// 批量删除任务--日志--根据参数区分【定时、离线、实时】
export function delTasklogApi(params) {
  return delBody("/api/dataprocessing/tasklog/delete", params);
}
// 批量删除任务--实例--根据参数区分【定时、离线、实时】
export function delTaskinstanceApi(params) {
  return delBody("/api/dataprocessing/taskinstance/delete", params);
}
// 任务流实例--停止
export function stopWorkflowApi(params) {
  return get("/api/dataprocessing/offlinetask/stop/" + params, {});
}
// 离线处理--debug
export function taskDebugApi(params) {
  return get("/api/dataprocessing/jobtemplate/debug/" + params, {});
}
// 任务详情--run
export function taskRunApi(params) {
  return get("/api/dataprocessing/offlinetask/run/" + params, {});
}
// 任务详情--monitoring
export function taskMonitoringApi(params) {
  return get("/api/dataprocessing/offlinetask/monitoring/" + params, {});
}
// 任务详情--pod
export function taskPodApi(params) {
  return get("/api/dataprocessing/offlinetask/pod/" + params, {});
}
// 任务详情--log
export function taskLogApi(params) {
  return get("/api/dataprocessing/offlinetask/log/" + params, {});
}
// argo--任务模板【作业模板】--clear
export function taskWorkClearApi(params) {
  return get("/api/dataprocessing/jobtemplate/clear/" + params.id, {});
}
// argo--任务模板【作业模板】--debug
export function taskWorkDebugApi(params) {
  return get("/api/dataprocessing/jobtemplate/debug/" + params.id, {});
}
// argo--任务模板【作业模板】--run
export function taskWorkRunApi(params) {
  return get("/api/dataprocessing/jobtemplate/run/" + params, {});
}
// argo--任务模板【作业模板】--log
export function taskWorkLogApi(params) {
  return get("/api/dataprocessing/jobtemplate/log/" + params, {});
}

// 任务详情--功能按钮的又一层点击调用
export function taskApi(url, params) {
  return get(url, params);
}

// 获取 模板 选择列表
export function getTemplateSelect(params) {
  return post("/api/dataprocessing/argoworkflowtemplate/all", params);
}
// 获取 项目组 列表
export function getProjectSelect(params) {
  return post("/api/sys/project/all", params);
}
// 获取 仓库 选择列表
export function getRepositorySelect(params) {
  return post("/api/docker/repository/all", params);
}
// 获取 镜像 选择列表
export function getImagesSelect(params) {
  return post("/api/docker/images/all", params);
}
// 获取 任务调度--定时处理 选择列表
export function getScheduleSelect(params) {
  return post("/api/dataprocessing/scheduletask/all", params);
}
// 获取 任务调度--定时处理 启动
export function getScheduleEnable(params) {
  return get("/api/dataprocessing/scheduletask/enable/" + params, {});
}
// 获取 任务调度--定时处理 禁用
export function getScheduleDisable(params) {
  return get("/api/dataprocessing/scheduletask/disable/" + params, {});
}
// 获取 任务调度--定时处理 暂停
export function getSchedulePause(params) {
  return get("/api/dataprocessing/scheduletask/pause/" + params, {});
}
// 获取 任务调度--定时处理 监控
export function getScheduleMonitoring(params) {
  return get("/api/dataprocessing/scheduletask/monitoring/" + params, {});
}
// 获取 任务调度--定时处理 日志
export function getScheduleLog(params) {
  return get("/api/dataprocessing/scheduletask/log/" + params, {});
}
// 获取 任务调度--定时处理 pod
export function getSchedulePod(params) {
  return get("/api/dataprocessing/scheduletask/pod/" + params, {});
}
// argo--任务模板--离线任务
export function argoRunOffline(params) {
  return post("/api/dataprocessing/argoworkflowtemplate/run_offline", params);
}
// argo--任务模板--定时
export function argoRunCron(params) {
  return post("/api/dataprocessing/argoworkflowtemplate/run_cron", params);
}

// 获取 任务调度列表
export function getListing(params) {
  return get("/api/dataprocessing/argoworkflowinstance/cron_list", params);
}

export const taskAPIs = {
  getListing,
  argoRunCron,
  argoRunOffline,
  getScheduleEnable,
  getScheduleDisable,
  getSchedulePause,
  getScheduleMonitoring,
  getScheduleLog,
  getSchedulePod,
  getTaskTools,
  getFilesApi,
  taskLoginApi,
  addScheduleApi,
  addOfflineApi,
  addRealtimeApi,
  getArgoworkflowInstanceListApi,
  getRealtimeListApi,
  getTaskinstanceListApi,
  getTasklogListApi,
  getTaskHistoryApi,
  getCubeListInfos,
  getCubeLogInfos,
  getCubeRunInfos,
  getScheduleDetailApi,
  getOfflineDetailApi,
  getRealtimeDetailApi,
  getTasklogDetailApi,
  getTaskinstanceDetailApi,
  getTaskHistoryDetailApi,
  getTaskWorkflowDetailApi,
  updateScheduleApi,
  updateOfflineApi,
  updateRealtimeApi,
  delTaskRealtimeApi,
  delTasklogApi,
  delTaskinstanceApi,
  stopWorkflowApi,
  taskDebugApi,
  taskRunApi,
  taskLogApi,
  taskWorkClearApi,
  taskApi,
  addOfflineTwoApi,
  addOfflineThreeApi,
  updateOfflineTwoApi,
  updateOfflineThreeApi,
  taskMonitoringApi,
  taskPodApi,
  taskWorkDebugApi,
  taskWorkRunApi,
  taskWorkLogApi,
};
