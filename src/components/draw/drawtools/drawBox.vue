<!--
 * @LastEditTime: 2023-08-01 14:50:37
 * @Description: 标注的绘制组件
-->
<template>
  <div
    class="canvas_dom"
    id="canvasDOM"
    @mousedown="dragFUN"
    @mousewheel="resizeWheel"
    @DOMMouseScroll="resizeWheel"
  >
    <div
      id="SVG_MAIN"
      class="svg_box"
      ref="SVG_MAIN"
      :style="`width: ${props.nowImgData?.info?.img_width * 1.4}px; height: ${
        props.nowImgData?.info?.img_height * 1.4
      }px; transform:scale(0.8); transform-origin: 0px 0;`"
      @mousemove="moveHandle"
      @mouseup="upHandle"
      @mouseleave="leaveHandle"
    >
      <svg
        ref="big_SVG"
        id="big_SVG"
        class="big_SVG_css"
        version="1.1"
        baseProfile="full"
        :style="`width: 100%; height: 100%;`"
        xmlns="http://www.w3.org/2000/svg"
        @mousemove="bigMouseMoveFun"
        @mouseover="bigMouseOverFun"
        @mousedown="bigMouseDownFun"
        @mouseleave="bigMouseLeaveFun"
      ></svg>
      <!-- 辅助功能--不需要随着图片标注数据清除的 -->
      <svg
        ref="assist_SVG"
        id="assist_SVG"
        class="assist_SVG_css"
        version="1.1"
        baseProfile="full"
        :style="`width: ${props.nowImgData?.info?.img_width}px; height: ${props.nowImgData?.info?.img_height}px;left: ${publicData.left}px;top: ${publicData.top}px;`"
        xmlns="http://www.w3.org/2000/svg"
      >
        <BaseSourceImage
          v-if="props.nowImgData?.basic.url"
          class="img"
          id="svg_img"
          :url="props.nowImgData?.basic.url"
          :type="`svg_img`"
        />
        <circle
          v-show="addCircleData.sign"
          r="5"
          :cx="addCircleData.x"
          :cy="addCircleData.y"
          id="yh_add_circle"
          stroke="yellow"
          fill="red"
          fill-opacity="1"
          stroke-width="2"
        ></circle>
        <!-- 十字辅助线 -->
        <g id="yh_help_line" v-show="assistHelp.helpSign == '十'">
          <line
            id="yh_help_line_one"
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke-width="0.7"
            stroke-dasharray="3 2"
            stroke="yellow"
          ></line>
          <line
            id="yh_help_line_two"
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke-width="0.7"
            stroke="yellow"
            stroke-dasharray="3 2"
          ></line>
        </g>
        <!-- 原型辅助线 -->
        <circle
          v-show="assistHelp.helpSign == '圆'"
          r="100"
          cx="0"
          cy="0"
          id="yh_help_circle"
          stroke="yellow"
          fill="yellow"
          fill-opacity="0"
          stroke-width="0.8"
        ></circle>
        <!-- 车头线 -->
        <g
          id="yh_laneline_carhead"
          v-if="lanelineHeadLine.sign && props.nowContentType === 'laneline'"
        >
          <line
            id="yh_head_line"
            x1="0"
            :y1="imgInfo.car_head"
            :x2="imgWH?.w"
            :y2="imgInfo.car_head"
            stroke-width="2.4"
            stroke="#50792E"
          ></line>
          <!-- 车头辅助线 -->
          <line
            id="yh_head_line"
            :x1="imgInfo.car_head_help[0]"
            :y1="imgInfo.car_head + 50"
            :x2="imgInfo.car_head_help[0]"
            :y2="imgInfo.car_head - 50"
            stroke-width="2.4"
            stroke="#000"
          ></line>
          <line
            id="yh_head_line"
            :x1="imgInfo.car_head_help[1]"
            :y1="imgInfo.car_head + 50"
            :x2="imgInfo.car_head_help[1]"
            :y2="imgInfo.car_head - 50"
            stroke-width="2.4"
            stroke="#000"
          ></line>
          <line
            id="yh_head_line"
            :x1="imgWH.w / 2"
            :y1="imgWH.h"
            :x2="imgWH.w / 2"
            :y2="imgWH.h - 100"
            stroke-width="2.4"
            stroke="#000"
          ></line>
        </g>
        <!-- 地平线 -->
        <line
          id="yh_horizon"
          v-if="
            (props.nowContentType === 'tool0' ||
              props.nowContentType === 'tool3') &&
            horizonSign
          "
          x1="-4"
          :y1="horizonNum"
          :x2="imgWH?.w + 4"
          :y2="horizonNum"
          stroke-width="1.4"
          stroke="red"
        ></line>
        <!-- 消失点--车道线 -->
        <circle
          v-show="props.nowContentType === 'laneline'"
          r="5"
          :cx="lanelineOverlookCircle.x"
          :cy="lanelineOverlookCircle.y"
          id="yh_help_circle"
          stroke="green"
          fill="green"
          fill-opacity="0.8"
          stroke-width="0.8"
        ></circle>
      </svg>
      <!-- 绘制图形 -->
      <svg
        ref="YH_SVG"
        id="YH_SVG"
        version="1.1"
        baseProfile="full"
        :style="`width: ${props.nowImgData?.info?.img_width}px; height: ${props.nowImgData?.info?.img_height}px;left: ${publicData.left}px;top: ${publicData.top}px;`"
        xmlns="http://www.w3.org/2000/svg"
        @mousedown="mouseDownFun"
        @mousemove="mouseMoveFun"
        class="YH_SVG_css"
        v-show="props.nowContentType !== 'envLabel'"
      ></svg>
    </div>
    <sizeToolVue :wheelNum="wheelNum" />
  </div>
</template>
<script setup lang="ts">
import BaseSourceImage from "@/views/subview/data/sub/BaseSourceImage.vue";
import {
  ref,
  onMounted,
  defineProps,
  inject,
  watch,
  reactive,
  nextTick,
  defineEmits,
  defineExpose,
} from "vue";
import { SVG } from "@svgdotjs/svg.js";
import public_contorl from "@/components/draw/contorls/public_contorl";
import typeline_contorl from "@/components/draw/contorls/typeline_contorl";
import Box3d_contorl from "@/components/draw/contorls/mark3D_contorl";
import Box2d_contorl from "@/components/draw/contorls/mark2D_contorl";
import curve_contorl from "@/components/draw/contorls/curve_contorl";
import line_contorl from "@/components/draw/contorls/line_contorl";
import ray_contorl from "@/components/draw/contorls/ray_contorl";
import poly4_contorl from "@/components/draw/contorls/poly4_contorl";
import tool2_contorl from "@/components/draw/contorls/tool2_contorl";
import drag_contorl from "@/components/draw/contorls/drag_contorl";
import sizeToolVue from "@/components/draw/drawtools/sizeTool.vue";
import { useStateStore } from "@/stores/state";
import { getTypeIndex } from "@/utils/util";
import setData from "@/components/draw/setting.json";
import { ObserverInstance } from "@/components/draw/event/observer";
import { dataEvents, drawEvents } from "@/components/draw/event/events";
const store = useStateStore();
const emits = defineEmits(["handleLoading", "handleData"]);
const props = defineProps([
  "nowImgData",
  "nowObjectIndex",
  "contentType",
  "nowData",
  "nowContentType",
  "nowInfos",
  "currentStep",
  "overlookSign",
]);

const sendImgData: any = inject("sendImgData");

let observerListenerList = [
    { eventName: dataEvents.EDIT_DRAW_DATA, fn: handleEditData.bind(this) },
    { eventName: drawEvents.HELP_TYPE, fn: getHelpType.bind(this) },
    { eventName: drawEvents.ADD_NEW_SIGN, fn: addChart.bind(this) },
    { eventName: drawEvents.INIT_SIZE_SVG, fn: initSize.bind(this) },
    { eventName: drawEvents.CHANGE_IMG_ALL_DATA, fn: initAll.bind(this) },
    { eventName: drawEvents.HANDLE_HEAD_LINE, fn: handleHeadLine.bind(this) },
    { eventName: drawEvents.HANDKE_HORIZON_LINE, fn: handleHorizon.bind(this) },
  ],
  domWidth: any = ref(null), // svg画布的宽度
  domHeight: any = ref(null),
  imgWH: any = ref({
    w: 0,
    h: 0,
  }),
  drawWH: any = ref({
    w: 0,
    h: 0,
  }),
  Data: any = ref(), // 标注数据
  first = true,
  // 控制类
  Contorls: any = {
    typeLine: null,
    Box2d: null,
    Box3d: null,
    Line: null,
    Curve: null,
    Ray: null,
    Poly4: null,
  },
  tool2Contorl: any,
  publicContorl: any,
  dragContorl: any,
  // 操作过程中的一些公共数据标识
  // 是否正在新建元素ing标识;
  nowObject: any = reactive({
    // sign: false,
    data: {},
    index: -1,
  }),
  imgInfo: { [key: string]: any } = ref({
    car_head: 0,
    car_head_help: [0, 0],
  }),
  svgMoveData: { [key: string]: any } = reactive({
    sign: false, // 是否正在拖动标识
    moveX: 0,
    moveY: 0,
    startX: 0,
    startY: 0,
    scaleNum: 1,
  }),
  assistHelp = ref({
    helpSign: "--",
    circleSign: false,
    lineSign: false,
  }),
  publicData: any = ref({
    svgDom: null, // svg画布中的g标签的dom元素---最终展示出来的画布
    scale: 0, // 画布和图片的缩放比例
    left: 0,
    top: 0,
  }),
  wheelNum = ref(100),
  lanelineHeadLine = ref({
    sign: true,
    y: 0,
    x1: 0,
    x2: 0,
  }),
  lanelineOverlookCircle = ref({
    sign: false, // 用来判断消失点是否已经计算过 false:未计算过，true：计算过
    x: 0,
    y: 0,
  }), // 车道线消失点数据
  assistSvgDom: any = ref(null), // 辅助功能的svg元素dom
  bigSvgDom: any = ref(null),
  YH_SVG: any = ref(null),
  assist_SVG: any = ref(null),
  addCircleData: any = ref({
    sign: false,
    x: 0,
    y: 0,
  }),
  scaleNum = ref(1),
  mainObj: any = {
    // 注册事件
    Box2d: {
      move: {
        add: "add2Ding",
        edit: "mouseMoveFun",
      },
      down: {
        add: "add2D",
      },
    },
    Box3d: {
      move: {
        add: "add3Dmove",
        edit: "moveCircle",
      },
      down: {
        add: "add3D",
      },
    },
    typeLine: {
      move: {
        add: "addMove",
        edit: "editMove",
      },
      down: {
        add: "addTypeline",
        edit: "editDown",
      },
    },
    Curve: {
      down: {
        add: "addCurve",
        edit: "insertDown",
      },
      move: {
        add: "addCurveing",
        edit: "editMove",
      },
    },
    Line: {
      down: {
        add: "addLine",
      },
      move: {
        add: "adding",
        edit: "lineMoveing",
      },
    },
    Ray: {
      down: {
        add: "addRay",
      },
      move: {
        add: "addRaying",
        edit: "rayMoving",
      },
    },
    Poly4: {
      down: {
        add: "addPoly4",
      },
      move: {
        add: "addPoly4ing",
        edit: "poly4Moving",
      },
    },
  },
  overstepSign = ref(false),
  horizonNum = ref(-10),
  horizonSign = ref(true),
  SVG_MAIN: any = ref(null);
defineExpose({
  lanelineHeadLine,
  publicData,
  imgWH,
  imgInfo,
  lanelineOverlookCircle,
});
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_mark");
watch(
  [() => props.nowImgData, () => props.nowData],
  ([nowImgDataVal, nowDataVal]) => {
    publicData.value.left = nowImgDataVal?.info?.img_width * 0.2;
    publicData.value.top = nowImgDataVal?.info?.img_height * 0.2;
    drawWH.value.w = nowImgDataVal?.info?.img_width * 1.4;
    drawWH.value.h = nowImgDataVal?.info?.img_height * 1.4;
    publicData.value.scale = 1;
    imgWH.value.h = nowImgDataVal?.info?.img_height;
    imgWH.value.w = nowImgDataVal?.info?.img_width;
    store.setHorizonNum(horizonNum.value);
    Data.value = nowDataVal;
    if (store.getDrawDomRefresh === 1) {
      removeAllDom()?.then((res) => {
        handleObjects(Data.value, first);
        store.setDrawDomRefresh(0);
        publicContorl.handleFocusMode({
          sign: null,
          index: props.nowObjectIndex,
          a: "getNowType---watch",
        });
        console.log(res, "res");
      });
    }
    if (
      props.nowContentType === "laneline" &&
      !lanelineOverlookCircle.value.sign
    ) {
      // console.log("初次渲染俯瞰图");
      lanelineOverlookCircle.value.sign = true;
      handleOverLook(nowImgDataVal?.info?.img_width / 2, 730);
    }
  },
  { deep: true }
);
watch(
  () => props.nowInfos,
  (val) => {
    handleCurveCarHead(val);
  }
);
watch(
  () => props.nowContentType,
  (oldVal, val) => {
    if (
      !publicContorl.operationShape ||
      publicContorl.operationShape.length <= 0
    )
      return;
    if (oldVal === "typeLine" || oldVal === "laneline") {
      const obj = {
        typeLine: "typeLine",
        laneline: "Curve",
      };
      Contorls[obj[oldVal]]?.initAll();
    }
  }
);
watch(
  () => props.nowObjectIndex,
  (nowObjectIndexVal) => {
    nowObject.index = nowObjectIndexVal;
    nowObject.data = props.nowData[nowObject.index];
  }
);
onMounted(() => {
  let canvasDOM = document.getElementById("canvasDOM") as HTMLElement;
  domWidth.value = canvasDOM.offsetWidth;
  domHeight.value = canvasDOM.offsetHeight;
  assistSvgDom.value = SVG("#assist_SVG");
  publicData.value.svgDom = SVG("#YH_SVG");
  bigSvgDom.value = SVG("#big_SVG");
  dragContorl = new drag_contorl("SVG_MAIN");
  publicContorl = new public_contorl(publicData.value, assistSvgDom.value);
  // 有哪些类型创建哪些类
  props.contentType.forEach((item) => {
    if (item.type === "typeLine") {
      Contorls.typeLine = new typeline_contorl(
        publicData.value,
        publicContorl,
        setData[item.type].objects[0]?.typesList
      );
    }
    if (item.type === "tool0") {
      if (!Contorls.Box2d)
        Contorls.Box2d = new Box2d_contorl(publicData.value, publicContorl);
      Contorls.Box3d = new Box3d_contorl(publicData.value, publicContorl);
    }
    if (item.type === "laneline") {
      Contorls.Curve = new curve_contorl(
        publicData.value,
        publicContorl,
        setData[item.type].objects[0].type
      );
    }
    if (item.type === "tool3") {
      if (!Contorls.Box2d)
        Contorls.Box2d = new Box2d_contorl(publicData.value, publicContorl);
    }
    if (item.type === "tool12") {
      if (!Contorls.Box2d)
        Contorls.Box2d = new Box2d_contorl(publicData.value, publicContorl);
      Contorls.Line = new line_contorl(publicData.value, publicContorl);
      if (!Contorls.Ray)
        Contorls.Ray = new ray_contorl(publicData.value, publicContorl);
    }
    if (item.type === "tool2") {
      if (!Contorls.Ray)
        Contorls.Ray = new ray_contorl(publicData.value, publicContorl);
      Contorls.Poly4 = new poly4_contorl(publicData.value, publicContorl);
      tool2Contorl = new tool2_contorl(publicData.value, publicContorl);
    }
  });
});
// 处理消失点、俯瞰图--初始化
function handleOverLook(x, y) {
  if (!lanelineOverlookCircle.value.sign || props.nowContentType !== "laneline")
    return;
  lanelineOverlookCircle.value.x = x;
  lanelineOverlookCircle.value.y = y;
  ObserverInstance.emit(drawEvents.CURVE_OVERLOOK_CANVAS, {
    x: x,
    y: y,
  });
}
// 根据objects--shapes--type绘制初始数据
function handleObjects(data: any, first: boolean | null) {
  if (!publicData.value.svgDom) return;
  for (let i = 0; i < data.length; i++) {
    if (data[i].shapes) {
      for (let j = 0; j < data[i].shapes.length; j++) {
        if (data[i].shapes[j].type === "Box3d") {
          Contorls.Box3d.draw3D(data[i].shapes[j].points, i, data[i].direction);
        }
        if (data[i].shapes[j].type === "Box2d") {
          Contorls.Box2d.draw2D(data[i].shapes[j].points, i);
        }
        if (data[i].shapes[j].type === "Line") {
          Contorls.Line.drawLine(data[i].shapes[j].points, i);
        }
        if (data[i].shapes[j].type === "Ray") {
          Contorls.Ray.drawRayLine(data[i].shapes[j].points, i);
        }
        if (data[i].shapes[j].type === "Poly4") {
          Contorls.Poly4.drawPoly4(data[i].shapes[j].points, i);
        }
      }
    } else {
      if (data[i].objectType === "typeLine") {
        Contorls.typeLine.handleLines(data[i], i);
      }
      if (data[i].category === "车道线") {
        Contorls.Curve.drawCurve(data[i], i);
      }
    }
  }
  if (nowObject.index >= 0 && first) {
    console.log("-------------handleObjects");

    handleHover(publicContorl.operationShape, Number(nowObject.index));
  }
  emits("handleLoading", false);
}
// 超出的大svg相关鼠标事件
function bigMouseDownFun(e) {
  try {
    if (publicContorl.operationShape.length <= 0 || props.currentStep == 7)
      return;
    if (publicContorl.operationType === "add") {
      let svgRect = document.getElementById("YH_SVG")!.getBoundingClientRect(),
        x = 0,
        y = 0;
      if (
        publicContorl.operationShape === "Box3d" ||
        props.nowContentType === "tool2"
      ) {
        x = e.offsetX - publicData.value.left;
        y = e.offsetY - publicData.value.top;
      } else {
        if (e.x < svgRect.x) {
          x = 0;
        } else if (e.x > svgRect.x + svgRect.width) {
          x = imgWH.value.w;
        } else {
          x = e.offsetX - publicData.value.left;
        }
        if (e.y < svgRect.y) {
          y = 0;
        } else if (e.y > svgRect.y + svgRect.height) {
          y = imgWH.value.h;
        } else {
          y = e.offsetY - publicData.value.top;
        }
      }
      mouseDownFun({
        offsetX: x,
        offsetY: y,
      });
    }
  } catch (err) {
    console.log(err, "err===bigMouseDownFun");
  }
}
function bigMouseMoveFun(e) {
  try {
    let svgRect = document.getElementById("YH_SVG")!.getBoundingClientRect(),
      x = 0,
      y = 0;
    if (
      publicContorl.operationType === "edit" &&
      !publicContorl.circleData.downSign
    )
      return;
    if (
      publicContorl.operationShape === "Box3d" ||
      props.nowContentType === "tool2"
    ) {
      x = e.offsetX - publicData.value.left;
      y = e.offsetY - publicData.value.top;
    } else {
      if (e.x < svgRect.x) {
        x = 0;
      } else if (e.x > svgRect.x + svgRect.width) {
        x = imgWH.value.w;
      } else {
        x = e.offsetX - publicData.value.left;
      }
      if (e.y < svgRect.y) {
        y = 0;
      } else if (e.y > svgRect.y + svgRect.height) {
        y = imgWH.value.h;
      } else {
        y = e.offsetY - publicData.value.top;
      }
    }
    mouseMoveFun({
      offsetX: x,
      offsetY: y,
    });
  } catch (err) {
    console.log(err, "err--bigMouseMoveFun");
  }
}
function bigMouseOverFun(e) {
  try {
    if (overstepSign.value) return;
    overstepSign.value = true;
  } catch (err) {
    console.log(err, "err--bigMouseOverFun");
  }
}
function bigMouseLeaveFun(e) {
  try {
    if (!overstepSign.value) return;
    overstepSign.value = false;
  } catch (err) {
    console.log(err, "err--bigMouseOverFun");
  }
}

// 新建--如果没有当前数据属性，则新添加
function addChart(sign: any, index: number) {
  console.log(publicContorl, "publicContorl=");
  if (publicContorl.operationType === "add" || nowObject.index < 0) return;

  ObserverInstance.emit(dataEvents.HANDLE_PAGE_TIP, {
    sign: true,
    type: "adding",
  });
  if (sign === "Enter") {
    index = props.nowObjectIndex;
  }
  if (
    publicContorl.operationShape === "typeLine" &&
    Data.value[index].points.length > 0
  )
    return;
  if (
    publicContorl.operationShape === "Box2d" ||
    publicContorl.operationShape === "Box3d"
  ) {
    if (
      Data.value[index].shapes[
        getTypeIndex(Data.value[index].shapes, publicContorl.operationShape)
      ].points.length > 0
    )
      return;
  }
  addCircleData.value.sign = true;
  publicContorl.operationType = "add";
  publicContorl.init();

  Contorls[publicContorl.operationShape].addUpdate({
    data: Data.value[index],
    index: nowObject.index,
    shapeType: publicContorl.operationShape,
  });

  if (
    publicContorl.operationShape === "typeLine" ||
    publicContorl.operationShape === "Curve"
  ) {
    ObserverInstance.emit(
      drawEvents.HANDLE_DONE_BTN,
      publicContorl.operationShape
    );
  }
}
function dragFUN(e) {
  if (publicContorl.circleData.downSign) return;
  dragContorl.downFun(e);
}
// svg范围内的鼠标按下事件
function mouseDownFun(e: any) {
  if (publicContorl.circleData.hoverSign || publicContorl.circleData.downSign) {
    return;
  } else {
    svgMoveData.sign = true;
  }
  if (
    !publicContorl.operationShape ||
    publicContorl.operationShape.length <= 0 ||
    props.currentStep == 7
  )
    return;
  let fn =
      mainObj[publicContorl.operationShape].down[publicContorl.operationType],
    contorl = Contorls[publicContorl.operationShape];
  if (!fn) return;
  if (addCircleData.value.sign && publicContorl.operationShape === "Ray")
    addCircleData.value.sign = false;
  contorl[fn](e.offsetX, e.offsetY);
}
// svg上得move事件---对元素位置得处理---要区分“编辑状态”和“新增状态”
function mouseMoveFun(e: any) {
  try {
    if (props.currentStep == 7) return;
    publicContorl.moveHelpLine(e.offsetX, e.offsetY);
    publicContorl.moveHelpCircle(e.offsetX, e.offsetY);
    if (
      ((store.getShortcutKey["Control"] && store.getShortcutKey["x"]) ||
        (store.getShortcutKey["Control"] && store.getShortcutKey["X"])) &&
      lanelineOverlookCircle.value.sign
    ) {
      handleOverLook(e.offsetX, e.offsetY);
    }
    if (
      !publicContorl.operationShape ||
      publicContorl.operationShape.length <= 0
    )
      return;
    let fn =
      mainObj[publicContorl.operationShape].move[publicContorl.operationType];
    if (typeof Contorls[publicContorl.operationShape][fn] === "undefined")
      return;

    let x = e.offsetX,
      y = e.offsetY;
    const res = Contorls[publicContorl.operationShape][fn](x, y);

    if (addCircleData.value.sign && publicContorl.operationShape !== "Box3d") {
      addCircleData.value.x = x;
      addCircleData.value.y = y;
    }
    if (addCircleData.value.sign && publicContorl.operationShape == "Box3d") {
      addCircleData.value.x = res.x;
      addCircleData.value.y = res.y;
    }
  } catch (err) {
    console.log(err, "mouseMoveFun--svg上得move事件");
  }
}
// edit状态下修改坐标数据
function handleEditData(obj: {
  objectIndex: string | number;
  data: { points: number[][] };
}) {
  console.log(obj, "edit++++++nowObject");
  emits("handleData", obj);
  if (publicContorl.operationType === "add")
    publicContorl.operationType = "edit";
  handleHover(publicContorl.operationShape, Number(obj.objectIndex));
  ObserverInstance.emit(dataEvents.HANDLE_PAGE_TIP, {
    sign: false,
  });
}
// 控制svg中的hover元素
function handleHover(sign: string, index: number) {
  // 这里由于结构不深，所以是深拷贝，需要手动修改当前对象数据
  console.log(sign, "sign", index, "index");
  addCircleData.value.sign = false;
  // 更新hover相关元素
  nextTick(() => {
    publicContorl.init();
    if (Contorls.typeLine) Contorls.typeLine.init();
    ObserverInstance.emit(dataEvents.SEND_NOW_OBJECT_DATA, {
      index: index,
      data: Data.value[index],
      shapeType: sign,
    });
    ObserverInstance.emit(
      drawEvents.NOW_TYPE,
      sign,
      index,
      "更新hover相关元素"
    );
  });
  if (index != props.nowObjectIndex) {
    sendImgData.getNowObject({ index: index });
  }
}
function moveHandle(e: any) {
  if (overstepSign.value) return;
  if (props.nowContentType === "tool0" || props.nowContentType === "tool3") {
    if (
      ((store.getShortcutKey["Control"] && store.getShortcutKey["g"]) ||
        (store.getShortcutKey["Control"] && store.getShortcutKey["G"])) &&
      horizonSign.value
    ) {
      horizonNum.value = e.offsetY;
      store.setHorizonNum(horizonNum.value);
    }
  }
  if (props.nowContentType === "laneline" && props.currentStep != 7) {
    if (
      ((store.getShortcutKey["Control"] && store.getShortcutKey["a"]) ||
        (store.getShortcutKey["Control"] && store.getShortcutKey["A"])) &&
      lanelineHeadLine.value.sign
    ) {
      imgInfo.value.car_head = e.offsetY;
    }
  }
}
function upHandle(e) {
  e.stopPropagation();
  console.log("==============================up");

  if (publicContorl.operationType === "edit") {
    publicContorl.upCircle(publicContorl.operationShape);
  }
  svgMoveData.sign = false;
}
function leaveHandle(e) {
  if (!svgMoveData.sign) return;
  svgMoveData.sign = false;
}
// 处理车头线
function handleCurveCarHead(infos) {
  if (props.nowContentType !== "laneline") return;
  if (!infos?.car_head) {
    imgInfo.value.car_head = imgWH.value.h / 2;
    imgInfo.value.car_head_help = [
      imgWH.value.w / 2 - 80,
      imgWH.value.w / 2 + 80,
    ];
  } else {
    imgInfo.value.car_head = infos.car_head;
    imgInfo.value.car_head_help = [...infos.car_head_help];
  }
}
function removeAllDom() {
  publicContorl?.init();
  publicContorl?.clearG();
  if (publicData.value.svgDom) {
    return new Promise((resolve, reject) => {
      publicData.value.svgDom.clear();
      resolve("原始dom元素清除完毕");
    });
  }
}
function resizeWheel(e) {
  dragContorl.resizeWheel(e);
}
function initSize() {
  dragContorl.initSize();
}
function getHelpType(val: string) {
  assistHelp.value.helpSign = val;
}
function handleHeadLine(val) {
  lanelineHeadLine.value.sign = val;
}
function handleHorizon(val) {
  horizonSign.value = val;
}
function initAll() {
  if (Contorls.typeLine) {
    Contorls.typeLine.initAll();
  }
}
</script>

<style lang="scss" scoped>
.canvas_dom {
  width: 1200px;
  height: 100%;
  flex: 1;
  overflow: hidden;
  // position: relative;
  .svg_box {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
    transform: translate3d(0, 0, 0);
    .big_SVG_css {
      position: absolute;
      z-index: 4;
      background: rgba(153, 153, 153, 0.4);
    }
    .assist_SVG_css {
      position: absolute;
      z-index: 6;
      pointer-events: none;
      overflow: inherit;
      .img {
        width: 100%;
        height: 100%;
      }
    }
    .YH_SVG_css {
      position: absolute;
      z-index: 20;
      overflow: inherit;
    }
  }
}
</style>
