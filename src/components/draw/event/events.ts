/*
 * @Author: yinshunyu
 * @Date: 2022-11-24 09:59:04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-13 15:14:11
 * @FilePath: \DataClient\src\components\draw\event\events.ts
 * @Description:
 *
 */
export enum drawEvents {
  // 传递当前操作的类型
  NOW_TYPE = "NOW_TYPE",
  LOADING_SIGN = "LOADING_SIGN",
  // 顶部功能栏
  ADD_NEW_END = "ADD_NEW_END", // 新增结束
  HANDLE_DONE_BTN = "HANDLE_DONE_BTN", // 控制Done按钮
  ADD_NEW_SIGN = "ADD_NEW_SIGN",
  HELP_TYPE = "HELP_TYPE", // 辅助线控制
  ENLAGE_SVG = "ENLAGE_SVG", // 放大
  NARROW_SVG = "NARROW_SVG", // 缩小
  INIT_SIZE_SVG = "INIT_SIZE_SVG", // 一键复位
  CHANGE_IMG_ALL_DATA = "CHANGE_IMG_ALL_DATA", // 初始化所有数据
  HANDLE_FOCUS_MODE = "HANDLE_FOCUS_MODE", // 聚焦模式
  HANDLE_HEAD_LINE = "HANDLE_HEAD_LINE", // 操作车头线--车道线
  HANDKE_HORIZON_LINE = "HANDKE_HORIZON_LINE", // 控制地平线
  // 右边栏
  HANDLE_ATTR_SIGN = "HANDLE_ATTR_SIGN", // 控制属性栏显示or隐藏
  // typeLine
  TYPELINW_CIRCLE_UP = "TYPELINW_CIRCLE_UP", // typeLine的circle鼠标抬起事件--结束移动坐标
  TYPELINE_NOW_CIRCLE_DATA = "TYPELINE_NOW_CIRCLE_DATA", // 当前选择点的数据
  TYPELINE_DELETE_CIRCLE = "TYPELINE_DELETE_CIRCLE", // 删除其中一个点
  TYPELINE_DELETE_CIRCLE_OVER = "TYPELINE_DELETE_CIRCLE_OVER", // 删除其中一个点--完成
  TYPELINE_INSERT_CIRCLE = "TYPELINE_INSERT_CIRCLE", // 插入点
  TYPELINE_CHANGE_CIRCLE_TYPE = "TYPELINE_CHANGE_CIRCLE_TYPE", // 修改点类型--不分状态
  TYPELINE_NO_X = "TYPELINE_NO_X", // 限制X轴方向
  // 车道线curve
  CURVE_CIRCLE_DATA = "CURVE_CIRCLE_DATA", // 当前点的数据
  CURVE_CIRCLE_UP = "CURVE_CIRCLE_UP", // circle抬起事件--更新坐标
  CURVE_INSERT_CIRCLE = "CURVE_INSERT_CIRCLE", // 插入点
  CURVE_EXTEND_CIRCLE = "CURVE_EXTEND_CIRCLE", // 延长线
  CURVE_CHANGE_COLOR = "CURVE_CHANGE_COLOR", // 车道线修改颜色
  CURVE_CHANGE_CIRCLE_DATA = "CURVE_CHANGE_CIRCLE_DATA", // 修改点数据
  CURVE_DEL_CIRCLE = "CURVE_DEL_CIRCLE", // 删除点
  CURVE_HANDLE_ROAD = "CURVE_HANDLE_ROAD", // 控制道路dom
  CURVE_CLEAR_ROAD_DOM = "CURVE_CLEAR_ROAD_DOM", // 手动清除道路dom
  CURVE_OVERLOOK_CANVAS = "CURVE_OVERLOOK_CANVAS", // 更新俯瞰图
  CURVE_OVERLOOK_SVG = "CURVE_OVERLOOK_SVG", // 更新俯瞰图的svg
  CURVE_HANDLE_OVERLOOK = "CURVE_HANDLE_OVERLOOK", // 控制打开俯瞰图

  HANDLE_HOVER_DOM = "HANDLE_HOVER_DOM", // 让图形更行hover

  // Box3d
  POLYGON_3D_CIRCLE_UP = "POLYGON_3D_CIRCLE_UP", // edit状态下的点up事件--更新数据
  POLYGON_3D_CHANGR_DIRECTION = "POLYGON_3D_CHANGR_DIRECTION", // edit更改方向，1 -> 2
  POLYGON_3D_STATUS_ADD = "POLYGON_3D_STATUS_ADD", // 开始创建3D--控制方向选择状态--点击新建按钮后进入新建状态，不允许修改方向
  POLYGON_3D_ALIGNMENT = "POLYGON_3D_ALIGNMENT", // 点击对齐
  // Box2d
  RECT_2D_CIRCLE_UP = "RECT_2D_CIRCLE_UP", // edit状态下的点up事件--更新数据
  // Line
  LINE_CIRCLE_UP = "LINE_CIRCLE_UP", // edit状态下line的点up事件
  // Ray
  RAY_CIRCLE_UP = "RAY_CIRCLE_UP", // edit状态下ray的点up事件
  // Poly4
  POLY4_CIRCLE_UP = "POLY4_CIRCLE_UP",
  // tool2的车位组
  TOOL2_DRAW_POLYGON = "TOOL2_DRAW_POLYGON", // 绘制车位组的框
  TOOL2_CLEAR_PARK_DOM = "TOOL2_CLEAR_PARK_DOM", // 修改车位组的属性--根据属性切换颜色
  TOOL2_CHANGE_INDEX = "TOOL2_CHANGE_INDEX", // 切换tool2状态下选择的组index

  // 快捷键操作
  SHORTCUT_KEYS_HELP = "SHORTCUT_KEYS_HELP", // 选择辅助线
  SHORTCUT_KEYS_DRAW = "SHORTCUT_KEYS_DRAW", // 绘制
  SHORTCUT_KEYS_NEXT_SHAPE = "SHORTCUT_KEYS_NEXT_SHAPE", // 切换下一个图形
  SHORTCUT_KEYS_DOWN_CIRCLE = "SHORTCUT_KEYS_DOWN_CIRCLE", // 选中一个点-ctrl
  SHORTCUT_KEYS_FOCUS_MODE = "SHORTCUT_KEYS_FOCUS_MODE", // 聚焦模式
  SHORTCUT_KEYS_CAR_HEAD = "SHORTCUT_KEYS_CAR_HEAD", // 操作车头线
  SHORTCUT_KEYS_CLEAR = "SHORTCUT_KEYS_CLEAR", // 清除快捷键
  SHORTCUT_KEYS_ESC = "SHORTCUT_KEYS_ESC",
}
export enum dataEvents {
  CHANGE_OBJECT_SETTING_DATA = "CHANGE_OBJECT_SETTING_DATA", // 修改当前对象所对应的配置数据
  GET_NOW_OBJECT_DATA = "GET_NOW_OBJECT_DATA", // 获取当前对象数据
  SEND_NOW_OBJECT_DATA = "SEND_NOW_OBJECT_DATA", // 发送当前对象数据
  GET_NOW_GROUP_DATA = "GET_NOW_GROUP_DATA", // 获取当前组数据
  EDIT_CHANGE_DATA = "EDIT_CHANGE_DATA", // edit:修改对应object数据
  EDIT_DRAW_DATA = "EDIT_DRAW_DATA", // edit：修改draw-object数据
  ADD_NEW_OBJECT = "ADD_NEW_OBJECT", // 新添加一个实例对象
  DELETE_OBJECT_OVER = "DELETE_OBJECT_OVER", // 删除对象--完成
  NO_ROLE_UPDATE = "NO_ROLE_UPDATE", // 无权限查看图片--更新当前图片工作状态--改为已完成
  HANDLE_PAGE_TIP = "HANDLE_PAGE_TIP", // 操作页面提示
}
export enum tagsEvents {
  DEL_TAGS_OVER = "DEL_TAGS_OVER",
}
export default { drawEvents, dataEvents, tagsEvents };
