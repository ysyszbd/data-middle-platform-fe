<!--
 * @LastEditTime: 2023-08-01 15:31:58
 * @Description: 
-->
<template>
  <div class="overlook_box">
    <div class="origin_css">
      <!-- 背景图片 -->
      <canvas
        id="canvas_img_origin"
        class="item"
        :width="props.nowImgData?.info?.img_width"
        :height="props.nowImgData?.info?.img_height"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="curve_svg"
        class="item"
        :style="`width: ${svgData.img_data?.img_width}px; height: ${svgData.img_data?.img_height}px;`"
      ></svg>
      <!-- svg_canvas -->
      <canvas id="curve_svg_origin" />
    </div>
    <!-- 变形后的输出展示 -->
    <div class="output_box" id="overLookBox">
      <!-- 背景图片 -->
      <canvas id="canvas_output" class="item" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, defineProps, watch, ref, nextTick } from "vue";
import cv from "@techstark/opencv-js";
import { SVG } from "@svgdotjs/svg.js";
import { drawEvents } from "@/components/draw/event/events";
import { ObserverInstance } from "@/components/draw/event/observer";
import { Canvg } from "canvg";
import { getSourceImage } from "@/utils/util";
import overlook_curve_contorl from "@/components/draw/contorls/overlook_curve_contorl";

const props = defineProps([
  "nowImgData",
  "nowContentType",
  "nowData",
  "overlookSign",
]);
// 渲染背景图片
watch(
  [() => props.nowImgData, () => props.overlookSign],
  async ([imgVal, overlookSignVal]) => {
    if (props.nowContentType !== "laneline" || !overlookSignVal || !imgVal)
      return;
    svgData.value.img_data = { ...imgVal?.basic, ...imgVal?.info };
    point.value.x = imgVal?.info?.img_width / 2;
    point.value.y = 730;
    let IMG = new Image();
    URL.revokeObjectURL(imageUrl.value);
    let data = await getSourceImage(imgVal?.basic?.url);
    imageUrl.value = data;
    IMG.src = imageUrl.value;
    IMG.onload = function (e) {
      bg_canvas_dom_cxt.value.drawImage(IMG, 0, 0);
      handleOpencv({
        x: point.value.x,
        y: point.value.y,
      });
    };
    if (overlookSignVal) {
      renderPolyLine(props.nowData, point.value);
    }
  }
);
onMounted(() => {
  initFun();
});
let observerListenerList = [
    {
      eventName: drawEvents.CURVE_OVERLOOK_CANVAS,
      fn: changeAngle.bind(this),
    },
    {
      eventName: drawEvents.CURVE_OVERLOOK_SVG,
      fn: renderPolyLines.bind(this),
    },
  ],
  svgData = ref({
    img_data: {
      img_width: 0,
      img_height: 0,
      url: "",
    },
    objects_data: {},
    id: { $oid: "" },
  }), // 渲染svg需要的数据--图片基础信息+车道线数据
  Contorl: any = ref(null), // 用来渲染俯瞰途中要展示得车道线
  org_svg_dom: any = ref(null), // 车道线svg
  org_svg_canvas_dom: any = ref(null), // 车道线svg渲染出来得canvas
  org_svg_canvas_dom_cxt: any = ref(null),
  outputSvgCanvasDom: any = ref(null),
  bg_canvas_dom: any = ref(null),
  bg_canvas_dom_cxt: any = ref(null),
  mainDom: any = ref(null),
  point = ref({
    x: 0,
    y: 0,
  }),
  drawSign = ref(false),
  timer: any = ref(null),
  imageUrl = ref("");
Contorl.value = new overlook_curve_contorl();
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_laneline");
// 编辑修改车道线后渲染
function renderPolyLines(data: { points: any; x: number; y: number }) {
  renderPolyLine(data.points, { x: data.x, y: data.y });
}
function initFun() {
  org_svg_canvas_dom.value = document.getElementById(
    "curve_svg_origin"
  ) as HTMLCanvasElement;
  org_svg_canvas_dom_cxt.value = org_svg_canvas_dom.value.getContext("2d", {
    willReadFrequently: true,
  });
  org_svg_dom.value = SVG("#curve_svg");
  mainDom.value = document.getElementById("overLookBox") as HTMLElement;
  bg_canvas_dom.value = document.getElementById("canvas_img_origin");
  bg_canvas_dom_cxt.value = bg_canvas_dom.value.getContext("2d", {
    willReadFrequently: true,
  });
  createCanvas();
}
function initCanvas() {
  return new Promise((resolve, reject) => {
    Contorl.value.init(org_svg_dom.value);
    org_svg_canvas_dom_cxt.value.clearRect(0, 0, 0, 0);
    resolve("init俯瞰图完毕");
  });
}
function createCanvas() {
  let dom = document.getElementById("canvas_svg_output");
  if (dom) {
    dom.remove();
    outputSvgCanvasDom.value = null;
  }
  outputSvgCanvasDom.value = document.createElement("canvas");
  outputSvgCanvasDom.value.id = "canvas_svg_output";
  outputSvgCanvasDom.value.style.zIndex = 20;
  outputSvgCanvasDom.value.style.position = "absolute";
  outputSvgCanvasDom.value.style.top = 0;
  outputSvgCanvasDom.value.style.left = 0;
  mainDom.value.appendChild(outputSvgCanvasDom.value);
}
// 将svg转换为canvas
async function handleSvg(points) {
  createCanvas();
  const svg = HTMLDOMtoString(org_svg_dom.value.node);
  let v = await Canvg.from(org_svg_canvas_dom_cxt.value, svg, {});
  await v.start();
  handleCanvasOver(points);
}
// 判断canvas是否渲染完毕--摆脱了定时器需要写死时间的情况
function handleCanvasOver(points) {
  let dom = document.getElementById("curve_svg_origin") as HTMLElement,
    ract = dom.getBoundingClientRect();
  if (ract?.width > 500) {
    handleSvgOpencv({ ...points });
    if (!timer.value) clearTimeout(timer.value);
  } else {
    timer.value = setTimeout(handleCanvasOver, 0, points);
  }
  // console.log("svg渲染--done");
}
function changeAngle(overLookData: { x: number; y: number }) {
  handleOpencv(overLookData);
  handleSvgOpencv(overLookData);
}
// svg的canvas通过opencv进行转换
function handleSvgOpencv(overLookData: { x: number; y: number }) {
  const origin_svg = cv.imread(org_svg_canvas_dom.value);
  let svg = new cv.Mat();
  toGround(origin_svg, svg, point.value.x, overLookData.y, "canvas_svg_output");
  svg.delete();
  origin_svg.delete();
  drawSign.value = false;
}
// 背景图片的canvas通过opencv进行转换
function handleOpencv(overLookData: { x: number; y: number }) {
  const origin_img = cv.imread(bg_canvas_dom.value);
  let img = new cv.Mat();
  toGround(origin_img, img, point.value.x, overLookData.y, "canvas_output");
  img.delete();
  origin_img.delete();
}
// 背景图片转换算法
function toGround(originImg, outImg, x, y, outId) {
  let foe = new cv.Point(x, y),
    d0 = (300 / 1920) * originImg.cols,
    d1 = (500 / 1920) * originImg.cols,
    pts_i: any = [],
    pts_g: any = [];

  const h1 = 30,
    h2 = 70,
    w = 15,
    sz = new cv.Size(640, 840),
    c = new cv.Point(sz.width / 2, sz.height),
    i_0 = new cv.Point(foe.x - d0, foe.y + d0),
    i_1 = new cv.Point(foe.x + d0, foe.y + d0),
    i_2 = new cv.Point(foe.x - d1, foe.y + d1),
    i_3 = new cv.Point(foe.x + d1, foe.y + d1),
    g_0 = new cv.Point(c.x - w, c.y - h2),
    g_1 = new cv.Point(c.x + w, c.y - h2),
    g_2 = new cv.Point(c.x - w, c.y - h1),
    g_3 = new cv.Point(c.x + w, c.y - h1);
  pts_i.push(i_0.x);
  pts_i.push(i_0.y);
  pts_i.push(i_1.x);
  pts_i.push(i_1.y);
  pts_i.push(i_2.x);
  pts_i.push(i_2.y);
  pts_i.push(i_3.x);
  pts_i.push(i_3.y);

  pts_g.push(g_0.x);
  pts_g.push(g_0.y);
  pts_g.push(g_1.x);
  pts_g.push(g_1.y);
  pts_g.push(g_2.x);
  pts_g.push(g_2.y);
  pts_g.push(g_3.x);
  pts_g.push(g_3.y);

  let mat_i = cv.matFromArray(pts_i.length / 2, 2, cv.CV_32F, pts_i);
  let mat_g = cv.matFromArray(pts_g.length / 2, 2, cv.CV_32F, pts_g);
  let M = cv.findHomography(mat_i, mat_g);
  cv.warpPerspective(originImg, outImg, M, sz);
  cv.imshow(outId, outImg);
}
async function renderPolyLine(val, points) {
  await initCanvas().then((res) => {
    for (let i = 0; i < val.length; i++) {
      Contorl.value.drawPolyLine(org_svg_dom.value, val[i].points);
    }
    nextTick(() => {
      handleSvg(points);
    });
  });
}
// 将html标签转换为字符串
function HTMLDOMtoString(DOM) {
  const div = document.createElement("div");
  div.appendChild(DOM.cloneNode(true));
  return div.innerHTML;
}
</script>

<style lang="scss" scoped>
.overlook_box {
  // width: 100%;
  width: 640px;
  height: 100%;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  .origin_css {
    position: absolute;
    z-index: 10000;
    top: -5000px;
    left: -5000px;
    opacity: 0;
  }
  .output_box {
    position: relative;
    .canvas_svg_output_css {
      z-index: 11;
    }
  }
  .item {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
  }
}
</style>
