/* eslint-disable prettier/prettier */
export const resource_list = "/api/data/resource/list";
export const resource_update = "/api/data/resource/update";
export const resource_delete = "/api/data/resource/delete";
export const resource_filter = "/api/data/resource/filter";
export const resource_export = "/api/data/resource/export";

export const source_dir = "/api/data/cmd/ls";
export const files_scp = "/api/data/cmd/scp";

export const video_delete = "/api/data/video/delete";
export const video_deleteBatch = "/api/data/video/deleteBatch";
export const video_list = "/api/data/video/list";
export const video_findBatch = "/api/data/video/findBatch";

export const image_delete = "/api/data/image/delete";
export const image_deleteBatch = "/api/data/image/deleteBatch";
export const image_list = "/api/data/image/list";
export const image_findBatch = "/api/data/image/findBatch";
export const image_filiter = "/api/data/image/filiter";

export const album_create = "/api/data/album/create";
export const album_findBatch = "/api/data/album/findBatch";
export const album_findChild = "/api/file/file/list";
// export const album_findChild = "/api/data/album/findChild";

export const set_album_videos = "/api/data/albumVideos/setAlbumVideos";
export const get_album_videos = "/api/data/albumVideos/getAlbumsVideos";

export const set_album_images = "/api/data/albumImages/setAlbumImages";
export const get_album_images = "/api/data/albumImages/getAlbumsImages";

export const user_create = "/api/sys/user/create";
export const user_delete = "/api/sys/user/delete";
export const user_update = "/api/sys/user/update";
export const user_list = "/api/sys/user/list";
export const user_detail = "/api/sys/user/detail";

export const loginlog_delete = "/api/sys/loginLog/delete";
export const loginlog_list = "/api/sys/loginLog/list";

export const syslog_delete = "/api/sys/sysLog/delete";
export const syslog_list = "/api/sys/sysLog/list";

export const api_create = "/api/sys/api/create";
export const api_delete = "/api/sys/api/delete";
export const api_deleteBatch = "/api/sys/api/deleteBatch";
export const api_update = "/api/sys/api/update";
export const api_list = "/api/sys/api/list";

export const dict_create = "/api/sys/dict/create";
export const dict_delete = "/api/sys/dict/delete";
export const dict_deleteBatch = "/api/sys/dict/deleteBatch";
export const dict_update = "/api/sys/dict/update";
export const dict_list = "/api/sys/dict/list";

export const role_create = "/api/sys/role/create";
export const role_delete = "/api/sys/role/delete";
export const role_delteBatch = "/api/sys/role/deleteBatch";
export const role_update = "/api/sys/role/update";
export const role_list = "/api/sys/role/list";

export const config_create = "/api/sys/config/create";
export const config_delete = "/api/sys/config/delete";
export const config_deleteBatch = "/api/sys/config/deleteBatch";
export const config_update = "/api/sys/config/update";
export const config_list = "/api/sys/config/list";

export const dept_create = "/api/sys/dept/create";
export const dept_delete = "/api/sys/dept/delete";
export const dept_deleteBatch = "/api/sys/dept/deleteBatch";
export const dept_update = "/api/sys/dept/update";
export const dept_findChild = "/api/sys/dept/findChild";

export const menu_create = "/api/sys/menu/create";
export const menu_delete = "/api/sys/menu/delete";
export const menu_deleteBatch = "/api/sys/menu/deleteBatch";
export const menu_update = "/api/sys/menu/update";
export const menu_findChild = "/api/sys/menu/findChild";

export const file_role_create = "/api/sys/fileRole/create";
export const file_role_delete = "/api/sys/fileRole/delete";
export const file_role_deleteBatch = "/api/sys/fileRole/deleteBatch";
export const file_role_update = "/api/sys/fileRole/update";
export const file_role_findChild = "/api/sys/fileRole/findChild";

export const set_user_roles = "/api/sys/userRoles/setUserRoles";
export const get_user_roles = "/api/sys/userRoles/getUserRoles";

export const set_dept_roles = "/api/sys/deptRoles/setDeptRoles";
export const get_dept_roles = "/api/sys/deptRoles/getDeptRoles";

export const set_role_menus = "/api/sys/roleMenus/setRoleMenus";
export const get_role_menus = "/api/sys/roleMenus/getRoleMenus";

export const set_role_apis = "/api/sys/roleApis/setRoleApis";
export const get_role_apis = "/api/sys/roleApis/getRoleApis";

export const timelinetag_create = "/api/label/timelinetag/create";
export const timelinetag_delete = "/api/label/timelinetag/delete";
export const timelinetag_update = "/api/label/timelinetag/update";
export const get_albums_timeLineTag =
  "/api/label/timelinetag/getAlbumsTimeLineTag";

export const envtag_create = "/api/label/envTag/create";
export const envtag_update = "/api/label/envTag/update";
export const envtag_getalltag = "/api/label/envTag/getAllTag";

export const exacttag_filiter = "/api/label/exactTag/filiter";

export const imagetag_create = "/api/label/imagetag/create";
export const imagetag_delete = "/api/label/imagetag/delete";
export const imagetag_gettags = "/api/label/imagetag/getTags";

export const query_export = "/api/label/query/export";
export const annotation_download = "/api/data/annotation/download";

export const sensor_create = "/api/collection/sensor/create";
export const sensor_delete = "/api/collection/sensor/delete";
export const sensor_deleteBatch = "/api/collection/sensor/deleteBatch";
export const sensor_update = "/api/collection/sensor/update";
export const sensor_list = "/api/collection/sensor/list";

export const car_create = "/api/collection/car/create";
export const car_delete = "/api/collection/car/delete";
export const car_deleteBatch = "/api/collection/car/deleteBatch";
export const car_update = "/api/collection/car/update";
export const car_list = "/api/collection/car/list";

export const collectiontask_create = "/api/collection/task/create";
export const collectiontask_delete = "/api/collection/task/delete";
export const collectiontask_deleteBatch = "/api/collection/task/deleteBatch";
export const collectiontask_list = "/api/collection/task/list";

export const labeltask_create = "/api/preprocess/task/labeltask/create";
export const labeltask_delete = "/api/preprocess/task/labeltask/delete";
export const labeltask_deleteBatch =
  "/api/preprocess/task/labeltask/deleteBatch";
export const labeltask_update = "/api/preprocess/task/labeltask/update";
export const labeltask_list = "/api/preprocess/task/labeltask/list";

export const pickimage_create = "/api/preprocess/task/pickimage/create";
export const pickimage_delete = "/api/preprocess/task/pickimage/delete";
export const pickimage_update = "/api/preprocess/task/pickimage/update";
export const pickimage_list = "/api/preprocess/task/pickimage/list";

export const task_tools = "/api/preprocess/task/labeltask/task_tools";

export const source_create = "/api/file/source/create";
export const source_all = "/api/file/source/all";
export const source_mount = "/api/file/source/mount";
export const source_umount = "/api/file/source/umount";
export const source_delete = "/api/file/source/delete";

export const workorder_apply = "/api/workorder/apply";
export const workorder_list = "/api/workorder/list";
export const workorder_detail = "/api/workorder/detail";
export const workorder_confirm = "/api/workorder/confirm";

export const file_list = "/api/file/file/list";
export const file_update = "/api/file/file/update";
export const file_ls = "/api/file/file/ls";
export const file_create_album = "/api/file/file/create_album";
export const file_link_album = "/api/file/file/link_album";
export const file_load_album = "/api/file/file/load_album";
export const file_remove_album = "/api/file/file/remove_album";
export const file_recursion_add_role = "/api/file/file/recursion_add_role";
export const file_recursion_del_role = "/api/file/file/recursion_del_role";
export const file_file_export = "/api/file/file/export";

export const file_action_tree = "/api/sys/fileAction/fileActionTree";
export const get_file_role_actions =
  "/api/sys/fileRoleFileActions/getFileRoleActions";
export const set_file_role_actions =
  "/api/sys/fileRoleFileActions/setFileRoleActions";
export const file_role_findByUser = "/api/sys/fileRole/findByUser";

export const get_user_file_roles = "/api/sys/userFileRoles/getUserFileRoles";
export const set_user_file_roles = "/api/sys/userFileRoles/setUserFileRoles";
