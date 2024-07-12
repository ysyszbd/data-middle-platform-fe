import { get, post, put, del } from "@/utils/axios";
export function getDataApi(params) {
  return get("/api/question/collection/road_test/detail", params);
}
export function getOptionsApi(params) {
  return get(
    "/api/question/collection/road_test/filter_options",
    JSON.stringify(null)
  );
}
export function getRoleListApi(params) {
  return get("/api/file/source_role/list", params);
}

export function addPowerAPI(params) {
  return post("/api/file/source_role/create", params);
}
export function updateRole(params) {
  return put("/api/file/file_role/update", params);
}
