/*
 * @Author: yinshunyu
 * @Date: 2023-01-03 10:19:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-18 11:25:52
 * @FilePath: \DataClient\src\axios\markResultsView.ts
 * @Description:
 *
 */
import { get, post, put, del } from "@/utils/axios";
// 提交标注数据
export function saveResultsData(params) {
  return post("/api/file/annotation/save", JSON.stringify(params));
  // return post("/api/data/annotation/save", JSON.stringify(params));
}
// 获取所有标签
export function getAllTagsApi(params) {
  return get("/api/label/envTag/getAllTag", params);
}
// 更新数据接口
export function updataApi(params) {
  return put("/api/file/file/update", params);
  // return put("/api/data/resource/update", params);
}
// 获取标注数据
export function getSvgDetailApi(params) {
  return get("/api/file/annotation/details", params);
  // return get("/api/data/annotation/details", params);
}
// 删除组数据--已保存过有id的数据
// export function delSvgGroup(params) {
//   return del("/api/data/annotation/group", params);
// }
// 获取任务文件夹图片信息
export function getImgData(params) {
  // return get("/api/file/file/list", params);
  return get("/api/preprocess/task/label_job/resource_list", params);
}
// 提交评论数据
export function saveComment(params) {
  return post(
    "/api/preprocess/task/label_comment/create",
    JSON.stringify(params),
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  );
}
// 更新任务状态--单张图片
export function updataImgApi(params) {
  return put("/api/preprocess/task/label_job/update", params);
}
// 更新任务状态--整个任务
export function updataTaskApi(params) {
  return put("/api/preprocess/task/labeltask/confirm", params);
}
// 获取任务详细信息
export function getTaskDetailApi(params) {
  return get("/api/preprocess/task/labeltask/detail", params);
}
// 获取评论列表
export function getCommentDetailApi(params) {
  return get("/api/preprocess/task/label_comment/detail", params);
}
// 删除评论--批量删除
export function delCommentApi(params) {
  return del("/api/preprocess/task/label_comment/delete", params);
}
