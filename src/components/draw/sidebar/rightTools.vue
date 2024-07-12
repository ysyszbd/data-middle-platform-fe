<!--
 * @Author: yinshunyu
 * @Date: 2022-12-08 17:43:17
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-20 14:09:48
 * @FilePath: \DataClient\src\components\draw\right\rightTools.vue
 * @Description: 
 * 
-->
<template>
  <facePlateBox
    :class="['right_tools', store.getTaskMove.right ? 'box_float' : 'box_fix']"
    id="rightTools"
    DOMid="rightTools"
    title="对象列表面板"
    name="对象列表"
    plateSign="right"
    showSign="objectSign"
  >
    <div class="show_box">
      <div class="svg_right_box" v-if="nowContentType !== 'envLabel'">
        <CurveBox
          v-if="nowContentType === 'laneline' && props.currentStep != 7"
          ref="CurveRef"
          :nowObjectIndex="nowObject.index"
          :color="nowObject.data.color ? nowObject.data.color : '--'"
          :curvePointData="curvePointData"
          :nowContentType="nowContentType"
        />
        <circleBox
          v-if="nowContentType === 'typeLine' && props.currentStep != 7"
          :pointData="pointData"
        />
        <div class="objects_list_main">
          <div
            class="objects_list"
            v-if="nowContentType === 'laneline' && Data.length > 0"
          >
            <yhItem
              v-for="(item, index) in Data"
              :key="'laneline' + index"
              :item="item"
              :index="index"
              :nowObjectIndex="nowObject.index"
              :curvePointData="curvePointData"
              :contentType="`laneline`"
              :currentStep="props.currentStep"
              @click="handleCurrentChange(index, item)"
              @handleCurrentChange="handleCurrentChange"
              ref="yhItem_curve"
            />
          </div>
          <div
            class="objects_list"
            v-if="nowContentType === 'tool2' && Data.length > 0"
          >
            <yhItem
              v-for="(item, index) in Data"
              :key="'tool2' + index"
              :item="item"
              :index="index"
              :nowObjectIndex="nowObject.index"
              :curvePointData="curvePointData"
              :contentType="`tool2`"
              :currentStep="props.currentStep"
              @click="handleCurrentChange(index, item)"
              @handleCurrentChange="handleCurrentChange"
              ref="yhItem_tool2"
              :id="`yh_item_tool2_${index}`"
              :class="handleTool2Class(index)"
            />
          </div>
          <div
            class="objects_list"
            v-if="nowContentType === 'typeLine' && Data.length > 0"
          >
            <yhItem
              v-for="(item, index) in Data"
              :key="'typeLine' + index"
              :item="item"
              :index="index"
              :nowObjectIndex="nowObject.index"
              :nowObjectData="nowObject.data"
              :contentType="`typeLine`"
              :currentStep="props.currentStep"
              @click="handleCurrentChange(index, item)"
              @handleCurrentChange="handleCurrentChange"
              :pointIndex="pointData.pointsIndex"
              ref="yhItem_typeLine"
            />
          </div>
          <div
            class="objects_list"
            v-if="nowContentType === 'tool0' && Data.length > 0"
          >
            <yhItem
              v-for="(item, index) in Data"
              :key="'tool0' + index"
              :item="item"
              :index="index"
              :nowObjectIndex="nowObject.index"
              :contentType="`tool0`"
              :currentStep="props.currentStep"
              @click="handleCurrentChange(index, item)"
              @handleCurrentChange="handleCurrentChange"
              ref="tool0"
            />
          </div>
          <div
            class="objects_list"
            v-if="nowContentType === 'tool3' && Data.length > 0"
          >
            <yhItem
              v-for="(item, index) in Data"
              :key="'tool3' + index"
              :item="item"
              :index="index"
              :nowObjectIndex="nowObject.index"
              :contentType="`tool3`"
              :currentStep="props.currentStep"
              @click="handleCurrentChange(index, item)"
              @handleCurrentChange="handleCurrentChange"
              ref="yhItem_tool3"
            />
          </div>
          <div
            class="objects_list"
            v-if="nowContentType === 'tool12' && Data.length > 0"
          >
            <yhItem
              v-for="(item, index) in Data"
              :key="'tool12' + index"
              :item="item"
              :index="index"
              :nowObjectIndex="nowObject.index"
              :contentType="`tool12`"
              :currentStep="props.currentStep"
              @click="handleCurrentChange(index, item)"
              @handleCurrentChange="handleCurrentChange"
              ref="yhItem_tool12"
            />
          </div>
          <emptyBox
            :text="
              Data.length <= 0
                ? `${workToolObj[nowContentType]} 暂无数据`
                : '没有更多了~'
            "
          />
        </div>
        <div class="right_btn_box" v-if="props.currentStep != 7">
          <div type="primary" class="right_btn" @click="addNewObject('push')">
            添加一个新对象
          </div>
          <div
            type="primary"
            class="right_btn"
            v-show="nowContentType === 'laneline'"
            @click="addNewObject('insert')"
          >
            插入对象
          </div>
        </div>
      </div>
      <tagListBox
        v-show="nowContentType === 'envLabel'"
        :nowContentType="nowContentType"
      />
    </div>
    <div class="right_tabs" v-show="contentType.length > 1">
      <div
        :class="[
          'right_tab',
          nowContentType === ele.type ? 'right_tab_active' : '',
        ]"
        v-for="(ele, index) in contentType"
        :key="index"
        @click="selectContent(ele)"
      >
        {{ workToolObj[ele.type] }}
      </div>
    </div>
  </facePlateBox>
</template>

<script lang="ts" setup>
import { defineProps, reactive, ref, defineEmits, inject, watch } from "vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { useStateStore } from "@/stores/state";
import {
  circleBox,
  tagListBox,
  yhItem,
  CurveBox,
  facePlateBox,
  emptyBox,
} from "@/components/draw/drawComponents";
import { workToolObj } from "@/components/draw/drawData";
import { handleShapeTypes } from "@/utils/util";
import setData from "@/components/draw/setting.json";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
const store = useStateStore();

const props = defineProps([
  "nowData",
  "nowObjectIndex",
  "nowContentType",
  "pushSign",
  "currentStep",
]);
const emits = defineEmits(["selectContentType", "refresGroup", "pushFun"]);
const sendImgData: any = inject("sendImgData");
const FACE_PLATE: any = inject("FACE_PLATE");

let Data: any = ref([]), // 标注数据
  observerListenerList = [
    {
      eventName: drawEvents.TYPELINE_NOW_CIRCLE_DATA,
      fn: getTypelineCircle.bind(this),
    },
    {
      eventName: drawEvents.TYPELINE_DELETE_CIRCLE_OVER,
      fn: initTypelinePointData.bind(this),
    },
    { eventName: dataEvents.DELETE_OBJECT_OVER, fn: delObjectOver.bind(this) },
    { eventName: dataEvents.ADD_NEW_OBJECT, fn: addNewObject.bind(this) },
    {
      eventName: dataEvents.GET_NOW_OBJECT_DATA,
      fn: handleCurrentChange.bind(this),
    },
    { eventName: drawEvents.CURVE_CIRCLE_DATA, fn: getCurveCircle.bind(this) },
    {
      eventName: drawEvents.TOOL2_CHANGE_INDEX,
      fn: handleTool2GroupsIndex.bind(this),
    },
  ],
  nowObject: any = reactive({
    index: -1,
    data: {},
    type: "",
  }),
  // 当前选中的circle信息--typeline的点类型数据
  pointData = ref({
    pointsIndex: -1,
    covered: 0,
    type: "",
    coverList: ["否", "是"],
  }),
  curvePointData = ref({
    pointsIndex: -1,
    topSign: 0,
    brushName: "",
  }),
  nowContentType = ref(""),
  contentType = ref(store.getMarkTaskType),
  setObject: any = ref([]), // 当前工具集所包含的实例对象
  nowParkGroup = ref([]), // tool2时当前的组包括的对象数据
  CurveRef: any = ref(null),
  nowShapeTypes = ref();

watch(
  [() => props.nowData, () => props.nowContentType],
  ([nowDataVal, nowContentTypeVal]) => {
    nowContentType.value = nowContentTypeVal;
    Data.value = nowDataVal;
  }
);
watch(
  () => props.nowObjectIndex,
  (nowObjectIndexVal) => {
    nowObject.index = nowObjectIndexVal;
  }
);
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_mark");
// 当前选中的circle信息
function getTypelineCircle(obj: {
  pointsIndex: number;
  sign: string;
  type: string;
  covered: number;
}) {
  pointData.value.pointsIndex = obj.pointsIndex;
  pointData.value.type = obj.type;
  pointData.value.covered = obj.covered;
}
function selectContent(val) {
  if (val.type === props.nowContentType) return;
  emits("selectContentType", val);
  initRightData();
}

// 删除对象完成
function delObjectOver() {
  initTypelinePointData();
}
function handleTool2Class(index) {
  const i = nowParkGroup.value?.findIndex((item) => {
    return item === index;
  });
  if (i >= 0) {
    return `tool2_item_bg${i}`;
  } else {
    return "";
  }
}
// 修改tool2状态下选择的车位组下标--根据当前选择的车位组对实例对象item进行颜色区分渲染
function handleTool2GroupsIndex(parkData) {
  nowParkGroup.value = parkData.objects_id;
}
// 初始化typeline相关得点数据
function initTypelinePointData() {
  pointData.value.pointsIndex = -1;
  pointData.value.covered = -1;
  pointData.value.type = "";
}

// 选择实例对象
async function handleCurrentChange(objectIndex: number, item: any | null) {
  try {
    if (objectIndex === nowObject.index) return;
    nowObject.index = objectIndex;
    if (objectIndex === -1) {
      ObserverInstance.emit(dataEvents.SEND_NOW_OBJECT_DATA, {
        index: -1,
        data: {},
        shapeType: "",
      });
      return;
    }
    item ? (nowObject.data = item) : (nowObject.data = Data.value[objectIndex]);
    if (nowShapeTypes.value === "typeLine") initTypelinePointData();
    if (props.nowContentType === "laneline")
      curvePointData.value.pointsIndex = -1;
    if (!nowObject.data) return;
    setObject.value = handleShapeTypes(
      nowObject.data.category,
      setData[props.nowContentType].objects
    );

    // console.log("-----", FACE_PLATE.facePlate.value);
    // 判断属性面板是否
    if (
      store.getTaskMove.right &&
      props.nowContentType !== "laneline" &&
      props.nowContentType !== "typeLine"
    ) {
      if (store.getTaskMove.left) {
        FACE_PLATE.facePlate.value.attributeSign = true;
      } else {
        const obj = {
          groupSign: "group",
          attributeSign: "left",
          objectSign: "right",
          workSign: "work",
        };
        for (const [key, v] of Object.entries(FACE_PLATE.facePlate.value)) {
          if ("attributeSign" === key) {
            FACE_PLATE.facePlate.value[key] = true;
          } else {
            if (!store.getTaskMove[obj[key]] && v) {
              FACE_PLATE.facePlate.value[key] = false;
            }
          }
        }
      }
    }
    sendImgData.getNowObject({ index: objectIndex });
    ObserverInstance.emit(dataEvents.SEND_NOW_OBJECT_DATA, {
      index: objectIndex,
      data: nowObject.data,
      shapeType: nowShapeTypes.value,
    });
    ObserverInstance.emit(
      dataEvents.CHANGE_OBJECT_SETTING_DATA,
      setObject.value,
      nowObject.data,
      props.nowContentType === "typeLine" || props.nowContentType === "laneline"
        ? false
        : true
    );
  } catch (err) {
    console.log(err, "err-handleCurrentChange");
  }
}

// 新建实例对象---根据工具集选择不同的对象模板
function addNewObject(sign: any = "push") {
  initTypelinePointData();
  let obj: { [key: string]: any } = {},
    drawObj = {};

  setObject.value = setData[props.nowContentType].objects[0];
  if (
    props.nowContentType === "typeLine" ||
    props.nowContentType === "laneline"
  ) {
    const emptyFormwork = {
      typeLine: {
        type: [],
        points: [],
        covered: [],
      },
      laneline: {
        points: [],
        properties: [],
        color:
          props.nowContentType === "laneline" && CurveRef.value.color !== "--"
            ? CurveRef.value.color
            : null,
      },
    };
    if (setObject.value.shape_types.length === 1) {
      obj.objectType = setObject.value.shape_types[0];
    }
    obj = {
      ...obj,
      category: setObject.value.category,
      ...emptyFormwork[props.nowContentType],
    };
  }
  if (
    props.nowContentType === "tool0" ||
    props.nowContentType === "tool3" ||
    props.nowContentType === "tool12" ||
    props.nowContentType === "tool2"
  ) {
    let shapes: any = [],
      attrs: { [key: string]: any } = {};
    setObject.value.shape_types.forEach((item) => {
      shapes.push({
        points: [],
        type: item,
      });
    });
    drawObj = {
      direction: 0,
      shapes: shapes,
    };
    setObject.value.attribute.forEach((item) => {
      attrs[item.key] = item.options[item.options.length - 1];
    });
    obj = {
      category: setObject.value.category,
      tags: [],
      类别: "",
      ...attrs,
      ...drawObj,
    };
    console.log(obj, "objobjobj");
  }
  if (!props.pushSign) emits("pushFun");
  if (nowObject.index < 0 || sign === "push") {
    Data.value.push(obj);
    handleCurrentChange(Data.value.length - 1, null);
    return;
  } else {
    store.setDrawDomRefresh(1);
    Data.value.splice(nowObject.index, 0, obj);
    emits("refresGroup", nowObject.index);
    handleCurrentChange(nowObject.index, null);
  }
}
function getCurveCircle(item) {
  curvePointData.value = { ...curvePointData.value, ...item };
}
function initRightData() {
  nowObject.data = {};
  pointData.value = {
    ...pointData.value,
    pointsIndex: -1,
    covered: 0,
    type: "",
  };
  curvePointData.value = {
    pointsIndex: -1,
    topSign: 0,
    brushName: "",
  };
  nowParkGroup.value = [];
}
</script>
<style lang="scss" scoped>
.tool2_item_bg0 {
  background-color: rgba(255, 0, 0, 0.7);
}
.tool2_item_bg1 {
  background-color: rgba(0, 255, 0, 0.7);
}
.tool2_item_bg2 {
  background-color: rgba(0, 0, 255, 0.7);
}
.tool2_item_bg3 {
  background-color: rgba(0, 255, 255, 0.7);
}
.right_tools {
  width: 400px;
  flex-shrink: 0;
  position: absolute;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  top: 0px;
  left: calc(100vw - 450px);
  z-index: 200;
  transform: translate3d(0, 0, 1px);
  background-color: var(--faceplate-bg);
  .show_box {
    width: 100%;
    height: 100%;
    min-height: 500px;
    position: relative;
    .svg_right_box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .objects_list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .objects_list_main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding-bottom: 88px;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    width: 100%;
    border-radius: 4px;
    background: var(--scroll-thumb-bg);
  }
  ::-webkit-scrollbar-track {
    background: var(--scroll-track-bg);
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
  :deep(.el-form-item__content) {
    justify-content: space-between !important;
  }
}
.dropdown_icon {
  margin-right: 6px;
}
:deep(.el-tag__content) {
  color: #000;
  font-weight: 600;
}
.right_tabs {
  width: 100%;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  box-shadow: 0 0 1em rgba(112, 112, 112, 0.6);
  color: var(--faceplate-tabs);
  font-size: 16px;
  font-weight: 600;
  .right_tab {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
  }
  .right_tab:last-child {
    border-right: none;
  }
}
.right_btn_box {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  // position: absolute;
  // bottom: 0;
  padding: 0 10px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.07);
  .right_btn {
    box-shadow: 0 0 1em rgba(112, 112, 112, 0.6);
    width: 90%;
    margin: 10px 0;
    // flex-shrink: 0;
    background: #409eff;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    line-height: 1;
    height: 32px;
    white-space: nowrap;
    cursor: pointer;
    color: #fff;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    transition: 0.1s;
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 14px;
    margin: 0 5px;
  }
}
.box_float {
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgb(112, 112, 112), -2px -2px 10px rgb(148, 146, 146);
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: #f1f3f4;
  color: #666;
  .show_box {
    height: calc(100vh - 196px);
  }
  .right_tab {
    border-color: lightgray;
    box-shadow: inset 0.2rem 0.2rem 0.4rem #d5e0f3,
      inset -0.3rem -0.3rem 0.4rem #ffffff;
  }
  .right_tab_active {
    border-color: lightgray;
    box-shadow: 0.3rem 0.3rem 0.6rem #c1d9f0, -0.2rem -0.2rem 0.5rem #ffffff;
    box-shadow: inset 2px 2px 8px #d5e0f3, inset -4px -4px -8px #ffffff;
    background: linear-gradient(-25deg, rgb(203, 225, 247) 0%, #409eff 100%);
    color: #fff;
  }
}
.box_fix {
  height: 100%;
  background: rgba(37, 38, 39);
  border-radius: 0 8px 8px 0 !important;
  :deep(.face_plate_title) {
    color: #fff !important;
  }
  :deep(.empty_box) {
    color: rgba(255, 255, 255, 0.8);
  }
  :deep(.el-checkbox__label) {
    color: #fff !important;
  }
  :deep(.point_detail) {
    background: hsla(0, 0%, 100%, 0.2) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.298);
    margin-top: 6px;
    .typeLine_tool_title {
      background: hsla(0, 0%, 100%, 0.2) !important;
    }
    .typeLine_tool_selects {
      border: 2px dashed hsla(0, 0%, 100%, 0.3);
    }
  }
  :deep(.curve_box) {
    background: hsla(0, 0%, 100%, 0.2) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.298);
    margin-top: 6px;
    .curve_tool_title {
      background: hsla(0, 0%, 100%, 0.2) !important;
    }
    .curve_tool_selects {
      border: 2px dashed hsla(0, 0%, 100%, 0.3);
    }
  }
  .objects_list {
    .right_item_box {
      background: hsla(0, 0%, 100%, 0.07);
      color: #fff !important;
    }
  }
  .right_btn_box {
    background: hsla(0, 0%, 100%, 0.5);
  }
  .right_tabs {
    color: rgba(255, 255, 255, 0.7);
    .right_tab:hover {
      background: hsla(0, 0%, 100%, 0.06);
    }
    .right_tab_active {
      position: relative;
      color: rgb(255, 255, 255);
      background: hsla(0, 0%, 100%, 0.1);
    }
    .right_tab_active::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      border-radius: 3px;
      background: #fff;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
