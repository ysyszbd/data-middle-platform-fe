/*
 * @Author: error: git config user.name & please set dead value or install git
 * @Date: 2023-05-29 14:07:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-10-19 17:21:26
 * @FilePath: \data-middle-platform-frontend\src\axios\projectGroupAPIs.ts
 * @Description:
 *
 */
// 项目组：项目分组、模板分类、模型分组
import { get, post, put, del, delBody } from "@/utils/axios";
const cubeConfig = {
  baseURL: "/cube",
  header: {
    "content-type": "application/x-www-form-urlencoded",
  },
};
// 模板分类--配置
export function getJobTemplateGroupInfos(params) {
  return get(
    "/project_modelview/job_template/api/_info",
    { id: params },
    cubeConfig
  );
}
// 项目分组--配置
export function getOrgInfos(params) {
  return get("/project_modelview/org/api/_info", { id: params }, cubeConfig);
}
// 模型分组--配置
export function getModelInfos(params) {
  return get("/project_modelview/model/api/_info", { id: params }, cubeConfig);
}
// 获取列表
export function getListApi(params) {
  return get("/api/dataprocessing/notebook/list", params);
}
// 更新
export function updateDetailApi(params) {
  return put("/api/dataprocessing/notebook/update", params);
}
// 获取详情
export function getDetailApi(params) {
  return get("/api/dataprocessing/notebook/detail", params);
}
// 创建
export function addApi(params) {
  return post("/api/dataprocessing/notebook/create", params);
}
// 删除
export function delApi(params) {
  return delBody("/api/dataprocessing/notebook/delete", params);
}
export function stopApi(params) {
  return post("/api/dataprocessing/notebook/stop", { ids: params });
}
export function resetApi(params) {
  return put(`/api/dataprocessing/notebook/reset/${params}`, null);
}

export const notebookAPI = {
  getJobTemplateGroupInfos,
  getListApi,
  getOrgInfos,
  getModelInfos,
  updateDetailApi,
  getDetailApi,
  addApi,
  delApi,
  stopApi,
  resetApi,
};