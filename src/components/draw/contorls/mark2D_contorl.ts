/*
 * @Author: yinshunyu
 * @Date: 2022-12-24 16:01:03
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-12 15:16:48
 * @FilePath: \DataClient\src\components\draw\contorls\mark2D_contorl.ts
 * @Description:
 *
 */
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
import { deepClone, getTypeIndex, getDom } from "@/utils/util";

class markContorl {
  public publicData: { svgDom: any; scale: number } = {
    svgDom: null,
    scale: 1,
  };
  public editData: any = {
    rectDom: null,
    data: [], // points--原始数据
    drawData: [], // 渲染数据
    hoverGDom: null,
    hoverCirclesDom: [],
    hoverCirclesPoints: [], // 渲染的circle坐标
    originCirclePoint: [], // 选中circle时得坐标--用来对比是否修改过
  };
  public addData: any = {
    sign: false,
    start: false,
    rectDom: null,
    points: [[], []],
    drawPoints: [[], []],
    startPoint: [], // 开始创建rect时的初始坐标
  };
  commonContorl: any = null;
  shapesIndex = 1; // shapes中对应类型的下标
  // 当前选中的数据
  public nowObjectData: any = {
    data: {},
    index: -1,
  };
  observerListenerList = [
    {
      eventName: dataEvents.SEND_NOW_OBJECT_DATA,
      fn: this.nowObject.bind(this),
    },
    { eventName: drawEvents.RECT_2D_CIRCLE_UP, fn: this.mouseUP.bind(this) },
  ];

  constructor(publicData: { svgDom: any; scale: number }, commonContorl: any) {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_typeLine"
    );
    this.publicData = publicData;
    this.commonContorl = commonContorl;
  }
  /**  edit
   * @description: 对矩形进行拉伸处理
   * @param {number} x 鼠标在svg画布上移动的x坐标
   * @param {number} y 鼠标在svg画布上移动的y坐标
   * @param {number} index 当前控制的circlr下标
   */
  mouseMoveFun(x: number, y: number) {
    if (!this.commonContorl.circleData.downSign) return;
    let whObj,
      index = this.commonContorl.hover2Data.hoverCircleIndex,
      first = this.editData.drawData[0], // 初始的 开始 坐标
      last = this.editData.drawData[1]; // 初始的 结束 坐标

    // 超出拉伸范围则拒绝计算
    if (
      (index === 3 || index === 5 || index === 4) &&
      (x <= first[0] + 1 || y <= first[1] + 1)
    )
      return;
    if (
      (index === 1 || index === 7 || index === 0) &&
      (x >= last[0] - 1 || y >= last[1] - 1)
    )
      return;
    if (index === 2 && (y >= last[1] - 1 || x <= first[0] + 1)) return;
    if (index === 6 && (x >= last[0] - 1 || y <= first[1] + 1)) return;

    if (index === 3) {
      whObj = this.handleWH(first, [x, y]);
      last = [x, last[1]];
      this.editData.rectDom.attr({
        width: whObj.width,
      });
    }
    if (index === 4) {
      whObj = this.handleWH(first, [x, y]);
      last = [x, y];
      this.editData.rectDom.attr({
        ...whObj,
      });
    }
    if (index === 1) {
      first = [first[0], y];
      whObj = this.handleWH(first, last);
      this.editData.rectDom.attr({
        y: y,
        height: whObj.height,
      });
    }
    if (index === 5) {
      last = [last[0], y];
      whObj = this.handleWH(first, last);
      this.editData.rectDom.attr({
        height: whObj.height,
      });
    }
    if (index === 7) {
      first = [x, first[1]];
      whObj = this.handleWH(first, last);
      this.editData.rectDom.attr({
        width: whObj.width,
        x: x,
      });
    }
    if (index === 0) {
      first = [x, y];
      whObj = this.handleWH(first, last);
      this.editData.rectDom.attr({
        width: whObj.width,
        x: x,
        y: y,
        height: whObj.height,
      });
    }
    if (index === 2) {
      first = [first[0], y];
      last = [x, last[1]];
      whObj = this.handleWH(first, last);
      this.editData.rectDom.attr({
        width: whObj.width,
        y: y,
        height: whObj.height,
      });
    }
    if (index === 6) {
      first = [x, first[1]];
      last = [last[0], y];
      whObj = this.handleWH(first, last);
      this.editData.rectDom.attr({
        width: whObj.width,
        x: x,
        height: whObj.height,
      });
    }
    this.editData.hoverCirclesPoints = this.handleCircle([first, last]);
    this.handleCircleDom(this.editData.hoverCirclesPoints);
    this.editData.drawData = [first, last];
    this.editData.data = this.handleDrawPoints(
      this.editData.drawData,
      "toOrigin"
    );
  }
  // add: 用户点击新建按钮
  addUpdate(data: { data: any; index: number }) {
    if (this.addData.sign) return;
    this.addData.sign = true;

    this.nowObject(data, "add");
  }
  // add:添加rect元素，开始生成rect
  add2D(x: number, y: number) {
    if (!this.addData.sign) return;

    if (!this.addData.start) {
      this.addData.start = true;
      this.addData.drawPoints = [
        [x, y],
        [x, y],
      ];
      this.addData.startPoint = [x, y];
      this.addData.rectDom = this.drawRect(
        this.addData.drawPoints,
        this.nowObjectData.index
      );
    } else {
      this.addData.start = false;
      this.addData.sign = false;
      this.shapesIndex = getTypeIndex(this.nowObjectData.data.shapes, "Box2d");
      console.log(this.nowObjectData.data, "this.nowObjectData.data");

      this.nowObjectData.data.shapes[this.shapesIndex].points =
        this.addData.data;

      ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
        data: this.nowObjectData.data,
        sign: "Box2d",
        objectIndex: this.nowObjectData.index,
      });
    }
  }
  add2Ding(x: number, y: number) {
    if (!this.addData.start) return;

    let whObj, first, last;
    if (x >= this.addData.startPoint[0] && y <= this.addData.startPoint[1]) {
      first = [this.addData.startPoint[0], y];
      last = [x, this.addData.startPoint[1]];
    } else if (
      x <= this.addData.startPoint[0] &&
      y <= this.addData.startPoint[1]
    ) {
      first = [x, y];
      last = [this.addData.startPoint[0], this.addData.startPoint[1]];
    } else if (
      x <= this.addData.startPoint[0] &&
      y >= this.addData.startPoint[1]
    ) {
      first = [x, this.addData.startPoint[1]];
      last = [this.addData.startPoint[0], y];
    } else if (
      x > this.addData.startPoint[0] &&
      y > this.addData.startPoint[1]
    ) {
      first = this.addData.startPoint;
      last = [x, y];
    }
    whObj = this.handleWH(first, last);
    this.addData.rectDom.attr({
      x: first[0],
      y: first[1],
      width: whObj.width,
      height: whObj.height,
    });
    this.addData.data = [first, last];
  }

  // 绘制2d框rect
  draw2D(rectPoints: number[][], objectsIndex: number) {
    // console.log(rectPoints, "rectPoints");

    if (!rectPoints.length) return;
    this.drawRect([...rectPoints], objectsIndex);
  }
  drawRect(rectPoints: number[][], objectsIndex: number) {
    const sizeObj = this.handleWH(rectPoints[0], rectPoints[1]);
    return this.publicData.svgDom
      .rect()
      .attr({
        fill: "blue",
        stroke: "#66FF40",
        "fill-opacity": "0.2",
        "stroke-opacity": "1",
        "stroke-width": "0.5",
        "color-rendering": "optimizeQuality",
        "shape-rendering": "geometricprecision",
        width: sizeObj.width,
        height: sizeObj.height,
        x: rectPoints[0][0],
        y: rectPoints[0][1],
        id: "yh_Box2d_g_" + objectsIndex,
        objectsIndex: objectsIndex,
        type: "Box2d",
      })
      .on("mousedown", this.mouseDownRect, this);
  }
  // 获取当前操作的object数据
  public async nowObject(data: { data: any; index: number }, sign = "edit") {
    let Box2d = null;
    if (data.data?.shapes) {
      Box2d = data.data?.shapes.find((item) => {
        return item.type === "Box2d";
      });
    }
    if (data.index === -1 || !data.data?.shapes || Box2d === undefined) return;
    console.log(data, "data---nowObject---2d", sign);
    this.shapesIndex = getTypeIndex(data.data.shapes, "Box2d");
    if (this.shapesIndex < 0) return;
    if (
      data.data.shapes[this.shapesIndex].points.length < 1 &&
      sign === "edit"
    ) {
      this.clearG();
      return;
    }
    this.nowObjectData = deepClone(data);
    // add状态下整理数据，开始创建
    if (sign === "add") {
      this.addData.sign = true;
    } else {
      this.getRectG(data.index);
      this.editData.data = deepClone(data.data.shapes[this.shapesIndex].points);
      this.editData.drawData = this.handleDrawPoints(this.editData.data);
      this.editData.hoverCirclesPoints = this.handleCircle(
        this.editData.drawData
      );
      this.editData.originCirclePoint = this.editData.hoverCirclesPoints;
      this.commonContorl.hover2Data.hoverGDom = getDom(
        this.publicData.svgDom,
        "#yh_g_hover_Box2d"
      );
      this.commonContorl.hover2Data.hoverGDom?.remove();
      this.commonContorl.hover2Data.hoverGDom =
        this.commonContorl.drawG("yh_g_hover_Box2d");
      this.judgeHover();
    }
  }
  // edit: 修改数据后重新渲染hover标签
  getRectG(index: number) {
    this.editData.rectDom = this.getDom(
      this.publicData.svgDom,
      "#yh_Box2d_g_" + index
    );
  }

  // edit：控制hover元素
  judgeHover() {
    this.commonContorl.hover2Data.hoverGDom.use(this.editData.rectDom);
    this.editData.hoverCirclesDom = new Array(4).fill([]);
    // 绘制hover中的circle--方便控制
    for (let i = 0; i < this.editData.hoverCirclesPoints.length; i++) {
      this.editData.hoverCirclesDom[i] = this.commonContorl.drawCircle(
        this.editData.hoverCirclesPoints[i],
        i,
        this.commonContorl.hover2Data.hoverGDom,
        "Box2d",
        null,
        null,
        null,
        {
          fill: "#66FF40",
          "fill-opacity": "0.9",
        }
      );
    }
  }
  mouseUP() {
    this.shapesIndex = getTypeIndex(this.nowObjectData.data.shapes, "Box2d");
    this.nowObjectData.data.shapes[this.shapesIndex].points =
      this.editData.data;
    const hoverCircleIndex = this.commonContorl.hover2Data.hoverCircleIndex;
    if (
      this.editData.originCirclePoint[hoverCircleIndex].toString() ===
      this.editData.hoverCirclesPoints[hoverCircleIndex].toString()
    ) {
      // console.log("相同--不改变");
      return;
    }
    this.editData.originCirclePoint = this.editData.hoverCirclesPoints;
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      data: this.nowObjectData.data,
      objectIndex: this.nowObjectData.index,
      sign: "Box2d",
    });
  }

  // rect点击选中事件
  mouseDownRect(e) {
    // e.stopPropagation()
    if (
      this.addData.sign ||
      this.addData.start ||
      (this.commonContorl.operationType === "add" &&
        this.commonContorl.operationShape !== "Box2d")
    )
      return;
    if (
      this.commonContorl.circleData.hoverSign ||
      this.commonContorl.circleData.downSign
    )
      return;
    this.getRectG(Number(e.target.getAttribute("objectsIndex")));

    ObserverInstance.emit(
      drawEvents.NOW_TYPE,
      "Box2d",
      this.nowObjectData.index,
      "mouseDownRect"
    );
    // 根据当前的polygon对应的object下标，发送获取数据信号
    ObserverInstance.emit(
      dataEvents.GET_NOW_OBJECT_DATA,
      Number(e.target.getAttribute("objectsIndex"))
    );
  }
  getDom(dom: any, name: string) {
    return dom.find(name)[0];
  }
  handleCircleDom(points: number[][]) {
    for (let i = 0; i < points.length; i++) {
      this.editData.hoverCirclesDom[i].attr({
        cx: points[i][0],
        cy: points[i][1],
      });
    }
  }
  // 计算g标签内circle的坐标
  public handleCircle(points: number[][]) {
    const x0 = points[0][0],
      y0 = points[0][1],
      x1 = points[1][0],
      y1 = points[1][1],
      arr = [
        [x0, y0],
        [(x1 - x0) / 2 + x0, y0],
        [x1, y0],
        [x1, (y1 - y0) / 2 + y0],
        [x1, y1],
        [(x1 - x0) / 2 + x0, y1],
        [x0, y1],
        [x0, (y1 - y0) / 2 + y0],
      ];
    return arr;
  }
  // 将 原始数据 改为 渲染数据
  handleDrawPoints(points: number[][], sign: string = "toDraw") {
    let arr: number[][] = new Array(points.length).fill([]);
    for (let i = 0; i < points.length; i++) {
      arr[i] = [...points[i]];
    }
    return arr;
  }
  /**
   * @description: 计算矩形宽高
   * @param {number} first: points[0]  只左上角的x，y坐标
   * @param {number} last: points[1]  只右下角的x，y坐标
   * @return {*}
   */
  public handleWH(first: number[], last: number[]) {
    return {
      width: last[0] - first[0],
      height: last[1] - first[1],
    };
  }

  clearG() {
    this.getDom(this.publicData.svgDom, "#yh_g_hover_Box2d")?.clear();
  }

  init() {
    this.editData = {
      ...this.editData,
      hoverGDom: null,
      hoverCirclesDom: [],
      hoverCirclesPoints: [], // 渲染的circle坐标
    };
  }
}
export default markContorl;
