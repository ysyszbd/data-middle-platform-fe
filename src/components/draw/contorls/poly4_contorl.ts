import { ObserverInstance } from "@/components/draw/event/observer";
import { dataEvents, drawEvents } from "@/components/draw/event/events";
import { deepClone, getDom } from "@/utils/util";

class tool2Contorl {
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
    { eventName: drawEvents.POLY4_CIRCLE_UP, fn: this.mouseUP.bind(this) },
  ];
  TAG = "Poly4";
  addData: any = {
    sign: false,
    start: false,
    drawPoints: [],
    dom: null,
    gDom: null,
  };
  editData: any = {
    dom: null,
    gDom: null,
    circleDom: null,
    textDom: null,
    pointsIndex: -1,
  };
  nowObjectData: { index: number; data: any } = {
    index: -1,
    data: {},
  };

  constructor(publicData: { svgDom: any; scale: number }, commonContorl: any) {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_Poly4"
    );
    this.publicData = publicData;
    this.commonContorl = commonContorl;
  }
  // 获取当前操作的object数据
  public async nowObject(data: { data: any; index: number }, sign = "edit") {
    let Poly4 = null;
    if (data.data?.shapes) {
      Poly4 = data.data?.shapes.find((item) => {
        return item.type === "Poly4";
      });
    }
    if (data.index === -1 || !data.data?.shapes || Poly4 === undefined) return;
    console.log(data, "data---nowObject---Poly4", sign);
    this.nowObjectData = deepClone(data);
    if (sign === "edit") {
      this.editData.drawData = this.handleDrawPoints(
        this.nowObjectData.data.shapes[0].points
      );
      this.editData.gDom = getDom(
        this.publicData.svgDom,
        `#yh_${this.TAG}_g_${data.index}`
      );
      this.editData.dom = getDom(
        this.editData.gDom,
        `#yh_${this.TAG}_${data.index}`
      );
      this.judgeHover();
    }
  }
  judgeHover() {
    try {
      this.commonContorl.hoverData.hoverGDom = getDom(
        this.publicData.svgDom,
        "#yh_g_hover"
      );
      this.commonContorl.hoverData.hoverGDom?.remove();
      this.commonContorl.hoverData.hoverGDom =
        this.commonContorl.drawG("yh_g_hover");
      for (let i = 0; i < this.editData.drawData.length; i++) {
        this.commonContorl.drawCircle(
          this.editData.drawData[i],
          i,
          this.commonContorl.hoverData.hoverGDom,
          "Poly4",
          this.circleDownFun,
          () => {},
          this,
          {
            fill: "blue",
            "fill-opacity": "0.9",
          }
        );
      }
    } catch (err) {
      console.log(err, "err---judgeHover");
    }
  }
  circleDownFun(e) {
    if (
      this.commonContorl.circleData.downSign ||
      this.commonContorl.keyData !== "Control"
    )
      return;
    this.commonContorl.circleData.downSign = true;
    this.editData.pointsIndex = Number(e.target.getAttribute("clientID"));
    this.editData.circleDom = getDom(
      this.commonContorl.hoverData.hoverGDom,
      `#yh_g_circle_${this.editData.pointsIndex}`
    );
    this.editData.textDom = getDom(
      this.editData.gDom,
      `#yh_${this.TAG}_objectsIndex_${this.nowObjectData.index}_text_${this.editData.pointsIndex}`
    );
    console.log(this.editData, "this.editData");
  }
  mouseUP() {
    this.nowObjectData.data.shapes[0].points = this.handleDrawPoints(
      this.editData.drawData,
      "toOrigin"
    );
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      data: this.nowObjectData.data,
      objectIndex: this.nowObjectData.index,
      sign: "Poly4",
    });
  }
  // add: 用户点击新建按钮
  addUpdate(data: { data: any; index: number }) {
    if (this.addData.sign) return;
    this.addData.sign = true;
    this.nowObject(data, "add");
  }
  // add：绘制Poly4
  addPoly4(x: number, y: number) {
    console.log(x, y, "x--y");
    if (!this.addData.sign) return;
    if (!this.addData.start) {
      this.addData.start = true;
      this.addData.drawPoints.push([x, y]);
      this.addData.gDom = this.commonContorl.drawG(
        `yh_${this.TAG}_g_${this.nowObjectData.index}`,
        {
          objectsIndex: this.nowObjectData.index,
          type: "Poly4",
        }
      );
      this.addData.dom = this.drawPolygon(
        this.addData.drawPoints,
        this.nowObjectData.index,
        this.addData.gDom
      );
    } else {
      if (this.addData.drawPoints.length <= 4) {
        this.addData.drawPoints.push([x, y]);
        if (this.addData.drawPoints.length >= 4) {
          this.addData.start = false;
          this.addData.sign = false;
        }
      }
    }
    this.nowObjectData.data.shapes[0].points.push([
      x * this.publicData.scale,
      y * this.publicData.scale,
    ]);
    this.drawText(
      [x, y],
      this.nowObjectData.index,
      this.addData.gDom,
      this.addData.drawPoints.length - 1
    );
    if (
      !this.addData.start &&
      !this.addData.sign &&
      this.addData.drawPoints.length === 4
    ) {
      this.addData = {
        sign: false,
        start: false,
        drawPoints: [],
        dom: null,
        gDom: null,
      };
      ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
        data: this.nowObjectData.data,
        sign: "Poly4",
        objectIndex: this.nowObjectData.index,
      });
    }
  }
  addPoly4ing(x: number, y: number) {
    try {
      if (!this.addData.start) return;
      this.addData.dom.attr({
        points: [...this.addData.drawPoints, [x, y]],
      });
    } catch (err) {
      console.log(err, "err---addPoly4ing");
    }
  }
  poly4Moving(x: number, y: number) {
    try {
      if (!this.commonContorl.circleData.downSign) return;
      let points = deepClone(this.editData.drawData);
      points[this.editData.pointsIndex] = [x, y];
      this.editData.circleDom.attr({
        cx: x,
        cy: y,
      });
      this.editData.textDom.attr({
        x: x - 4,
        y: y + 16,
      });
      this.editData.dom.attr({
        points: points,
      });
      this.editData.drawData = points;
    } catch (err) {
      console.log(err, "err--poly4Moving");
    }
  }
  drawText(point: number[], index: number, gDom, pointsIndex) {
    return gDom.text(pointsIndex + 1).attr({
      id: `yh_${this.TAG}_objectsIndex_${index}_text_${pointsIndex}`,
      fill: "blue",
      size: 16,
      x: point[0] - 4,
      y: point[1] + 16,
    });
  }
  drawPoly4(points: number[][], index: number) {
    try {
      if (!points.length) return;
      let drawPoints = this.handleDrawPoints(points),
        gDom = this.commonContorl.drawG(`yh_${this.TAG}_g_${index}`, {
          objectsIndex: index,
          type: "Poly4",
        });
      this.drawPolygon(drawPoints, index, gDom);
      drawPoints.forEach((item, i) => {
        this.drawText(item, index, gDom, i);
      });
    } catch (err) {
      console.log(err, "err--drawPoly4");
    }
  }
  // 绘制polygon 最多4个点
  drawPolygon(points: number[][], index: number, gDom) {
    return gDom
      .polygon(points)
      .attr({
        fill: "blue",
        stroke: "green",
        "fill-opacity": "0.2",
        "stroke-width": "1",
        "color-rendering": "optimizeQuality",
        "shape-rendering": "geometricprecision",
        "data-z-order": 0,
        id: `yh_${this.TAG}_${index}`,
        objectsIndex: index, // 这里的index指的是当前polygon对应的objects下标
        sign: this.TAG,
        type: this.TAG,
      })
      .on("mousedown", this.poly4Down, this);
  }
  poly4Down(e) {
    if (
      this.addData.sign ||
      this.addData.start ||
      (this.commonContorl.operationType === "add" &&
        this.commonContorl.operationShape !== "Poly4")
    )
      return;
    if (
      this.commonContorl.circleData.hoverSign ||
      this.commonContorl.circleData.downSign
    )
      return;
    const objectsIndex = Number(e.target.getAttribute("objectsIndex"));
    console.log(objectsIndex, "objectsIndex");
    
    this.editData.gDom = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_g_${objectsIndex}`
    );
    this.editData.dom = getDom(
      this.editData.gDom,
      `#yh_${this.TAG}_${objectsIndex}`
    );
    ObserverInstance.emit(
      drawEvents.NOW_TYPE,
      "Poly4",
      objectsIndex,
      "poly4Down"
    );
    // 根据当前的polygon对应的object下标，发送获取数据信号
    ObserverInstance.emit(dataEvents.GET_NOW_OBJECT_DATA, objectsIndex);
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
export default tool2Contorl;
