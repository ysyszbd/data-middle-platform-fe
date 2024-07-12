<!--
 * @LastEditTime: 2023-08-01 15:26:12
 * @Description: 标注
-->
<template>
  <div class="my_page">
    <topNav
      :imgListData="imgListData"
      :nowContentType="nowContentType"
      :nowImgData="nowImgData"
      :nowObjectIndex="nowObjectIndex"
      :currentStep="taskDetailData.current_step"
      :overlookSign="overlookSign"
      @changePage="changePage"
      @saveData="saveData"
      @changeImg="changeImg"
    />
    <div class="main_box" id="MAIN">
      <labelList
        :facePlate="facePlate"
        @handleFacePlate="handleFacePlate"
        :nowContentType="nowContentType.type"
      />
      <drawBox
        ref="DRAW"
        :nowData="nowData?.objects"
        :nowImgData="nowImgData"
        :nowInfos="imgInfo"
        :nowObjectIndex="nowObjectIndex"
        :contentType="contentType"
        :nowContentType="nowContentType.type"
        :currentStep="taskDetailData.current_step"
        :overlookSign="overlookSign"
        @handleLoading="handleLoading"
        @handleData="handleData"
      />
      <overlookBox
        v-show="overlookSign && nowContentType.type === 'laneline'"
        :nowImgData="nowImgData"
        :nowContentType="nowContentType.type"
        :nowData="nowData?.objects"
        :overlookSign="overlookSign"
      />
      <objectSelectVue
        ref="objectSelectREF"
        v-show="
          nowContentType.type !== 'typeLine' &&
          nowContentType.type !== 'laneline' &&
          facePlate.attributeSign
        "
        :nowContentType="nowContentType.type"
        :currentStep="taskDetailData.current_step"
        :tagsList="nowImgData?.label?.tags || []"
      />
      <groupsBox
        v-show="settingData?.groups && facePlate?.groupSign"
        :nowContentType="nowContentType.type"
        :nowObjectIndex="nowObjectIndex"
        :nowData="nowData"
        :currentStep="taskDetailData.current_step"
        :groupsSetData="settingData?.groups"
        @handleGroup="handleGroup"
      />
      <rightTools
        v-show="facePlate.objectSign"
        :nowData="nowData?.objects"
        :nowObjectIndex="nowObjectIndex"
        :nowContentType="nowContentType.type"
        :pushSign="pushSign"
        :currentStep="taskDetailData.current_step"
        @pushFun="pushFun"
        @selectContentType="selectContentType"
        @refresGroup="refresGroup"
      />
      <workBox
        ref="WORK_BOX"
        v-show="nowContentType.type !== 'envLabel' && facePlate.workSign"
        :nowContentType="nowContentType"
        :nowObjectIndex="nowObjectIndex"
        :jobId="nowImgData?.job?.id"
        :nowImgIndex="nowImgIndex"
        :nowImgData="nowImgData"
        :nowData="nowData"
        :pushSign="pushSign"
        :imgListData="imgListData"
        :taskDetailData="taskDetailData"
        @changePage="changePage"
        @saveData="saveData"
        @changeImg="changeImg"
      />
    </div>
    <!-- 删除 弹窗 -->
    <el-dialog
      v-model="delData.sign"
      title="删除提示"
      width="25%"
      align-center
      :close-on-click-modal="false"
      class="del_dialog"
      @close="handleDelDialog(false)"
    >
      <h3 class="del_text">你确定要删除该对象吗？</h3>
      <div class="dialog_footer">
        <el-button
          type="danger"
          class="submit_btn"
          @click="submitDel"
          :icon="Delete"
          >确定</el-button
        >
        <el-button @click="handleDelDialog(false)">取消</el-button>
      </div>
    </el-dialog>
    <!-- 重绘 弹窗 -->
    <el-dialog
      v-model="refreshData.sign"
      title="重绘提示"
      width="25%"
      align-center
      :close-on-click-modal="false"
      class="del_dialog"
      @close="handleDelDialog(false)"
    >
      <h3 class="del_text">
        {{ `你确定要重绘 ${refreshData.objectType} 吗？` }}
      </h3>
      <div class="dialog_footer">
        <el-button
          type="warning"
          class="submit_btn"
          @click="submitRefresh"
          :icon="Refresh"
          >确定</el-button
        >
        <el-button @click="closeRefreshDelDialog">取消</el-button>
      </div>
    </el-dialog>
    <!-- 工作流 弹窗 -->
    <el-dialog
      v-model="taskWorkData.sign"
      title="工作流操作提示"
      width="25%"
      align-center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="dialog_box work_dialog"
    >
      <h3 class="text">{{ taskWorkData.text }}</h3>
      <h3 class="tip">请点击“返回”按钮返回列表页</h3>
      <div class="dialog_footer">
        <el-button type="danger" class="submit_btn" @click="router.back"
          >返回</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, onUnmounted, nextTick, watch } from "vue";
import { useStateStore } from "@/stores/state";
import { Delete, Refresh } from "@element-plus/icons-vue";
import {
  topNav,
  drawBox,
  rightTools,
  objectSelectVue,
  groupsBox,
  labelList,
  workBox,
  overlookBox,
} from "@/components/draw/drawComponents";
import setData from "@/components/draw/setting.json";
import { shortcutKey } from "@/components/draw/drawData";
import { useRouter } from "vue-router";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
import {
  getTypeIndex,
  handleId1,
  handleId,
  randomRgb,
  handleShapeTypes,
  getSessionData,
} from "@/utils/util";
import { ElMessage, ElLoading } from "element-plus";
import {
  saveResultsData,
  updataApi,
  getSvgDetailApi,
  getImgData,
  getAllTagsApi,
  getTaskDetailApi,
} from "@/axios/markResultsView";

const store = useStateStore();
const router = useRouter();
let observerListenerList = [
    { eventName: dataEvents.EDIT_CHANGE_DATA, fn: handleData.bind(this) },
    {
      eventName: drawEvents.CURVE_HANDLE_OVERLOOK,
      fn: handleOverLook.bind(this),
    },
  ],
  taskWorkData = ref({
    sign: false,
    text: "",
  }),
  overlookSign = ref(false),
  imgListData = ref({
    list: [],
    total: 1,
    totalPage: 1,
    page: 1,
    pageSize: 10,
    sign: false,
    start: false,
  }), // 图片列表
  nowImgData = ref(), // 当前的图片id相关信息--图片路径
  nowImgIndex = ref(0), // 当前选择的图片数组下标
  nowData: any = ref({
    objects: [],
  }), // 当前选中的图片对应的标注数据
  nowObjectData: any = ref({}), // 当前操作的object数据
  nowObjectIndex = ref(-1), // 当前选中的对象index
  contentType = ref(store.getMarkTaskType), // 当前的工具集类型
  nowContentType = ref({
    id: -1,
    type: "",
  }),
  // 基础配置信息
  settingData: any = ref({
    objects: [], // 选中的工具集下的所有对象属性
  }),
  // 删除对象数据
  delData: any = ref({
    sign: false, // 删除对象的弹窗是否打开
    objectIndex: -1, // 当前操作的object下标
    idArr: [], // 用来存放要删除对象对应dom的id
  }),
  // 重绘对象数据
  refreshData = ref({
    sign: false,
    objectType: "",
    shapesIndex: -1,
  }),
  facePlate = ref({
    // 用来记录控制面板是否展示
    groupSign: false,
    attributeSign: false,
    objectSign: true,
    workSign: false,
  }),
  imgInfo: { [key: string]: any } = ref({
    car_head: 0,
    car_head_help: [0, 0],
  }),
  taskDetailData: any = ref({}),
  DRAW: any = ref(null),
  objectSelectREF: any = ref(null),
  tagsList = ref(), // 所有的环境标签
  selectTags: { [key: string]: any } = ref({}),
  pushSign = ref(false),
  WORK_BOX: any = ref(null),
  loading = ref(),
  transform = {
    right: {
      offsetX: 0,
      offsetY: 0,
    },
    left: {
      offsetX: 0,
      offsetY: 0,
    },
    group: {
      offsetX: 0,
      offsetY: 0,
    },
    work: {
      offsetX: 0,
      offsetY: 0,
    },
  };

ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_mark");

// 抛出去方法和数据
provide("sendImgData", { changePage, changeImg, getNowObject, saveData });
provide("TAGS", { handleTags, nowImgData, tagsList, selectTags });
provide("HANDLE_DIALOG", { openRefreshDialog, handleDelDialog });
provide("WORK", { getTaskDetail, updateTaskEnd });
provide("FACE_PLATE", { handleFacePlate, downFUN, transform, facePlate });
provide("SETTINGS", {
  contentType,
  nowContentType,
  settingData,
});
provide("CURVE", { changeCurveColor });
onUnmounted(() => {
  store.setTaskItemIndex(-1);
  if (store.getNowDrawGroupsIndex >= 0) {
    store.setNowDrawGroupsIndex(-1);
  }
  sessionStorage.removeItem(
    `${store.getDrawTaskData.album_id}_${nowImgData.value.id}`
  );
  // 取消所有的事件监听---暂时如此
  ObserverInstance.removeAll("");
  store.setNowDrawGroupsIndex(-2);
  store.setDrawGroupsLines([]);
  imgListData.value.start = false;
});
initFUN();
// 初始调接口
async function initFUN() {
  handleLoading(true);
  store.setTaskMove("right", true);
  await getAllTags();
  await selectContentType(contentType.value[0]);
  await getTaskDetail();
  await handleSettingObj();
  await addKeyFn();
  await getResourceList();
  handleLoading(false);
}
function updateTaskEnd(data) {
  taskWorkData.value.sign = true;
  if (data.operation === "approve") {
    if (data.order < 7) {
      taskWorkData.value.text = `您已成功将任务(ID：${store.getDrawTaskData.task_id})提交至 ${data.name}！`;
    } else {
      taskWorkData.value.text = `任务(ID：${store.getDrawTaskData.task_id})已完成！`;
    }
  } else {
    taskWorkData.value.text = `您已将任务(ID：${store.getDrawTaskData.task_id}) 打回 ！`;
  }
}
function handleFacePlate(sign, value) {
  if (facePlate.value[sign] === value) return;
  const obj = {
    groupSign: "group",
    attributeSign: "left",
    objectSign: "right",
    workSign: "work",
  };
  if (store.getTaskMove[obj[sign]]) {
    facePlate.value[sign] = value;
  } else {
    facePlate.value[sign] = value;
    for (const [key, v] of Object.entries(facePlate.value)) {
      if (sign === key) {
        facePlate.value[key] = value;
      } else {
        if (!store.getTaskMove[obj[key]] && v) {
          facePlate.value[key] = false;
        }
      }
    }
  }
}

// 更新相关属性数据--实例对象objects
function handleData(obj: { objectIndex: number; data: any }) {
  console.log(obj, "obj---更新数据");
  if (obj.objectIndex == null) obj.objectIndex = nowObjectIndex.value;
  nowData.value.objects[obj.objectIndex] = {
    ...nowData.value.objects[obj.objectIndex],
    ...obj.data,
  };
  if (nowContentType.value.type === "laneline" && overlookSign.value) {
    ObserverInstance.emit(drawEvents.CURVE_OVERLOOK_SVG, {
      x: DRAW.value.lanelineOverlookCircle.x,
      y: DRAW.value.lanelineOverlookCircle.y,
      points: nowData.value.objects,
    });
  }
}
// 更新group数据
function handleGroup(obj) {
  if (obj.sign === "all") {
    nowData.value.groups = obj.groups;
  } else {
    nowData.value.groups[obj.groupIndex] = {
      ...nowData.value.groups[obj.groupIndex],
      ...obj.groupData,
    };
  }
}
// 车道线--修改线颜色
function changeCurveColor(color) {
  if (color === "--") {
    delete nowData.value.objects[nowObjectIndex.value].color;
  } else {
    nowData.value.objects[nowObjectIndex.value].color = color;
  }
}
// 获取当前操作的对象数据信息
function getNowObject(obj) {
  // console.log(obj, "obj--getNowObject--获取当前操作的对象数据信息");
  nowObjectData.value = nowData.value.objects[obj.index];
  nowObjectIndex.value = Number(obj.index);
}
// 键盘监听事件
function addKeyFn() {
  document.addEventListener("keydown", (e) => {
    if (e.key == "G" || e.key == "g") {
      e.preventDefault();
    }
    e.stopPropagation();
    if (
      nowContentType.value.type === "laneline" ||
      nowContentType.value.type === "tool0"
    ) {
      store.setShortcutKey(e.key, "input");
    }
    if (!shortcutKey[e.key]) return;
    if (shortcutKey[e.key].type === "local") {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        shortcutChangeImg(e.key);
      }
    } else {
      ObserverInstance.emit(
        shortcutKey[e.key].down,
        e.key,
        nowContentType.value.type
      );
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key == "G" || e.key == "g") {
      e.preventDefault();
    }
    e.stopPropagation();

    if (
      nowContentType.value.type === "laneline" ||
      nowContentType.value.type === "tool0"
    ) {
      store.setShortcutKey(e.key, "clear");
    }
    if (!shortcutKey[e.key]) return;
    if (e.key === "Control") {
      ObserverInstance.emit(shortcutKey[e.key].down, "");
    }
  });
}
// 快捷键切换图片
async function shortcutChangeImg(key: string) {
  if (taskDetailData.value.current_step != 7) {
    await saveData().catch((err) => {
      throw new Error(err);
    });
  }
  if (key === "ArrowUp") {
    if (nowImgIndex.value === 0) {
      if (imgListData.value.page === 1) {
        return;
      } else {
        imgListData.value.page--;
        nowImgIndex.value = 9;
        getResourceList();
      }
    } else {
      nowImgIndex.value--;
      nowImgData.value = imgListData.value.list[nowImgIndex.value];
      getSvgDetail(nowImgData.value.id);
    }
  }
  if (key === "ArrowDown") {
    if (nowImgIndex.value === 9) {
      if (imgListData.value.page === imgListData.value.totalPage) {
        return;
      } else {
        imgListData.value.page++;
        nowImgIndex.value = 0;
        getResourceList();
      }
    } else {
      nowImgIndex.value++;
      nowImgData.value = imgListData.value.list[nowImgIndex.value];
      getSvgDetail(nowImgData.value.id);
    }
  }
  initTags();
  await filterTags();
}
// 切换当前工具集类型
async function selectContentType(val) {
  store.setTaskItemIndex(-1);
  if (store.getNowDrawGroupsIndex >= 0) {
    store.setNowDrawGroupsIndex(-1);
  }
  if (nowImgData.value?.id && taskDetailData.value.current_step != 7) {
    await saveData();
  }
  if (nowContentType.value.type === val.type) return;
  if (val.type === "envLabel") {
    filterTags();
  }
  nowContentType.value = val;
  store.setSettingObjects(settingData.value);
  store.setNowContentType(val.type);
  settingData.value = setData[val.type];
  if (nowImgData.value?.id) {
    getSvgDetail(nowImgData.value?.id);
  }
  store.setDrawDomRefresh(1);
  getNowObject({ index: -1 });
}
async function getTaskDetail() {
  try {
    const res = (await getTaskDetailApi({
      id: store.getDrawTaskData.work_order_id,
    })) as { code: number; data: any };
    if (res.code === 200) {
      taskDetailData.value = res.data;
    }
  } catch (err) {
    console.log(err, "err--getTaskDetail");
  }
}
// 打开重绘弹窗
function openRefreshDialog(val) {
  refreshData.value.sign = true;
  refreshData.value.objectType = val.type;
}
// 关闭重绘弹窗
function closeRefreshDelDialog() {
  refreshData.value.sign = false;
  refreshData.value.objectType = "";
}
// 重绘--清空当前对象的形状数据--是对图形的操作
function submitRefresh() {
  if (nowData.value.objects[nowObjectIndex.value].shapes) {
    nowData.value.objects[nowObjectIndex.value].shapes[
      getTypeIndex(
        nowData.value.objects[nowObjectIndex.value].shapes,
        refreshData.value.objectType
      )
    ].points = [];
  } else {
    let obj: { [key: string]: any } = { points: [] };
    if (refreshData.value.objectType === "typeLine") {
      obj = {
        ...obj,
        type: [],
        covered: [],
      };
    }
    if (refreshData.value.objectType === "typeLine") {
      obj = {
        ...obj,
        type: [],
        covered: [],
      };
    }
    if (refreshData.value.objectType === "Curve") {
      obj = {
        ...obj,
        properties: [],
      };
    }
    nowData.value.objects[nowObjectIndex.value] = {
      ...nowData.value.objects[nowObjectIndex.value],
      ...obj,
    };
  }
  store.setDrawDomRefresh(1);
  nextTick(() => {
    ObserverInstance.emit(drawEvents.HANDLE_FOCUS_MODE, {
      sign: null,
      index: nowObjectIndex.value,
      a: "submitRefresh",
    });
  });
  closeRefreshDelDialog();
}

// 确认删除--对所有数据的index都有影响
async function submitDel() {
  try {
    if (nowData.value?.groups.length > 0) {
      await delRefreshGroup(delData.value.objectIndex);
    }
    nowData.value.objects.splice(delData.value.objectIndex, 1);
    objectSelectREF.value.init();
    store.setDrawDomRefresh(1);
    handleDelDialog(false);
    ObserverInstance.emit(dataEvents.DELETE_OBJECT_OVER);
    ObserverInstance.emit(dataEvents.GET_NOW_OBJECT_DATA, -1);
    nextTick(() => {
      ObserverInstance.emit(drawEvents.HANDLE_FOCUS_MODE, {
        sign: null,
        index: -1,
        a: "submitDel",
      });
    });
  } catch (err) {
    console.log(err, "err-删除");
  }
}
function delRefreshGroup(objectIndex) {
  return new Promise((resolve, reject) => {
    const data = {
      laneline: "lines",
      tool2: "objects_id",
    };
    if (!data[nowContentType.value.type] || nowData.value?.groups.length === 0)
      return;
    for (let i = 0; i < nowData.value.groups.length; i++) {
      if (nowData.value.groups[i][data[nowContentType.value.type]].length > 0) {
        for (
          let j = 0;
          j < nowData.value.groups[i][data[nowContentType.value.type]].length;
          j++
        ) {
          if (
            nowData.value.groups[i][data[nowContentType.value.type]][j] ===
            objectIndex
          ) {
            nowData.value.groups[i][data[nowContentType.value.type]].splice(
              j,
              1
            );
            break;
          }
        }
      }
    }
    for (let i = 0; i < nowData.value.groups.length; i++) {
      if (nowData.value.groups[i][data[nowContentType.value.type]].length > 0) {
        for (
          let j = 0;
          j < nowData.value.groups[i][data[nowContentType.value.type]].length;
          j++
        ) {
          if (
            nowData.value.groups[i][data[nowContentType.value.type]][j] >
            objectIndex
          ) {
            nowData.value.groups[i][data[nowContentType.value.type]][j] =
              nowData.value.groups[i][data[nowContentType.value.type]][j] - 1;
          }
        }
      }
    }
    resolve("处理完毕");
  });
}
function refresGroup(index: number) {
  if (
    nowContentType.value.type !== "laneline" ||
    nowData.value?.groups.length === 0
  )
    return;
  for (let i = 0; i < nowData.value.groups.length; i++) {
    if (nowData.value.groups[i].lines.length > 0) {
      for (let j = 0; j < nowData.value.groups[i].lines.length; j++) {
        if (nowData.value.groups[i].lines[j] >= index) {
          nowData.value.groups[i].lines[j] =
            nowData.value.groups[i].lines[j] + 1;
        }
      }
    }
  }
}

// 跳转到指定页数
function changePage(page: number) {
  // console.log(page, "跳转到指定页数");
  if (!imgListData.value.sign) return;
  imgListData.value.page = page;
  getResourceList();
}
async function getResourceList() {
  const res: any = await getImgData({
    page_size: imgListData.value.pageSize,
    page: imgListData.value.page,
    task_id: store.getDrawTaskData.task_id,
    album_id: store.getDrawTaskData.album_id,
  });
  if (res.code === 200) {
    imgListData.value.list = res.list;
    imgListData.value.total = res.total_count;
    nowImgData.value = imgListData.value.list[nowImgIndex.value];
    imgListData.value.totalPage = Math.ceil(
      res.total_count / imgListData.value.pageSize
    );
    getSvgDetail(nowImgData.value.id);
    if (nowContentType.value.type === "envLabel") {
      await filterTags();
    }
  }
}
// 获取标注数据
async function getSvgDetail(imgId: string) {
  if (nowContentType.value.type === "envLabel") return;
  handleLoading(true);
  objectSelectREF.value.init();
  let sessionObj: any = getSessionData(
      `${store.getDrawTaskData.album_id}_${imgId}`
    ),
    res: any = null;
  if (
    sessionObj[nowContentType.value.type] &&
    sessionObj[nowContentType.value.type].objects.length > 0
  ) {
    res = sessionObj[nowContentType.value.type];
  } else {
    const { data } = (await getSvgDetailApi({
      resource_id: imgId,
      task_object_id: nowContentType.value.id,
    })) as any;
    res = data;

    let obj: { [key: string]: any } = {};
    obj[nowContentType.value.type] = data;

    sessionObj = { ...sessionObj, ...obj };
    sessionStorage.setItem(
      `${store.getDrawTaskData.album_id}_${imgId}`,
      JSON.stringify(sessionObj)
    );
  }
  store.setDrawDomRefresh(1);
  imgInfo.value = res?.infos || nowImgData.value?.basic;
  // console.log(res, "res-------getSvgDetail");

  nowData.value = res || {
    objects: [],
    groups: [],
  };
  let obj = {};
  if (res.objects.length > 0) {
    obj = handleShapeTypes(res.objects[0].category, settingData.value.objects)
      .shape_types[0];
  } else {
    obj = (settingData.value.objects[0] as any).shape_types[0];
  }
  ObserverInstance.emit(drawEvents.NOW_TYPE, obj, -1, "getSvgDetail222");

  nowObjectData.value = {};
  nowObjectIndex.value = -1;
  imgListData.value.sign = true;
  // 根据配置数据给原始数据添加新属性
  for (let i = 0; i < nowData.value?.objects.length; i++) {
    // 给数据添加属性
    const attr: any = settingData.value?.objects.find((e: any) => {
      return e.category === nowData.value.objects[i].category;
    });
    if (attr) {
      attr?.attribute?.forEach((ele) => {
        if (!nowData.value.objects[i][ele.key]) {
          nowData.value.objects[i][ele.key] =
            ele.operation_type === "input" ? "" : "Ignored";
        }
      });
    }
  }
}
// 切换图片
async function changeImg(index: number) {
  try {
    if (store.getNowDrawGroupsIndex >= 0) {
      store.setNowDrawGroupsIndex(-1);
    }
    if (taskDetailData.value.current_step != 7) {
      await saveData().catch((err) => {
        throw new Error(err);
      });
    }
    ObserverInstance.emit(drawEvents.CHANGE_IMG_ALL_DATA);
    nowImgIndex.value = index;
    nowImgData.value = imgListData.value.list[index];
    if (nowContentType.value.type === "envLabel") {
      filterTags();
      initTags();
    }
    getSvgDetail(nowImgData.value.id);
  } catch (err) {
    console.log(err, "err--切换图片失败");
  }
}

// 保存图片的tag标签
async function saveTags() {
  const res: any = await updataApi(nowImgData.value);
  console.log(res, "res");
  if (res.code == 200) {
    ElMessage({
      message: res.message,
      type: "success",
    });
  }
}
// 最终保存数据--提交接口
async function saveData(sign = "noReviewer") {
  try {
    if (nowContentType.value.type === "envLabel") {
      saveTags();
      return;
    }
    let infoObj: { [key: string]: any } = {};
    // 对结果进行检查
    nowData.value.objects.forEach((item, index) => {
      item.index = index;
      if (item.shapes) {
        let len = -1;
        for (let i = 0; i < item.shapes.length; i++) {
          if (item.shapes[i].points.length === 0) {
            len++;
          }
        }
        if (len >= 0 && len < item.shapes.length - 1) {
          ElMessage({
            message: "有未编辑完成的对象!",
            type: "error",
          });
          throw new Error("有未编辑的对象");
        } else if (len === item.shapes.length - 1) {
          nowData.value.objects.splice(index, 1);
        }
      } else if (nowContentType.value.type === "typeLine") {
        if (
          item.points.length === 0 &&
          item.covered.length === 0 &&
          item.type.length === 0
        ) {
          nowData.value.objects.splice(index, 1);
        }
      } else if (nowContentType.value.type === "laneline") {
        if (item.points.length === 0 && item.properties.length === 0) {
          nowData.value.objects.splice(index, 1);
        }
      }
    });
    nowData.value.groups.forEach((item, index) => {
      item.index = index;
      item.tool = nowContentType.value;
    });
    if (nowContentType.value.type === "laneline") {
      infoObj.car_head =
        DRAW.value.imgInfo.car_head * DRAW.value.publicData.scale;
      infoObj.car_head_help = [
        DRAW.value.imgInfo.car_head_help[0] * DRAW.value.publicData.scale,
        DRAW.value.imgInfo.car_head_help[1] * DRAW.value.publicData.scale,
      ];
    }
    let obj = {
      infos: nowContentType.value.type === "laneline" ? infoObj : {},
      resource_id: nowImgData.value.id,
      album_id: store.getDrawTaskData.album_id,
      task_object_id: nowContentType.value.id,
      objects: nowData.value.objects,
      groups: nowData.value.groups,
    };
    let res = (await saveResultsData(obj)) as {
      code: number;
      data: any;
      message: string;
    };
    if (res.code == 200) {
      ElMessage({
        message: res.message,
        type: "success",
      });
      nowData.value = res.data;
      nowObjectData.value = res.data.objects[nowObjectIndex.value];
      obj.groups = res.data.groups;
      obj.objects = res.data.objects;

      if (sign === "reviewer") {
        WORK_BOX.value.saveCommentFun(
          WORK_BOX.value.typeValue === "对象"
            ? nowObjectData.value?.id
            : nowData.value.groups[store.getNowDrawGroupsIndex]?.id?.$oid
        );
      }

      let sessionObj: any = getSessionData(
        `${store.getDrawTaskData.album_id}_${nowImgData.value.id}`
      );
      sessionObj[nowContentType.value.type] = obj;
      sessionStorage.setItem(
        `${store.getDrawTaskData.album_id}_${nowImgData.value.id}`,
        JSON.stringify(sessionObj)
      );
    }
  } catch (err) {
    return new Promise((res, reject) => {
      console.log(err, "err");
      reject(err);
    });
  }
}
// 当前工具集数据存放store中
function handleSettingObj() {
  if (!setData[nowContentType.value.type]) return;
  store.setSettingObjects(setData[nowContentType.value.type].objects);
}
// 控制loading
function handleLoading(val: boolean) {
  if (val) {
    loading.value = ElLoading.service({
      lock: true,
      text: "数据加载中",
      background: "rgba(0, 0, 0, 0.7)",
    });
  } else {
    loading.value?.close();
  }
}
// 处理标签--add/del
function handleTags(tagObj, sign) {
  // console.log(tagObj, sign, "------");

  if (sign === "add") {
    if (!nowImgData.value?.label?.tags) {
      nowImgData.value.label = {
        tags: [],
      };
    }
    let index = nowImgData.value?.label?.tags.findIndex((item: any) => {
      return item.type === tagObj.type;
    });
    if (index >= 0) {
      if (tagObj.tags[0].group) {
        nowImgData.value.label.tags[index].tags[0] = tagObj.tags[0];
      } else {
        nowImgData.value.label.tags[index].tags.push(tagObj.tags[0]);
      }
    } else {
      nowImgData.value.label.tags.push(tagObj);
    }
  } else {
    let index = nowImgData.value?.label?.tags.findIndex((item: any) => {
      return item.type === tagObj.type;
    });
    if (nowImgData.value.label.tags[index].tags.length <= 1) {
      nowImgData.value.label.tags.splice(index, 1);
    } else {
      nowImgData.value.label.tags[index].tags.splice(tagObj.delIndex, 1);
    }
  }
}
// 获取tag所有数据
async function getAllTags() {
  const res: any = await getAllTagsApi({ id: 0 });
  let data = res.data.data;
  data.forEach((item) => {
    item.tags.sort(handleId1);
  });
  data.sort(handleId);
  tagsList.value = data;
  tagsList.value.forEach((item, index) => {
    selectTags.value[item.type] = new Array(item.tags.length).fill({});
    item.tags.forEach((ele: any, i) => {
      selectTags.value[item.type][i] = {
        sign: false,
        id: ele.id,
        color: randomRgb(index),
      };
    });
  });
}
// 过滤标签
async function filterTags() {
  if (!nowImgData.value?.label?.tags) nowImgData.value.label.tags = [];
  nowImgData.value?.label?.tags.forEach((item) => {
    item.tags.forEach((ele) => {
      selectTags.value[item.type].find((e) => {
        if (e.id === ele.id) {
          e.sign = true;
        }
      });
    });
  });
}
// 初始化tag
function initTags() {
  for (let [k, v] of Object.entries(selectTags.value)) {
    (v as any).forEach((item) => {
      item.sign = false;
    });
  }
}
function pushFun() {
  pushSign.value = true;
}
// 控制删除确认弹窗的打开和关闭
function handleDelDialog(sign, val = { objectIndex: -1 }) {
  delData.value.sign = sign;
  delData.value.objectIndex = sign ? val.objectIndex : -1;
}
function handleOverLook(val) {
  overlookSign.value = val;
  console.log(overlookSign.value, "overlookSign");
}
// 移动控制面板事件
function downFUN(e, id, sign) {
  try {
    console.log(transform[sign], "sign=====", sign);

    const downX = e.clientX,
      downY = e.clientY,
      { offsetX, offsetY } = transform[sign];
    const dragEl = document.getElementById(id);
    const targetRect = dragEl!.getBoundingClientRect();
    const targetLeft = targetRect.left;
    const targetTop = targetRect.top;
    const targetwidth = targetRect.width;
    const targetHeight = targetRect.height;
    const clientwidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const minLeft = -targetLeft + offsetX;
    const minTop = -targetTop + offsetY;
    const maxLeft = clientwidth - targetLeft - targetwidth + offsetX;
    const maxTop = clientHeight - targetTop - targetHeight + offsetY;
    const onMousemove = (e: MouseEvent) => {
      const moveX = Math.min(
        Math.max(offsetX + e.clientX - downX, minLeft),
        maxLeft
      );
      const moveY = Math.min(
        Math.max(offsetY + e.clientY - downY, minTop),
        maxTop
      );
      transform[sign] = {
        offsetX: moveX,
        offsetY: moveY,
      };
      if ((moveX !== 0 || moveY !== 0) && !store.getTaskMove[sign]) {
        store.setTaskMove(sign, true);
      }
      document.getElementById(
        id
      )!.style.transform = `translate3d(${moveX}px, ${moveY}px, 1px)`;
    };
    const onMouseup = () => {
      document.removeEventListener("mousemove", onMousemove);
      document.removeEventListener("mouseup", onMouseup);
    };
    document.addEventListener("mousemove", onMousemove);
    document.addEventListener("mouseup", onMouseup);
  } catch (err) {
    console.log(err, "err===");
  }
}
</script>

<style scoped src="@/assets/css/base.css"></style>
<style>
@import url("@/assets/css/drawVar.scss");
</style>
<style lang="scss" scoped>
:deep(.el-main) {
  padding: 0 !important;
}
.my_page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 1400px;
  min-height: calc(100vh - 400px);
  overflow-y: auto;
  user-select: none;
  .main_box {
    width: 100%;
    overflow: hidden;
    // overflow-y: auto;
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    position: relative;
  }
  :deep(.el-dialog) {
    min-width: 400px;
  }
  .dialog_form {
    .dialog_form_item {
      .tags_item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
      }
      .types_list_tag {
        margin: 0 10px 10px 0;
        cursor: pointer;
        :deep(.el-tag__content) {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .types_list_tag_disabled {
        opacity: 0.4;
        pointer-events: none;
      }
    }
    .types_list_icon {
      width: 15px;
      margin-left: 3px;
    }
  }
  .del_dialog,
  .dialog_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .del_text {
      width: 100%;
      margin-bottom: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .dialog_footer {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    .submit_btn {
      width: 100px;
      margin-left: 10px;
    }
  }
  .work_dialog {
    .text,
    .tip {
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
