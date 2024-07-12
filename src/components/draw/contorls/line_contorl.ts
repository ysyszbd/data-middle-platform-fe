import { deepClone, getDom } from "@/utils/util";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";

class lineContorl {
  public publicData: { svgDom: any; scale: number } = {
    svgDom: null,
    scale: 1,
  };
  observerListenerList = [
    {
      eventName: dataEvents.SEND_NOW_OBJECT_DATA,
      fn: this.nowObject.bind(this),
    },
    { eventName: drawEvents.LINE_CIRCLE_UP, fn: this.addEnd.bind(this) },
  ];
  nowObjectData: any = {
    data: {},
    index: -1,
  };
  editData: any = {
    points: [],
    drawPoints: [],
    lineDom: null,
    circleDom: null,
    gDom: null,
  };
  addData: any = {
    sign: false,
    start: false,
    points: [],
    drawPoints: [],
  };
  TAG = "Line";
  lineColor = "rgb(8, 175, 252)";
  pointColorStart = "rgba(0, 0, 0, 1)";
  pointColorEnd = "rgba(43, 128, 33, 1)";
  commonContorl: any = null;
  constructor(publicData: { svgDom: any; scale: number }, commonContorl: any) {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_line"
    );
    this.publicData = publicData;
    this.commonContorl = commonContorl;
  }
  addUpdate(data: { data: any; index: number }) {
    if (this.addData.sign) return;
    this.addData.sign = true;
    this.nowObject(data, "add");
  }
  addLine(x: number, y: number) {
    if (!this.addData.sign) return;
    const gDom = this.commonContorl.drawG(
      `yh_${this.TAG}_g_${this.nowObjectData.index}`,
      {
        objectsIndex: this.nowObjectData.index,
        type: "Line",
      }
    );
    this.addData.drawPoints.push([x, y]);
    this.nowObjectData.data.shapes[0].points.push([
      x * this.publicData.scale,
      y * this.publicData.scale,
    ]);
    this.commonContorl.drawCircle(
      [x, y],
      this.addData.drawPoints.length - 1,
      gDom,
      "Line",
      this.circleDown,
      () => {},
      this,
      {
        fill: this.addData.drawPoints.length - 1 === 0 ? "block" : "#245F24",
        clientID: this.addData.drawPoints.length - 1,
        objectsIndex: this.nowObjectData.index,
      },
      null
    );
    if (!this.addData.start) {
      this.addData.start = true;
      this.addData.lineDom = this.drawLineDom(
        gDom,
        [...this.addData.drawPoints, ...this.addData.drawPoints],
        {
          id: `yh_${this.TAG}_${this.nowObjectData.index}`,
          objectsIndex: this.nowObjectData.index,
        }
      );
    } else {
      this.addData.start = false;
      this.addData.sign = false;
      this.addEnd();
    }
  }
  addEnd() {
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      data: this.nowObjectData.data,
      sign: "Line",
      objectIndex: this.nowObjectData.index,
    });
    this.init();
  }
  adding(x: number, y: number) {
    if (!this.addData.start) return;
    this.addData.lineDom.attr({
      x2: x,
      y2: y,
    });
  }
  drawLineDom(dom, points, attrObj) {
    return dom
      .line(points)
      .attr({
        stroke: this.lineColor,
        ...attrObj,
      })
      .css({ cursor: "pointer" })
      .on("mousedown", this.lineDown, this);
  }
  lineDown(e) {
    if (
      this.addData.sign ||
      this.addData.start ||
      (this.commonContorl.operationType === "add" &&
        this.commonContorl.operationShape !== "Line")
    )
      return;
    if (
      this.commonContorl.circleData.hoverSign ||
      this.commonContorl.circleData.downSign
    )
      return;
    const objectsIndex = Number(e.target.getAttribute("objectsIndex")),
      gDom = getDom(
        this.publicData.svgDom,
        `#yh_${this.TAG}_g_${objectsIndex}`
      );
    this.editData.lineDom = getDom(gDom, `#yh_${this.TAG}_${objectsIndex}`);
    ObserverInstance.emit(
      drawEvents.NOW_TYPE,
      "Line",
      objectsIndex,
      "lineDown"
    );
    // 根据当前的polygon对应的object下标，发送获取数据信号
    ObserverInstance.emit(dataEvents.GET_NOW_OBJECT_DATA, objectsIndex);
  }
  circleDown(e) {
    try {
      this.lineDown(e);
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
  lineMoveing(x: number, y: number) {
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
  public nowObject(data: { data: any; index: number }, sign = "edit") {
    console.log(data, "line", sign);
    let Line = null;
    if (data.data?.shapes) {
      Line = data.data?.shapes.find((item) => {
        return item.type === "Line";
      });
    }
    if (data.index === -1 || !data.data.shapes || Line === undefined) return;
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
    this.editData.gGom = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_g_${this.nowObjectData.index}`
    );
    this.editData.circlesDom = this.editData.gGom?.find("circle");
  }
  drawLine(linePoints: number[][], objectsIndex: number) {
    if (!linePoints.length) return;
    const gDom = this.commonContorl.drawG(`yh_${this.TAG}_g_${objectsIndex}`, {
      objectsIndex: objectsIndex,
      type: "Line",
    });
    const points = this.handleDrawPoints(linePoints);
    this.drawLineDom(gDom, points, {
      id: `yh_${this.TAG}_${objectsIndex}`,
      objectsIndex: objectsIndex,
    });
    points.forEach((item, i) => {
      this.commonContorl.drawCircle(
        item,
        i,
        gDom,
        "Line",
        this.circleDown,
        () => {},
        this,
        {
          fill: i === 0 ? this.pointColorStart : this.pointColorEnd,
          clientID: i,
          objectsIndex: objectsIndex,
          stroke: i === 0 ? "rgba(248, 250, 247, 0.3)" : "rgba(22, 227, 18, 0.3)",
          "stroke-width": "10",
          circle: 4
        },
        null
      );
    });
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
  init() {
    this.nowObjectData = {
      data: {},
      index: -1,
    };
    this.editData = {
      points: [],
      drawPoints: [],
      lineDom: null,
    };
    this.addData = {
      sign: false,
      start: false,
      points: [],
      drawPoints: [],
    };
  }
}
export default lineContorl;
