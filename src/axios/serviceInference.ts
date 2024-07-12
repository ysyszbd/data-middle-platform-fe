import { get, post, put, delBody } from "@/utils/axios";
const cubeConfig = {
  baseURL: "/cube",
  header: {
    "content-type": "application/x-www-form-urlencoded",
  },
};
// 获取模板管理--配置
export function getModelInfos(params) {
  return get("/training_model_modelview/api/_info", { id: params }, cubeConfig);
}
// 模板管理--列表
export function getModelListApi(params) {
  return get("/api/ml/model/list", params);
}
// 模板管理--详情
export function getModelDetailApi(params) {
  return get("/api/ml/model/detail", params);
}
// 模板管理--更新
export function updateModelApi(params) {
  return put("/api/ml/model/update", params);
}
// 模板管理--创建
export function addModelApi(params) {
  return post("/api/ml/model/create", params);
}
// 模板管理--删除
export function delModelApi(params) {
  return delBody("/api/ml/model/deleteBatch", params);
}
export const serviceInferenceAPIs = {
  getModelInfos,
  getModelListApi,
  getModelDetailApi,
  updateModelApi,
  addModelApi,
  delModelApi,
};
