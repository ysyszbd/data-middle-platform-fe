import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
import { deepClone, handlePoints, getDom } from "@/utils/util";
import { useStateStore } from "@/stores/state";
const store = useStateStore();
let x0, y0, y1, x1;
class curveContorl {
  observerListenerList = [
    {
      eventName: dataEvents.SEND_NOW_OBJECT_DATA,
      fn: this.nowObject.bind(this),
    },
    { eventName: drawEvents.CURVE_CIRCLE_UP, fn: this.circleUp.bind(this) },
    { eventName: drawEvents.ADD_NEW_END, fn: this.CurveEnd.bind(this) },
    { eventName: drawEvents.CURVE_DEL_CIRCLE, fn: this.delPoint.bind(this) },
    {
      eventName: drawEvents.CURVE_HANDLE_ROAD,
      fn: this.drawRoadText.bind(this),
    },
    {
      eventName: drawEvents.CURVE_CHANGE_COLOR,
      fn: this.changeColor.bind(this),
    },
    {
      eventName: drawEvents.CURVE_CLEAR_ROAD_DOM,
      fn: this.clearRoadDom.bind(this),
    },
    {
      eventName: drawEvents.CURVE_CHANGE_CIRCLE_DATA,
      fn: this.changeCircleData.bind(this),
    },
    {
      eventName: drawEvents.CURVE_INSERT_CIRCLE,
      fn: this.insertCircle.bind(this),
    },
  ];
  publicData: { svgDom: any; scale: number } = {
    svgDom: null,
    scale: 1,
  };
  nowType = {
    color: "",
    index: 0,
    opacity: 1,
    name: "",
    pointColor: "",
  };
  typeList: any = [];
  editData: any = {
    gDom: null,
    circleDom: null,
    hoverGDom: null,
    drawPoints: [],
    data: null,
    pointsIndex: -1,
    downSign: false,
    downCircle: null,
    lineBeforeDom: null,
    lineAfterDom: null,
    moveXY: [],
    insertSign: false, // 插入标识
    insertBeforeDom: null,
    insertAfterDom: null,
    insertCircleDom: null,
  };
  addData: any = {
    sign: false,
    start: false,
    gDom: null,
    hoverGDom: null,
    CurveDom: null,
    drawPoints: [],
    data: {
      points: [],
      properties: [],
    },
  };
  colorObj = {
    "--": "#50792E",
    黄: "yellow",
    白: "white",
    蓝: "blue",
  };
  nowLineColor = "--";
  TAG = "Curve";
  objectsIndex = -1;
  commonContorl: any;

  constructor(
    publicData: { svgDom: any; scale: number },
    commonContorl: any,
    typeList
  ) {
    this.publicData = publicData;
    this.commonContorl = commonContorl;
    this.typeList = typeList;
    this.addListenerList();
  }
  // 添加事件监听
  addListenerList() {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      `yh_svg_${this.TAG}`
    );
  }
  // 道路
  drawRoadText(
    textPoint: number[],
    groupIndex: number,
    roadData: any,
    roadNum: number,
    linePoints: number[][],
    lines: string[]
  ) {
    let gDom = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_group_${groupIndex}`
    );
    if (gDom) {
      const dom = getDom(
        gDom,
        `#yh_${this.TAG}_group_${groupIndex}_text_${roadData.key}`
      );

      if (dom) {
        dom.text(roadData.value).attr({
          x: textPoint[0],
          y: textPoint[1],
        });
      } else {
        this.drawTextDom(gDom, textPoint, groupIndex, roadData);
      }
    } else {
      gDom = this.publicData.svgDom.group().attr({
        id: `yh_${this.TAG}_group_${groupIndex}`,
        lines: lines,
        sign: "group",
      });
      this.drawTextDom(gDom, textPoint, groupIndex, roadData);
    }
    if (roadNum === 2) {
      this.drawRoadLine(linePoints, groupIndex, gDom);
    }
    if (roadNum > 2) {
      getDom(
        this.publicData.svgDom,
        `#yh_${this.TAG}_group_${groupIndex}_line`
      )?.remove();
    }
  }
  drawRoadLine(point: number[][], groupIndex: number, gDom) {
    const lineDom = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_group_${groupIndex}_line`
    );

    const arr: any = new Array(point.length).fill([]);
    point.forEach((item, i) => {
      arr[i] = [item[0], item[1]];
    });
    if (lineDom) {
      lineDom.attr({
        x1: arr[0][0],
        y1: arr[0][1],
        x2: arr[1][0],
        y2: arr[1][1],
      });
    } else {
      gDom.line().attr({
        "stroke-dasharray": "3 2",
        id: `yh_${this.TAG}_group_${groupIndex}_line`,
        "stroke-width": "1.2",
        stroke: "yellow",
        x1: arr[0][0],
        y1: arr[0][1],
        x2: arr[1][0],
        y2: arr[1][1],
      });
    }
  }
  drawTextDom(dom, textPoint: number[], groupIndex: number, roadData: any) {
    return dom
      .text(roadData.value)
      .attr({
        id: `yh_${this.TAG}_group_${groupIndex}_text_${roadData.key}`,
        fill: "red",
        x: textPoint[0],
        y: textPoint[1],
      })
      .css({
        font: "italic 20px serif",
      });
  }
  // 清除组dom
  clearRoadDom(index) {
    getDom(this.publicData.svgDom, `#yh_${this.TAG}_group_${index}`)?.remove();
  }
  delPoint(pointsIndex) {
    // debugger
    if (pointsIndex !== this.editData.pointsIndex) return;
    store.setDrawDomRefresh(1);
    this.editData.data.points.splice(pointsIndex, 1);
    this.editData.data.properties.splice(pointsIndex, 1);
    this.editData.drawPoints.splice(pointsIndex, 1);
    this.editData.downCircle = null;
    this.editData.pointsIndex = -1;
    getDom(this.editData.hoverGDom, "#yh_g_circle_high_hover")?.remove();
    this.changeCircle("edit", {
      pointsIndex: -1,
    });
    console.log(this, "this------delPoint");
    
    this.handleEnd();
  }
  // edit: 插入点
  insertCircle(val) {
    const pointsIndex = this.editData.pointsIndex;
    const cruve = store.getDrawBrushData;
    if (val === "添加点") {
      if (this.editData.insertSign) return;
      this.editData.insertSign = true;
      this.editData.insertCircleDom = this.commonContorl.drawCircle(
        this.editData.drawPoints[pointsIndex],
        0,
        this.editData.hoverGDom,
        "yh_circle",
        () => {},
        () => {},
        this,
        {
          fill: this.typeList[cruve[0]].pointColor,
          stroke: this.typeList[cruve[0]].pointColor,
        }
      );
      this.editData.insertBeforeDom = getDom(
        this.editData.gDom,
        `#yh_${this.TAG}_objectsindex_${this.objectsIndex}_pointsIndex_${pointsIndex}`
      )?.attr({
        points: [
          this.editData.drawPoints[pointsIndex],
          this.editData.drawPoints[pointsIndex],
        ],
        "stroke-opacity":
          this.typeList[this.editData.data.properties[pointsIndex][0]].opacity,
      });
      this.editData.insertAfterDom = this.drawPolyLine(
        this.editData.gDom,
        [
          this.editData.drawPoints[pointsIndex],
          this.editData.drawPoints[pointsIndex + 1],
        ],
        {
          "stroke-opacity": this.typeList[cruve[0]].opacity,
          id: `yh_${this.TAG}`,
          fill: this.colorObj[this.nowLineColor],
          stroke: this.colorObj[this.nowLineColor],
          objectsIndex: this.objectsIndex,
          pointsIndex: -1,
          typeName: this.typeList[cruve[0]].name,
        }
      );
      this.editData.downCircle.attr({
        cx: this.editData.drawPoints[pointsIndex][0],
        cy: this.editData.drawPoints[pointsIndex][1],
      });
    } else {
      if (pointsIndex === 0) {
        if (this.editData.drawPoints.length <= 1) return;
        const w = Math.abs(
            this.editData.drawPoints[1][0] - this.editData.drawPoints[0][0]
          ),
          h = Math.abs(
            this.editData.drawPoints[1][1] - this.editData.drawPoints[0][1]
          );
        const point = [0, 0];
        const SVG = this.publicData.svgDom.node.getBoundingClientRect();

        if (w >= h) {
          point[0] = 0;
          point[1] =
            (this.editData.drawPoints[1][0] / w) * h +
            this.editData.drawPoints[0][1];
        } else {
          point[1] = SVG.height;
          point[0] =
            this.editData.drawPoints[1][0] -
            ((SVG.height - this.editData.drawPoints[1][1]) / h) * w;
        }
        this.editData.data.points[0] = [...point];
        this.editData.downCircle.attr({
          cx: point[0],
          cy: point[1],
        });
        getDom(this.publicData.svgDom, `#yh_g_circle_${pointsIndex}`).attr({
          cx: point[0],
          cy: point[1],
        });
        getDom(
          this.publicData.svgDom,
          `#yh_${this.TAG}_objectsindex_${this.objectsIndex}_pointsIndex_${pointsIndex}`
        ).attr({
          points: [point, this.editData.drawPoints[1]],
        });
        this.handleEnd();
      } else {
        this.changeCircle("edit", {
          pointsIndex: -1,
        });
        this.editData.downCircle?.remove();
        this.addData.sign = true;
        this.addData.start = true;
        this.addData.gDom = this.editData.gDom;
        this.addData.data = this.editData.data;
        this.addData.hoverGDom = this.editData.hoverGDom;
        this.commonContorl.operationType = "add";
        this.commonContorl.operationShape = "Curve";
        this.addData.drawPoints =
          this.addData.data.points[this.editData.pointsIndex];
        this.addData.CurveDom = this.drawPolyLine(
          this.addData.gDom,
          [this.addData.drawPoints, this.addData.drawPoints],
          {
            id: `yh_${this.TAG}_objectsindex_${this.objectsIndex}_pointsIndex_${
              this.addData.data.points.length - 1
            }`,
            fill: this.colorObj[this.nowLineColor],
            stroke: this.colorObj[this.nowLineColor],
            objectsIndex: this.objectsIndex,
            pointsIndex: this.addData.data.points.length - 1,
            typeName: this.typeList[cruve[0]].name,
            "fill-opacity": 0,
            "stroke-opacity": this.typeList[cruve[0]].opacity,
          }
        );
        ObserverInstance.emit(drawEvents.HANDLE_DONE_BTN, "Curve");
      }
    }
  }
  insertDown(x, y) {
    if (!this.editData.insertSign) return;
    const cruve = store.getDrawBrushData;
    this.editData.drawPoints.splice(this.editData.pointsIndex + 1, 0, [x, y]);
    this.editData.data.points.splice(this.editData.pointsIndex + 1, 0, [x, y]);
    this.editData.data.properties.splice(this.editData.pointsIndex + 1, 0, [
      ...cruve,
    ]);
    this.commonContorl.drawCircle(
      [x, y],
      0,
      this.editData.hoverGDom,
      "yh_circle",
      () => {},
      () => {},
      this,
      {
        fill: this.typeList[cruve[0]].pointColor,
        stroke: this.typeList[cruve[0]].pointColor,
      }
    );
    this.editData.insertBeforeDom = this.drawPolyLine(
      this.editData.gDom,
      [
        [x, y],
        [x, y],
      ],
      {
        "stroke-opacity": this.typeList[cruve[0]].opacity,
        id: `yh_${this.TAG}`,
        fill: this.colorObj[this.nowLineColor],
        stroke: this.colorObj[this.nowLineColor],
        objectsIndex: this.objectsIndex,
        pointsIndex: -1,
        typeName: this.typeList[cruve[0]].name,
      }
    );
    this.editData.pointsIndex++;
  }
  insertMove(x, y) {
    if (!this.editData.insertSign) return;
    this.editData.insertCircleDom.attr({
      cx: x,
      cy: y,
    });
    this.editData.insertAfterDom.attr({
      points: [
        [x, y],
        [...this.editData.drawPoints[this.editData.pointsIndex + 1]],
      ],
    });
    this.editData.insertBeforeDom.attr({
      points: [
        [...this.editData.drawPoints[this.editData.pointsIndex]],
        [x, y],
      ],
    });
    this.editData.downCircle.attr({
      cx: x,
      cy: y,
    });
  }
  insertEnd() {
    if (!this.editData.insertSign) return;
    this.editData.insertSign = false;
    this.editData.insertBeforeDom.attr({
      points: [
        [...this.editData.drawPoints[this.editData.pointsIndex]],
        [...this.editData.drawPoints[this.editData.pointsIndex + 1]],
      ],
    });
    this.editData.insertAfterDom?.remove();
    store.setDrawDomRefresh(1);
    this.handleEnd();
    this.init();
  }
  changeCircleData(obj) {
    if (
      obj.objectsIndex !== this.objectsIndex ||
      obj.pointsIndex !== this.editData.pointsIndex
    )
      return;
    if (obj.sign === "最顶层") {
      this.editData.data.properties[obj.pointsIndex][1] = obj.value;
    }
    if (obj.sign === "点类型") {
      if (this.editData.data.properties[obj.pointsIndex][0] !== obj.value) {
        this.editData.data.properties[obj.pointsIndex][0] = obj.value;
        const typeObj = this.typeList[obj.value];
        if (obj.pointsIndex !== this.editData.data.points.length - 1) {
          getDom(
            this.editData.gDom,
            `#yh_${this.TAG}_objectsindex_${this.objectsIndex}_pointsIndex_${obj.pointsIndex}`
          ).attr({
            "stroke-opacity": typeObj.opacity,
          });
        }
      }
    }
    this.handleEnd();
  }
  drawCurve(object, objectsIndex) {
    if (object.points.length === 0) return;
    const gDom = this.commonContorl
      .drawG(`yh_${this.TAG}_${objectsIndex}`, {
        objectsIndex: objectsIndex,
        type: "Curve",
      })
      .on("mousedown", this.mouseDown, this);
    for (let i = 0; i < object.points.length - 1; i++) {
      let points;
      // 这里数据的处理要多出一个点来链接后面的
      if (i < object.points.length - 1) {
        points = [object.points[i], object.points[i + 1]];
      } else {
        points = [object.points[i]];
      }
      this.drawPolyLine(gDom, handlePoints(points, this.publicData.scale), {
        id: `yh_${this.TAG}_objectsindex_${objectsIndex}_pointsIndex_${i}`,
        fill: object?.color
          ? this.colorObj[object?.color]
          : this.colorObj["--"],
        stroke: object?.color
          ? this.colorObj[object?.color]
          : this.colorObj["--"],
        objectsIndex: objectsIndex,
        pointsIndex: i,
        typeName: this.typeList[object.properties[i][0]].name,
        "stroke-opacity": this.typeList[object.properties[i][0]].opacity,
        "fill-opacity": 0,
      });
    }
    object.points.forEach((item, i) => {
      this.commonContorl.drawCircle(
        item,
        i,
        gDom,
        "Curve",
        this.circleDown,
        () => {},
        this,
        {
          objectsIndex: objectsIndex,
          pointsIndex: i,
          fill: i === 0 ? "block" : this.colorObj[object?.color || "--"],
          stroke:
            i === 0
              ? "rgba(248, 250, 247, 0.3)"
              : this.colorObj[object?.color || "--"],
          "stroke-width": i === 0 ? "10" : "",
          clientID: i,
        }
      );
    });
  }
  // edit: 车道线点击事件
  mouseDown(e) {
    if (this.addData.sign || this.addData.start) return;
    const objectsIndex = Number(e.target.getAttribute("objectsIndex"));
    if (objectsIndex != this.objectsIndex) {
      this.objectsIndex = objectsIndex;
      ObserverInstance.emit(dataEvents.GET_NOW_OBJECT_DATA, this.objectsIndex);
    }
    if (!this.editData.gDom) {
      this.editData.gDom = getDom(
        this.publicData.svgDom,
        `#yh_${this.TAG}_${this.objectsIndex}`
      );
    }
  }
  // add: 新建按钮被点击，更新数据
  addUpdate(data: { data: any; index: number }) {
    if (this.addData.sign) return;
    this.addData.sign = true;
    this.nowObject(data, "add");
  }
  // add：开始创建
  addCurve(x: number, y: number) {
    // console.log(x, y, "addCurve");
    if (!this.addData.sign) return;
    this.addData.drawPoints = [x, y];
    this.addData.data.points.push([x, y]);
    const cruve = store.getDrawBrushData;
    this.addData.data.properties.push(Object.values(cruve));
    if (!this.addData.start) {
      this.addData.start = true;
      this.addData.hoverGDom = this.commonContorl.drawG("yh_Curve_g_add");
    }
    this.addData.CurveDom = this.drawPolyLine(
      this.addData.gDom,
      [
        [x, y],
        [x, y],
      ],
      {
        id: `yh_${this.TAG}_objectsindex_${this.objectsIndex}_pointsIndex_${
          this.addData.data.points.length - 1
        }`,
        fill: this.colorObj[this.nowLineColor],
        stroke: this.colorObj[this.nowLineColor],
        objectsIndex: this.objectsIndex,
        pointsIndex: this.addData.data.points.length - 1,
        typeName: this.typeList[cruve[0]].name,
        "fill-opacity": 0,
        "stroke-opacity": this.typeList[cruve[0]].opacity,
      }
    );
    this.commonContorl.drawCircle(
      [x, y],
      this.addData.data.points.length - 1,
      this.addData.gDom,
      "Curve",
      this.circleDown,
      () => {},
      this,
      {
        objectsIndex: this.objectsIndex,
        pointsIndex: this.addData.data.points.length - 1,
        fill:
          this.addData.data.points.length - 1 === 0
            ? "block"
            : this.colorObj[this.nowLineColor],
        stroke:
          this.addData.data.points.length - 1 === 0
            ? "rgba(248, 250, 247, 0.3)"
            : this.colorObj[this.nowLineColor],
        "stroke-width": this.addData.data.points.length - 1 === 0 ? "10" : "",
        clientID: this.addData.data.points.length - 1,
      }
    );
  }
  // add：创建中移动
  addCurveing(x: number, y: number) {
    // console.log(x, y, "addCurveing");

    if (!this.addData.start) return;
    if (this.addData.CurveDom) {
      this.addData.CurveDom.attr({
        points: [this.addData.drawPoints, [x, y]],
      });
    }
  }
  // add：新建结束
  addEnd() {
    this.addData.hoverGDom.remove();
    this.addData.CurveDom.remove();
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      objectIndex: this.objectsIndex,
      sign: "Curve",
      data: this.addData.data,
    });
    this.init();
    this.addData = {
      sign: false,
      start: false,
      gDom: null,
      CurveDom: null,
      drawPoints: [],
      data: {
        points: [],
        properties: [],
      },
    };
  }
  // 创建结束:Done
  CurveEnd(val) {
    if (val !== "Curve") return;
    if (this.addData.sign && this.addData.start) {
      this.addEnd();
      return;
    }
    if (this.editData.insertSign) {
      this.insertEnd();
      return;
    }
  }
  // 获取当前实例对象数据
  nowObject(data: { index: number; data: any }, sign = "edit") {
    try {
      if (data.index < 0 || data.data?.objectType !== "Curve") return;
      if (data.index !== this.objectsIndex) {
        this.init();
      }
      this.objectsIndex = data.index;

      if (sign === "add") {
        this.addData.gDom =
          getDom(this.publicData.svgDom, `#yh_${this.TAG}_${data.index}`) ||
          this.commonContorl
            .drawG(`yh_${this.TAG}_` + data.index, {
              objectsIndex: data.index,
            })
            .on("mousedown", this.mouseDown, this);
      } else {
        this.editData.gDom = getDom(
          this.publicData.svgDom,
          "#yh_Curve_" + data.index
        );
        this.editData.data = deepClone(data.data);
        this.editData.drawPoints = new Array(
          this.editData.data.points.length
        ).fill({});
        this.judgeHover(this.editData.data);
      }
    } catch (err) {
      console.log(err, "err-nowObject");
    }
  }
  judgeHover(data) {
    try {
      getDom(this.publicData.svgDom, "#yh_g_hover")?.remove();
      this.editData.hoverGDom = this.commonContorl.drawG("yh_g_hover", {
        type: "laneline",
        objectsIndex: this.objectsIndex,
      });
      this.editData.drawPoints = deepClone(data.points);
      if (
        this.editData.pointsIndex >= 0 &&
        this.editData.drawPoints.length > 0
      ) {
        this.handleNowCircle(
          this.editData.drawPoints[this.editData.pointsIndex]
        );
      }
    } catch (err) {
      console.log(err, "err-judgeHover");
    }
  }
  // edit：circle点击事件
  circleDown(e) {
    if (this.editData.downSign) return;
    this.mouseDown(e);
    this.editData.circleDom = e.target;
    this.editData.downSign = true;
    this.commonContorl.circleData.downSign = true;
    const pointsIndex = Number(e.target.getAttribute("pointsIndex"));
    this.editData.pointsIndex = pointsIndex;
    this.handleNowCircle(this.editData.drawPoints[pointsIndex]);
    this.editData.moveXY = this.editData.drawPoints[pointsIndex];
    this.getNowCircleDOMs(pointsIndex);
    this.nowType = this.typeList[this.editData.data.properties[pointsIndex][0]];
    this.changeCircle("edit", {
      pointsIndex: pointsIndex,
      topSign: this.editData.data.properties[pointsIndex][1],
      brushName: this.nowType.name,
    });
  }
  circleUp() {
    try {
      this.editData.downSign = false;
      if (
        this.editData.moveXY[0] ===
          this.editData.drawPoints[this.editData.pointsIndex][0] &&
        this.editData.moveXY[1] ===
          this.editData.drawPoints[this.editData.pointsIndex][1]
      )
        return;
      for (let i = 0; i < this.editData.data.points.length; i++) {
        this.editData.data.points[i] = [...this.editData.drawPoints[i]];
      }
      this.handleEnd();
    } catch (err) {
      console.log(err, "err", this.TAG);
    }
  }
  handleEnd() {
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      objectIndex: this.objectsIndex,
      data: this.editData.data,
      sign: "Curve",
    });
  }
  // edit：获取当前circle前后两条线
  getNowCircleDOMs(pointsIndex: number) {
    if (!this.editData.gDom) {
      this.editData.gDom = getDom(
        this.publicData.svgDom,
        `#yh_${this.TAG}_${this.objectsIndex}`
      );
    }
    this.editData.lineBeforeDom = getDom(
      this.editData.gDom,
      `#yh_${this.TAG}_objectsindex_${this.objectsIndex}_pointsIndex_${
        pointsIndex - 1
      }`
    );
    this.editData.lineAfterDom = getDom(
      this.editData.gDom,
      `#yh_${this.TAG}_objectsindex_${this.objectsIndex}_pointsIndex_${pointsIndex}`
    );
  }
  // edit：高亮circle
  handleNowCircle(point: number[]) {
    const highDom = getDom(this.editData.hoverGDom, "#yh_g_circle_high_hover");
    if (highDom) {
      this.editData.downCircle = highDom;
      this.editData.downCircle.attr({
        cx: point[0],
        cy: point[1],
      });
    } else {
      this.editData.downCircle = this.editData.hoverGDom
        .circle(10)
        .attr({
          id: "yh_g_circle_high_hover",
          stroke: "rgba(255, 0, 0, 0.3)",
          fill: "rgba(255, 0, 0, 0.4)",
          "fill-opacity": "1",
          "stroke-width": "2",
          cx: point[0],
          cy: point[1],
        })
        .css({ cursor: "pointer", "pointer-events": "none" })
        .on("mousedown", () => {}, null);
    }
  }
  editMove(x: number, y: number) {
    if (this.editData.insertSign) {
      this.insertMove(x, y);
      return;
    }
    if (this.editData.downSign) {
      this.circleMove(x, y);
      return;
    }
  }
  // edit:移动点
  circleMove(x: number, y: number) {
    try {
      if (!this.editData.downSign || this.commonContorl.keyData !== "Control")
        return;
      this.editData.circleDom.setAttribute("cx", x);
      this.editData.circleDom.setAttribute("cy", y);
      // 高亮选择的点
      this.editData.downCircle.attr({
        cx: x,
        cy: y,
      });
      if (this.editData.pointsIndex === this.editData.data.points.length - 1) {
        this.editData.lineBeforeDom.attr({
          points: [
            [...this.editData.drawPoints[this.editData.pointsIndex - 1]],
            [x, y],
          ],
        });
      } else if (this.editData.pointsIndex === 0) {
        this.editData.lineAfterDom.attr({
          points: [
            [
              [x, y],
              [...this.editData.drawPoints[this.editData.pointsIndex + 1]],
            ],
          ],
        });
      } else {
        this.editData.lineAfterDom.attr({
          points: [
            [x, y],
            [...this.editData.drawPoints[this.editData.pointsIndex + 1]],
          ],
        });
        this.editData.lineBeforeDom.attr({
          points: [
            [...this.editData.drawPoints[this.editData.pointsIndex - 1]],
            [x, y],
          ],
        });
      }

      this.editData.drawPoints[this.editData.pointsIndex] = [x, y];
    } catch (err) {
      console.log(err, "editMove", this.TAG);
    }
  }
  // 更新当前选中的点的数据
  changeCircle(sign: string, circleObj) {
    ObserverInstance.emit(drawEvents.CURVE_CIRCLE_DATA, {
      objectIndex: this.objectsIndex,
      sign: sign,
      ...circleObj,
    });
  }
  // 绘制组成的小线条
  drawPolyLine(dom: any, points: number[][], attrObj: any) {
    return dom
      .polyline(points)
      .attr({
        "stroke-width": 1,
        "color-rendering": "optimizeQuality",
        "shape-rendering": "geometricprecision",
        ...attrObj,
      })
      .css({ cursor: "pointer" })
      .on("mousedown", this.mouseDown, this);
  }
  // 修改颜色
  changeColor(color) {
    console.log(color, "color----修改颜色");
    
    if (this.nowLineColor === color) return;
    this.nowLineColor = color;
    if (this.objectsIndex < 0) return;
    const DOM = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_${this.objectsIndex}`
    );
    if (!DOM) return;
    DOM.each((i, children) => {
      if (children[i].node.id !== `yh_g_circle_0`) {
        children[i].attr({
          stroke: this.colorObj[this.nowLineColor],
          fill: this.colorObj[this.nowLineColor],
        });
      }
    });
  }
  init() {
    this.editData = {
      ...this.editData,
      hoverGDom: null,
      gDom: null,
      lineBeforeDom: null,
      lineAfterDom: null,
      downCircle: null,
      pointsIndex: -1,
      drawPoints: [],
      moveXY: [],
      insertSign: false, // 插入标识
      insertBeforeDom: null,
      insertAfterDom: null,
      insertCircleDom: null,
    };
  }
  initAll() {
    console.log("laneline====================initAll");
    this.editData = {
      gDom: null,
      circleDom: null,
      hoverGDom: null,
      drawPoints: [],
      data: null,
      pointsIndex: -1,
      downSign: false,
      downCircle: null,
      lineBeforeDom: null,
      lineAfterDom: null,
      moveXY: [],
      insertSign: false, // 插入标识
      insertBeforeDom: null,
      insertAfterDom: null,
      insertCircleDom: null,
    };
    this.addData = {
      sign: false,
      start: false,
      gDom: null,
      hoverGDom: null,
      CurveDom: null,
      drawPoints: [],
      data: {
        points: [],
        properties: [],
      },
    };
    this.objectsIndex = -1;
    this.nowLineColor = "--";
  }
}
export default curveContorl;
