import { get, post, put, del, delBody } from "@/utils/axios";
// construct 镜像构建
// images 镜像管理
// repository 镜像仓库

// 获取镜像构建列表
export function getConstructListApi(params) {
  return get("/api/docker/construct/list", params);
}
// 获取镜像仓库列表
export function getRepositoryListApi(params) {
  return get("/api/docker/repository/list", params);
}
// 获取镜像管理列表
export function getImagesListApi(params) {
  return get("/api/docker/images/list", params);
}

// 新增镜像构建
export function addConstructApi(params) {
  return post("/api/docker/construct/create", params);
}
// 新增镜像仓库
export function addRepositoryApi(params) {
  return post("/api/docker/repository/create", params);
}
// 新增镜像管理
export function addImagesApi(params) {
  return post("/api/docker/images/create", params);
}

// 获取 镜像构建 详情
export function getConstructDetailApi(params) {
  return get("/api/docker/construct/detail", params);
}
// 获取 镜像仓库 详情
export function getRepositoryDetailApi(params) {
  return get("/api/docker/repository/detail", params);
}
// 获取 镜像管理 详情
export function getImageDetailApi(params) {
  return get("/api/docker/images/detail", params);
}

// 更新 镜像构建
export function updateConstructApi(params) {
  return put("/api/docker/construct/update", params);
}
// 更新 镜像仓库
export function updateRepositoryApi(params) {
  return put("/api/docker/repository/update", params);
}
// 更新 镜像管理
export function updateImagesApi(params) {
  return put("/api/docker/images/update", params);
}

// 批量删除 镜像构建
export function delConstructApi(params) {
  return delBody("/api/docker/construct/delete", params);
}
// 批量删除 镜像仓库
export function delRepositoryApi(params) {
  return delBody("/api/docker/repository/delete", params);
}
// 批量删除 镜像管理
export function delImagesApi(params) {
  return delBody("/api/docker/images/delete", params);
}
// 镜像构建 -- 调试
export function constructDebugApi(params) {
  return get(
    "/api/docker/construct/debug/" + params,
    {},
    {
      baseURL: "/task-data",
    }
  );
}
// 镜像构建 -- 调试--暂存
export function constructDebugShellApi(params) {
  return get(
    `/api/docker/construct/shell/${params.cluster_name}/${params.namespace}/${params.pod_name}`,
    {},
    {
      baseURL: "/task-data",
    }
  );
}
// 镜像构建 -- 清理
export function constructClearApi(params) {
  return get(
    "/api/docker/construct/clear/" + params,
    {},
    {
      baseURL: "/task-data",
    }
  );
}
// 镜像构建 -- 保存
export function constructSaveApi(params) {
  return get(
    "/api/docker/construct/save/" + params,
    {},
    {
      baseURL: "/task-data",
    }
  );
}
const cubeConfig = {
  baseURL: "/cube",
  header: {
    "content-type": "application/x-www-form-urlencoded",
  },
};
// 获取 镜像仓库 配置
export function getRepositoryInfos(params) {
  return get("/repository_modelview/api/_info", { id: params }, cubeConfig);
}
// 获取 镜像构建 配置
export function getDockerInfos(params) {
  return get("/docker_modelview/api/_info", { id: params }, cubeConfig);
}
// 获取 镜像管理 配置
export function getImagesInfos(params) {
  return get("/images_modelview/api/_info", { id: params }, cubeConfig);
}

export const imageManagementAPIs = {
  getConstructListApi,
  getRepositoryListApi,
  getImagesListApi,
  addConstructApi,
  addRepositoryApi,
  addImagesApi,
  getConstructDetailApi,
  getRepositoryDetailApi,
  getImageDetailApi,
  updateConstructApi,
  updateRepositoryApi,
  updateImagesApi,
  delConstructApi,
  delRepositoryApi,
  delImagesApi,
  constructDebugApi,
  constructDebugShellApi,
  constructClearApi,
  constructSaveApi,
  getRepositoryInfos,
  getDockerInfos,
  getImagesInfos,
};
