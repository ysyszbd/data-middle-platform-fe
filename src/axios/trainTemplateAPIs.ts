/*
 * @LastEditTime: 2023-08-08 13:55:43
 * @Description: 
 */
import { get, post, put, delBody } from "@/utils/axios";
const cubeConfig = {
  baseURL: "/cube",
  header: {
    "content-type": "application/x-www-form-urlencoded",
  },
};
// 获取任务模板配置
export function getJobTemplateInfos(params) {
  return get(
    "/job_template_fab_modelview/api/_info",
    { id: params },
    cubeConfig
  );
}
// 任务模板--列表
export function getJobTemplateListApi(params) {
  return get("/api/dataprocessing/jobtemplate/list", params);
}
// 任务流--列表
export function getPipelineListApi(params) {
  return get("/api/dataprocessing/argoworkflowtemplate/list", params);
}
// 任务模板--详情
export function getJobTemplateDetailApi(params) {
  return get("/api/dataprocessing/jobtemplate/detail", params);
}
// 任务流--详情
export function getPipelineApi(params) {
  return get("/api/dataprocessing/argoworkflowtemplate/detail", params);
}
// 任务模板--更新
export function updateJobTemplateApi(params) {
  return put("/api/dataprocessing/jobtemplate/update", params);
}
// 任务流--更新
export function updatePipelineApi(params) {
  return put("/api/dataprocessing/argoworkflowtemplate/update", params);
}
// 任务模板--删除
export function delJobTemplateApi(params) {
  return delBody("/api/dataprocessing/jobtemplate/delete", params);
}
// 任务流--删除
export function delPipelineApi(params) {
  return delBody("/api/dataprocessing/argoworkflowtemplate/delete", params);
}
// 任务流实例--删除
export function delArgoworkflowInstanceApi(params) {
  return delBody("/api/dataprocessing/argoworkflowinstance/delete", params);
}
// 任务模板--创建
export function addJobTemplateApi(params) {
  return post("/api/dataprocessing/jobtemplate/create", params);
}
// 任务流--创建
export function addPipelineApi(params) {
  return post("/api/dataprocessing/argoworkflowtemplate/create", params);
}
// 任务流--详情
export function getPipelineDetailApi(params) {
  return get("/api2/dataprocessing/argoworkflowtemplate/detail", params);
}

// 获取任务模板中 扩展-模板分类的下拉选择列表
export function getProjectAllApi(params) {
  return post("/api/sys/project/all", params);
}

export const trainTemplateAPIs = {
  getJobTemplateInfos,
  getJobTemplateListApi,
  getPipelineListApi,
  getJobTemplateDetailApi,
  updateJobTemplateApi,
  updatePipelineApi,
  getPipelineApi,
  delJobTemplateApi,
  delPipelineApi,
  addJobTemplateApi,
  addPipelineApi,
  getPipelineDetailApi,
  getProjectAllApi,
  delArgoworkflowInstanceApi,
};
