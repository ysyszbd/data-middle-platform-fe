import { ObserverInstance } from "@/components/draw/event/observer";
import { dataEvents, drawEvents } from "@/components/draw/event/events";
import { deepClone, getDom } from "@/utils/util";

class rayContorl {
  public publicData: { svgDom: any; scale: number } = {
    svgDom: null,
    scale: 1,
  };
  commonContorl: any = null;
  observerListenerList = [
    {
      eventName: dataEvents.SEND_NOW_OBJECT_DATA,
      fn: this.nowObject.bind(this),
    },
    { eventName: drawEvents.RAY_CIRCLE_UP, fn: this.endFun.bind(this) },
  ];
  addData: any = {
    sign: false,
    start: false,
    drawPoints: [],
    lineDom: null,
    rayDom: null,
    gDom: null,
  };
  editData: any = {
    drawPoints: [],
    lineDom: null,
    gDom: null,
    circleDom: null,
  };
  nowObjectData: any = {};
  TAG = "Ray";
  lineColor = "#fff";

  constructor(publicData: { svgDom: any; scale: number }, commonContorl: any) {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_typeLine"
    );
    this.publicData = publicData;
    this.commonContorl = commonContorl;
  }
  addUpdate(data: { data: any; index: number }) {
    if (this.addData.sign) return;
    this.addData.sign = true;
    this.nowObject(data, "add");
  }
  addRay(x: number, y: number) {
    if (!this.addData.sign) return;
    this.addData.drawPoints.push([x, y]);
    this.nowObjectData.data.shapes[0].points.push([
      x * this.publicData.scale,
      y * this.publicData.scale,
    ]);
    if (!this.addData.start) {
      this.addData.start = true;
      this.addData.gDom = this.commonContorl.drawG(
        `yh_${this.TAG}_g_${this.nowObjectData.index}`,
        {
          objectsIndex: this.nowObjectData.index,
          type: "Ray",
        }
      );
      this.addData.lineDom = this.drawLineDom(
        this.addData.gDom,
        [...this.addData.drawPoints, ...this.addData.drawPoints],
        {
          id: `yh_${this.TAG}_${this.nowObjectData.index}`,
          objectsIndex: this.nowObjectData.index,
        }
      );
      this.drawRay(this.addData.lineDom, this.nowObjectData.index);
      this.drawRayCircle(
        [x, y],
        this.addData.drawPoints.length - 1,
        this.nowObjectData.index,
        this.addData.gDom
      );
    } else {
      this.drawRayCircle(
        [x, y],
        this.addData.drawPoints.length - 1,
        this.nowObjectData.index,
        this.addData.gDom
      );
      this.addData.start = false;
      this.addData.sign = false;
      this.endFun();
    }
  }
  addRaying(x: number, y: number) {
    if (!this.addData.start) return;
    this.addData.lineDom.attr({
      x2: x,
      y2: y,
    });
  }
  endFun() {
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      data: this.nowObjectData.data,
      sign: this.TAG,
      objectIndex: this.nowObjectData.index,
    });
    this.init();
  }
  init() {
    this.addData = {
      sign: false,
      start: false,
      drawPoints: [],
      lineDom: null,
      rayDom: null,
    };
    this.editData = {
      drawPoints: [],
      lineDom: null,
      gDom: null,
    };
    this.nowObjectData = {};
  }
  drawLineDom(dom, points, attrObj) {
    return dom
      .line(points)
      .attr({
        stroke: this.lineColor,
        ...attrObj,
      })
      .css({ cursor: "pointer" })
      .on("mousedown", this.rayDown, this);
  }
  drawRay(dom, objectsIndex) {
    return dom
      .marker("end", 13, 13, function (add) {
        add
          .path("M2,2 L2,11 L10,6 L2,2")
          .attr({
            fill: "red",
            id: `yh_Ray_row_${objectsIndex}`,
          })
          .css({ "pointer-events": "none" });
      })
      .attr({
        refX: 9,
        refY: 6,
        orient: "auto",
      });
  }
  rayMoving(x: number, y: number) {
    if (!this.commonContorl.circleData.downSign) return;
    const points = [...this.editData.drawPoints];
    points[this.commonContorl.hoverData.hoverCircleIndex] = [x, y];
    this.editData.circleDom.setAttribute("cx", x);
    this.editData.circleDom.setAttribute("cy", y);
    this.editData.lineDom.attr({
      x1: points[0][0],
      y1: points[0][1],
      x2: points[1][0],
      y2: points[1][1],
    });
    this.nowObjectData.data.shapes[0].points = this.handleDrawPoints(
      points,
      "toOrigin"
    );
  }
  rayDown(e) {
    if (
      this.addData.sign ||
      this.addData.start ||
      (this.commonContorl.operationType === "add" &&
        this.commonContorl.operationShape !== "Ray")
    )
      return;
    if (
      this.commonContorl.circleData.hoverSign ||
      this.commonContorl.circleData.downSign
    )
      return;
    const objectsIndex = Number(e.target.getAttribute("objectsIndex"));
    this.editData.lineDom = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_${objectsIndex}`
    );
    ObserverInstance.emit(drawEvents.NOW_TYPE, "Ray", objectsIndex, "rayDown");
    // 根据当前的polygon对应的object下标，发送获取数据信号
    ObserverInstance.emit(dataEvents.GET_NOW_OBJECT_DATA, objectsIndex);
  }
  async nowObject(data: { data: any; index: number }, sign = "edit") {
    // console.log(data, "data---nowObject---ray", sign);
    let Ray = null;
    if (data.data?.shapes) {
      Ray = data.data?.shapes.find((item) => {
        return item.type === "Ray";
      });
    }
    if (data.index === -1 || !data.data?.shapes || Ray === undefined) return;
    this.nowObjectData = deepClone(data);
    if (sign === "edit") {
      this.editData.drawPoints = this.handleDrawPoints(
        data.data.shapes[0].points
      );
      this.editData.lineDom = getDom(
        this.publicData.svgDom,
        `#yh_${this.TAG}_${data.index}`
      );
      this.judgeHover();
    }
  }
  judgeHover() {
    getDom(this.publicData.svgDom, `#yh_g_hover`)?.remove();
    this.editData.gDom = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_g_${this.nowObjectData.index}`
    );
  }
  drawRayLine(linePoints: number[][], objectsIndex: number) {
    if (!linePoints.length) return;
    const gDom = this.commonContorl.drawG(`yh_${this.TAG}_g_${objectsIndex}`, {
      objectsIndex: objectsIndex,
      type: "Ray",
    });
    const points = this.handleDrawPoints(linePoints);
    const ray = this.drawRay(
      this.drawLineDom(gDom, points, {
        id: `yh_${this.TAG}_${objectsIndex}`,
        objectsIndex: objectsIndex,
      }),
      objectsIndex
    );
    console.log(ray, "rayrayrayray");

    points.forEach((item, i) => {
      this.drawRayCircle(item, i, objectsIndex, gDom);
    });
  }
  drawRayCircle(points, i, objectsIndex, gDom) {
    return this.commonContorl.drawCircle(
      points,
      i,
      gDom,
      "Ray",
      this.circleDown,
      () => {},
      this,
      {
        objectsIndex: objectsIndex,
        fill: i === 0 ? "block" : "red",
        stroke: i === 0 ? "rgba(248, 250, 247, 0.3)" : "",
        "stroke-width": i === 0 ? "10" : "",
        clientID: i,
        "fill-opacity": i === 0 ? 1 : 0,
        r: i === 0 ? 2 : 4,
      },
      null
    );
  }
  circleDown(e) {
    try {
      this.rayDown(e);
      if (
        this.commonContorl.downSign ||
        this.commonContorl.keyData !== "Control"
      )
        return;
      this.commonContorl.circleData.downSign = true;
      this.editData.circleDom = e.target;
      this.commonContorl.hoverData.hoverCircleIndex = Number(
        e.target.getAttribute("clientID")
      );
    } catch (err) {
      console.log(err, "---circleDown", this.TAG);
    }
  }
  mousedownFun(e) {
    console.log(e, "e");
    e.stopImmediatePropagation();
    e.stopPropagation();
  }
  // 将 原始数据 改为 渲染数据
  handleDrawPoints(points: number[][], sign = "toDraw") {
    const arr: number[][] = new Array(points.length).fill([]);
    for (let i = 0; i < points.length; i++) {
      if (sign === "toDraw") {
        arr[i] = [
          points[i][0] / this.publicData.scale,
          points[i][1] / this.publicData.scale,
        ];
      } else {
        arr[i] = [
          points[i][0] * this.publicData.scale,
          points[i][1] * this.publicData.scale,
        ];
      }
    }
    return arr;
  }
}
export default rayContorl;
