import { drawEvents, dataEvents } from "./event/events";

export const shortcutKey = {
  n: {
    name: "新增对象",
    type: "listener",
    down: dataEvents.ADD_NEW_OBJECT,
  },
  N: {
    name: "新增对象",
    type: "listener",
    down: dataEvents.ADD_NEW_OBJECT,
  },
  q: {
    name: "切换下一个图形",
    type: "listener",
    down: drawEvents.SHORTCUT_KEYS_NEXT_SHAPE,
  },
  Q: {
    name: "切换下一个图形",
    type: "listener",
    down: drawEvents.SHORTCUT_KEYS_NEXT_SHAPE,
  },
  Enter: {
    name: "新建",
    type: "listener",
    down: drawEvents.ADD_NEW_SIGN,
  },
  "1": {
    name: "控制十字辅助线",
    type: "listener",
    down: drawEvents.SHORTCUT_KEYS_HELP,
  },
  "4": {
    name: "控制聚焦模式",
    type: "listener",
    down: drawEvents.SHORTCUT_KEYS_FOCUS_MODE,
  },
  Control: {
    name: "选中一个点-移动操作",
    type: "listener",
    down: drawEvents.SHORTCUT_KEYS_DOWN_CIRCLE,
    up: drawEvents.SHORTCUT_KEYS_CLEAR,
  },
  ArrowUp: {
    name: "切换到上一张图片",
    type: "local",
    down: "shortcutChangeImg",
  },
  ArrowDown: {
    name: "切换到下一张图片",
    type: "local",
    down: "shortcutChangeImg",
  },
  Controla: {
    name: "控制车头线",
    type: "listener",
    down: drawEvents.SHORTCUT_KEYS_CAR_HEAD,
    up: drawEvents.SHORTCUT_KEYS_CLEAR,
  },
  Escape: {
    name: "结束",
    type: "listener",
    down: drawEvents.SHORTCUT_KEYS_ESC,
  },
};
export const workToolObj = {
  envLabel: "环境标签",
  tool0: "车辆标记",
  tool1: "物体标记",
  tool12: "物体标记2",
  tool2: "车位标记",
  tool3: "人脸/车牌",
  laneline: "车道线",
  typeLine: "线段分割",
};

export const roadsList = [
  {
    value: "双线",
    key: 0,
  },
  {
    value: "三线",
    key: 1,
  },
  {
    value: "四线",
    key: 2,
  },
  {
    value: "V分叉-正",
    key: 3,
  },
  {
    value: "V分叉-倒",
    key: 4,
  },
  {
    value: "Y分叉-正",
    key: 5,
  },
  {
    value: "Y分叉-倒",
    key: 6,
  },
  {
    value: "分离型分叉",
    key: 7,
  },
  {
    value: "左路沿",
    key: 8,
  },
  {
    value: "右路沿",
    key: 9,
  },
];

export const workRoleList = [
  {
    key: "creator",
    name: "创建人",
    order: -1,
  },
  {
    key: "handler",
    name: "标注操作员",
    order: 2,
  },
  {
    key: "reviewer",
    name: "标注审核员",
    order: 4,
  },
  {
    key: "acceptor",
    name: "标注验收员",
    order: 6,
  },
];
export const workPoints = {
  key: "work_flow_order",
  options: [
    {
      key: "2",
      tip: "提交标注结果",
      name: "标注",
      index: 0,
    },
    {
      key: "4",
      tip: "提交审核结果",
      name: "审核",
      index: 1,
    },
    {
      key: "6",
      tip: "提交验收结果",
      name: "验收",
      index: 2,
    },
    {
      key: "7",
      tip: "验收完成",
      name: "完成",
      index: 3,
    },
  ],
};
