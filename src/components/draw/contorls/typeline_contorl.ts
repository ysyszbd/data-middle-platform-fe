import { ObserverInstance } from "@/components/draw/event/observer";
import { dataEvents, drawEvents } from "@/components/draw/event/events";
import { getDom, deepClone, handlePoints, clearOneDom } from "@/utils/util";
import { useStateStore } from "@/stores/state";
const store = useStateStore();
let x0, y0, y1, x1;

class typeLineContorl {
  observerListenerList = [
    {
      eventName: dataEvents.SEND_NOW_OBJECT_DATA,
      fn: this.nowObjectTypeline.bind(this),
    },
    { eventName: drawEvents.TYPELINW_CIRCLE_UP, fn: this.circleUP.bind(this) },
    {
      eventName: drawEvents.TYPELINE_DELETE_CIRCLE,
      fn: this.delCircle.bind(this),
    },
    {
      eventName: drawEvents.TYPELINE_INSERT_CIRCLE,
      fn: this.insertCircle.bind(this),
    },
    {
      eventName: drawEvents.TYPELINE_CHANGE_CIRCLE_TYPE,
      fn: this.addChangeType.bind(this),
    },
    { eventName: drawEvents.ADD_NEW_END, fn: this.typelineEnd.bind(this) },
    { eventName: drawEvents.TYPELINE_NO_X, fn: this.changeX.bind(this) },
  ];
  publicData: { svgDom: any; scale: number } = {
    svgDom: null,
    scale: 1,
  };
  commonContorl: any;
  editData: any = {
    pointsIndex: -1,
    data: {
      points: [],
      type: [],
      covered: [],
    }, // 原始数据：points、pointsType、type
    drawPoints: [], // 渲染的坐标点 仅points比例计算后数据
    hoverGDom: null,
    downSign: false, // 按下一个circle标识
    moveXY: [-1, -1], // x和y移动的距离
    circlesDom: [], // hover状态下所有的circle元素dom
    circleDom: null, // 当前选择的circle的dom元素
    lineGDom: null, // polyline所在的g元素dom
    lineBeforeDom: null, // 当前circle的前一条线
    lineAfterDom: null, // 当前circle的后一条线，当circle为最后一个点时该值为空
    downCircle: null, // 当前circle的高亮dom
    // 插入数据
    insertSign: false, // 是否处于插入状态
    insertBeforeDom: null,
    insertAfterDom: null,
    // 延长，插入公共数据
    handlePoint: [], // 当前操作的点坐标
    handleCircleDom: null, // 当前操作的circle元素dom
    // 延长数据
    extendSign: false, // 是否处于延长状态
    extendLineDom: null,
    extendType: [],
    extendCovered: [],
  };
  addData: any = {
    sign: false, // 是否点击新建标识
    start: false, // 是否开始新建标识
    drawPoints: [], // 绘制polyline的数据
    type: [],
    covered: [],
    gDom: null, // 绘制的polyline和circle所处的g元素
    typeLineDom: null, // 当前polyline元素dom
    moveCircleDom: null, // 当前跟随鼠标移动的circle元素dom
    circlesGDom: null,
  };
  nowType: { color: string; type: string; covered: number } = {
    type: "",
    covered: 0,
    color: "",
  }; // 当前操作的type类型
  objectIndex = -1;
  colorList = [];
  xLimit = {
    // x轴限制数据
    sign: true,
    x: 0,
  };

  constructor(
    publicData: { svgDom: any; scale: number },
    commonContorl: any,
    colorList
  ) {
    this.addListenerList();
    this.publicData = publicData;
    this.commonContorl = commonContorl;
    this.colorList = colorList;
  }
  // 解除事件监听
  offListenerList() {
    ObserverInstance.selfOffListenerList(
      this.observerListenerList,
      "yh_svg_typeLine"
    );
  }
  // 添加事件监听
  addListenerList() {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_typeLine"
    );
  }

  changeX(sign: boolean) {
    this.xLimit.sign = sign;
    if (this.editData.extendSign) {
      this.xLimit.x = this.editData.drawPoints[this.editData.pointsIndex][0];
    }
    if (this.addData.start) {
      this.xLimit.x =
        this.addData.drawPoints[this.addData.drawPoints.length - 1][0];
    }
  }
  // 修改点类型
  addChangeType(val) {
    console.log(val, "val");

    // console.log({...this.nowType},'this.nowType');
    this.nowType = {
      ...this.nowType,
      ...val,
    };
    if (this.editData.extendSign) {
      this.editData.handleCircleDom.attr({
        fill: this.nowType.color,
        stroke: this.nowType.color,
      });
      return;
    }
    if (this.editData.insertSign) {
      this.editData.insertAfterDom.attr({
        fill: this.nowType.color,
        stroke: this.nowType.color,
      });
      this.editData.handleCircleDom.attr({
        fill: this.nowType.color,
        stroke: this.nowType.color,
      });
      return;
    }
    if (
      !this.editData.insertSign &&
      !this.editData.extendSign &&
      !this.addData.sign
    ) {
      this.editData.data.type[this.editData.pointsIndex] = this.nowType.type;
      this.editData.data.covered[this.editData.pointsIndex] =
        this.nowType.covered;
      this.editEnd();
    }
  }
  addUpdate(data: { data: any; index: number }) {
    if (this.addData.sign) return;
    this.addData.sign = true;
    this.xLimit.x = 0;
    this.nowObjectTypeline(data, "add");
  }
  // add:
  addTypeline(x: number, y: number) {
    if (!this.addData.sign) return;
    // 第一个点
    if (!this.addData.start) {
      this.addData.start = true;
      this.nowType = store.getDrawTLBrushData;
    }

    if (this.xLimit.sign && x < this.xLimit.x) {
      x = this.xLimit.x;
    }

    this.addData.drawPoints.push([x, y]);
    this.addData.type.push(store.getDrawTLBrushData.type);
    this.addData.covered.push(store.getDrawTLBrushData.covered);
    this.commonContorl.drawCircle(
      [x, y],
      this.addData.drawPoints.length - 1,
      this.addData.gDom,
      "typeLine",
      this.circleDown,
      () => {},
      this,
      {
        objectsIndex: this.objectIndex,
        pointsIndex: this.addData.drawPoints.length - 1,
        fill:
          this.addData.drawPoints.length - 1 === 0
            ? "block"
            : this.findColor(
                this.colorList,
                this.addData.type[this.addData.drawPoints.length - 1]
              ).color,
        stroke:
          this.addData.drawPoints.length - 1 === 0
            ? "rgba(248, 250, 247, 0.3)"
            : "",
        "stroke-width": this.addData.drawPoints.length - 1 === 0 ? "10" : "",
        clientID: this.addData.drawPoints.length - 1,
      },
      this.circleOver
    );
    this.addData.typeLineDom = this.drawPolyLine(
      this.addData.gDom,
      [
        [x, y],
        [x, y],
      ],
      this.objectIndex,
      store.getDrawTLBrushData,
      this.addData.drawPoints.length - 1
    );
    if (this.xLimit.sign) {
      this.xLimit.x = x;
    }

    this.changeCircle("add", {
      pointsIndex: this.addData.drawPoints.length - 1,
      ...store.getDrawTLBrushData,
    });
  }
  addMove(x: number, y: number) {
    if (!this.addData.sign || !this.addData.start) return;
    if (this.xLimit.sign && x < this.xLimit.x) {
      x = this.xLimit.x;
    }
    this.addData.typeLineDom.attr({
      points: [
        [this.addData.drawPoints[this.addData.drawPoints.length - 1]],
        [x, y],
      ],
    });
  }
  // 创建结束
  addEnd() {
    this.addData.typeLineDom.remove();
    const data = new Array(this.addData.drawPoints.length).fill([]);
    this.addData.drawPoints.forEach((ele, i) => {
      data[i] = ele;
    });
    clearOneDom("yh_g_typeline_add");
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      objectIndex: this.objectIndex,
      sign: "typeLine",
      data: {
        points: data,
        type: this.addData.type,
        covered: this.addData.covered,
      },
    });
    this.addData = {
      sign: false, // 是否点击新建标识
      start: false, // 是否开始新建标识
      drawPoints: [], // 绘制polyline的数据
      type: [],
      covered: [],
      nowType: {}, // 当前类型
      gDom: null, // 绘制的polyline和circle所处的g元素
      typeLineDom: null, // 当前polyline元素dom
      moveCircleDom: null, // 当前跟随鼠标移动的circle元素dom
      circlesGDom: null,
    };

    this.changeCircle("edit", { pointsIndex: -1, type: "", covered: -1 });
  }

  typelineEnd(val) {
    if (val !== "typeLine") return;
    if (this.addData.sign && this.addData.start) {
      this.addEnd();
      return;
    }
    if (this.editData.extendSign) {
      this.extendEnd();
      return;
    }
    if (this.editData.insertSign) {
      this.insertEnd();
      return;
    }
  }

  handleLines(object: any, objectIndex: number) {
    if (object.points.length === 0) return;
    const gDom = this.drawGpolyline(
      this.publicData.svgDom,
      "yh_typeLine_g_" + objectIndex,
      { objectIndex: objectIndex }
    );
    for (let i = 0; i < object.points.length - 1; i++) {
      let points;
      // 这里数据的处理要多出一个点来链接后面的
      if (i < object.points.length - 1) {
        points = [object.points[i], object.points[i + 1]];
      } else {
        points = [object.points[i]];
      }
      const drawPoints = handlePoints(points, this.publicData.scale);
      this.drawPolyLine(
        gDom,
        drawPoints,
        objectIndex,
        this.findColor(this.colorList, object.type[i]),
        i
      );
    }
    object.points.forEach((item, i) => {
      this.commonContorl.drawCircle(
        item,
        i,
        gDom,
        "typeLine",
        this.circleDown,
        () => {},
        this,
        {
          objectsIndex: objectIndex,
          pointsIndex: i,
          fill:
            i === 0
              ? "block"
              : this.findColor(this.colorList, object.type[i]).color,
          stroke: i === 0 ? "rgba(248, 250, 247, 0.3)" : "",
          "stroke-width": i === 0 ? "10" : "",
          clientID: i,
        },
        this.circleOver
      );
    });
  }
  drawGpolyline(dom, idName: string, attrObj) {
    return dom.group().attr({
      id: idName,
      type: "typeLine",
      ...attrObj,
    });
  }
  drawPolyLine(
    dom: any,
    points: number[][],
    objectsIndex: number,
    type,
    pointsIndex: number,
    attrObj: any = {}
  ) {
    return dom
      .polyline(points)
      .attr({
        fill: type.color,
        "fill-opacity": 0,
        stroke: type.color,
        "stroke-width": 1,
        "color-rendering": "optimizeQuality",
        "shape-rendering": "geometricprecision",
        id: "yh_typeline_index_" + objectsIndex + "_shapesIndex_" + pointsIndex,
        objectsIndex: objectsIndex,
        pointsIndex: pointsIndex,
        typeName: type.name,
        class: "yh_typeline_index_" + objectsIndex,
        ...attrObj,
      })
      .css({ cursor: "pointer" })
      .on("mousedown", this.mouseDown, this);
  }
  mouseDown(e) {
    if (this.addData.sign || this.addData.start) return;
    if (!this.editData.lineGDom) {
      this.editData.lineGDom = getDom(
        this.publicData.svgDom,
        "#yh_typeLine_g_" + this.objectIndex
      );
    }
    const objectIndex = Number(e.target.getAttribute("objectsIndex"));
    if (objectIndex != this.objectIndex) {
      this.objectIndex = objectIndex;
      // 根据当前的polygon对应的object下标，发送获取数据信号
      ObserverInstance.emit(dataEvents.GET_NOW_OBJECT_DATA, this.objectIndex);
    }
  }
  nowObjectTypeline(data: { data: any; index: number }, sign = "edit") {
    try {
      // console.log(data, "data----", sign);
      if (data.index < 0 || data.data?.objectType !== "typeLine") return;
      if (data.index !== this.objectIndex) {
        this.init();
        this.editData.pointsIndex = -1;
        this.objectIndex = -1;
        this.xLimit.x = -1;
      }

      this.objectIndex = data.index;
      if (sign === "add") {
        this.addData.gDom =
          getDom(this.publicData.svgDom, "#yh_typeLine_" + data.index) ||
          this.drawGpolyline(
            this.publicData.svgDom,
            "yh_typeLine_g_" + data.index,
            { objectIndex: data.index }
          );
      } else {
        this.editData.lineGDom = getDom(
          this.publicData.svgDom,
          "#yh_typeLine_g_" + data.index
        );
        this.editData.data = deepClone(data.data);
        this.editData.drawPoints = new Array(
          this.editData.data.points.length
        ).fill({});
        this.editData.circlesDom = new Array(
          this.editData.data.points.length
        ).fill({});
        this.judgeHover(this.editData.data);
      }
    } catch (err) {
      console.log(err, "err-nowObjectTypeline");
    }
  }
  judgeHover(data) {
    try {
      this.removeG();
      this.editData.hoverGDom = this.commonContorl.drawG();
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

  // 用来提前获取circle的dom元素，尽可能避免卡顿
  circleOver(e) {
    e.stopPropagation();
    if (this.editData.downSign) return;
    this.editData.circleDom = e.target;
    this.editData.downCircle = getDom(
      this.editData.hoverGDom,
      "#yh_g_circle_high_hover"
    );
  }
  circleDown(e) {
    if (this.editData.downSign) return;
    this.mouseDown(e);
    this.editData.downSign = true;
    this.commonContorl.circleData.downSign = true;
    this.editData.circleDom = e.target;
    const pointsIndex = Number(e.target.getAttribute("pointsIndex"));
    this.editData.pointsIndex = pointsIndex;
    if (pointsIndex >= 0 && this.editData.drawPoints.length > 0) {
      this.handleNowCircle(this.editData.drawPoints[pointsIndex]);
    }
    if (pointsIndex === 0) {
      this.xLimit.x = -1;
    } else {
      this.xLimit.x = this.editData.drawPoints[pointsIndex - 1][0];
    }
    this.handleNowCircle(this.editData.drawPoints[pointsIndex]);
    this.getNowCircleDOMs(pointsIndex);

    this.editData.moveXY = this.editData.drawPoints[pointsIndex];

    this.nowType = {
      type: this.editData.data.type[this.editData.pointsIndex],
      covered: this.editData.data.covered[this.editData.pointsIndex],
      color: this.findColor(
        this.colorList,
        this.editData.data.type[this.editData.pointsIndex]
      ),
    };
    this.changeCircle("edit", {
      pointsIndex: this.editData.pointsIndex,
      type: this.editData.data.type[this.editData.pointsIndex],
      covered: this.editData.data.covered[this.editData.pointsIndex],
    });
  }
  // 获取当前circle移动所需dom元素
  getNowCircleDOMs(pointsIndex: number) {
    if (!this.editData.lineGDom) {
      this.editData.lineGDom = getDom(
        this.publicData.svgDom,
        "#yh_typeLine_g_" + this.objectIndex
      );
    }
    // 获取该点要更新的polyline的dom元素--前后
    this.editData.lineBeforeDom = document.getElementById(
      "yh_typeline_index_" +
        this.objectIndex +
        "_shapesIndex_" +
        (pointsIndex - 1)
    );

    this.editData.lineAfterDom = document.getElementById(
      "yh_typeline_index_" + this.objectIndex + "_shapesIndex_" + pointsIndex
    );
  }
  // 对当前选中的circle进行高亮显示
  handleNowCircle(point: number[]) {
    console.log(this, "this", point);
    // const gDom = getDom(this.publicData.svgDom, "#yh_g_hover");
    this.removeG();
    this.editData.hoverGDom = this.commonContorl.drawG();
    const downCircle = getDom(
      this.editData.hoverGDom,
      `#yh_g_circle_high_hover`
    );
    this.editData.downCircle = downCircle;
    if (this.editData.downCircle) {
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
  circleUP() {
    try {
      this.editData.downSign = false;
      this.commonContorl.circleData.downSign = false;

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
      this.editEnd();
    } catch (err) {
      console.log(this, "this");
      console.log(err, "err--circleUP");
    }
  }
  // 删除点--区分add和edit状态
  delCircle(val) {
    if (this.addData.sign && this.addData.start) return;
    this.editData.drawPoints.splice(val.pointsIndex, 1);
    this.editData.data.points.splice(val.pointsIndex, 1);
    this.editData.data.type.splice(val.pointsIndex, 1);
    this.editData.data.covered.splice(val.pointsIndex, 1);
    this.updataData();
    this.editData.downCircle?.remove();
    this.editData.downCircle = null;
    store.setDrawDomRefresh(1);
    this.editEnd();
    ObserverInstance.emit(drawEvents.TYPELINE_DELETE_CIRCLE_OVER);
  }
  // edit:更新数据
  updataData() {
    this.editData.lineBeforeDom = null;
    this.editData.lineAfterDom = null;
    this.editData.pointsIndex = -1;
  }

  //edit: 按住一个circle的移动事件
  circleMove(x: number, y: number) {
    if (!this.editData.downSign || this.commonContorl.keyData !== "Control")
      return;
    if (this.xLimit.sign && this.editData.pointsIndex !== 0) {
      if (x < this.xLimit.x) {
        x = this.xLimit.x;
      }
    }
    this.editData.circleDom.setAttribute("cx", x);
    this.editData.circleDom.setAttribute("cy", y);

    // 高亮选择的点
    this.editData.downCircle.attr({
      cx: x,
      cy: y,
    });
    if (this.editData.pointsIndex === this.editData.data.points.length - 1) {
      this.editData.lineBeforeDom.setAttribute("points", [
        [...this.editData.drawPoints[this.editData.pointsIndex - 1]],
        [x, y],
      ]);
    } else if (this.editData.pointsIndex === 0) {
      this.editData.lineAfterDom.setAttribute("points", [
        [[x, y], ...this.editData.drawPoints[this.editData.pointsIndex + 1]],
      ]);
    } else {
      this.editData.lineAfterDom.setAttribute("points", [
        [x, y],
        [...this.editData.drawPoints[this.editData.pointsIndex + 1]],
      ]);
      this.editData.lineBeforeDom.setAttribute("points", [
        [...this.editData.drawPoints[this.editData.pointsIndex - 1]],
        [x, y],
      ]);
    }

    this.editData.drawPoints[this.editData.pointsIndex] = [x, y];
  }
  // edit：插入点--editsign插入状态=true，该点随着鼠标移动，最后点击后确定下来位置
  insertCircle(val) {
    let x, y;
    const pointsIndex = this.editData.pointsIndex;
    this.nowType = this.findColor(
      this.colorList,
      this.editData.data.type[pointsIndex]
    );
    this.xLimit.x = this.editData.drawPoints[pointsIndex][0];
    console.log(val, "===========");

    // 最后一个点--延长操作
    if (val === "延长线") {
      if (this.editData.extendSign) return;
      this.editData.extendSign = true;
      x = this.editData.drawPoints[pointsIndex][0] + 50;
      y = this.editData.drawPoints[pointsIndex][1] + 50;
      // 绘制的最后一段polyline
      this.editData.extendLineDom = this.drawPolyLine(
        this.editData.lineGDom,
        [this.editData.drawPoints[pointsIndex], [x, y]],
        this.objectIndex,
        store.getDrawTLBrushData,
        pointsIndex,
        { id: "yh_typeline_extend" }
      );
      // 绘制最后一个点circle
      this.editData.handleCircleDom = this.commonContorl.drawCircle(
        [x, y],
        pointsIndex + 1,
        this.editData.hoverGDom,
        "yh_typeline_extend_circle",
        () => {},
        () => {},
        this,
        {
          fill: store.getDrawTLBrushData.color,
          stroke: store.getDrawTLBrushData.color,
        }
      );
      this.changeCircle("edit", {
        pointsIndex: this.editData.pointsIndex,
        ...store.getDrawTLBrushData,
      });
    } else {
      if (this.editData.insertSign) return;
      this.editData.insertSign = true;
      this.editData.handleCircleDom = this.commonContorl.drawCircle(
        this.editData.drawPoints[pointsIndex],
        0,
        this.editData.hoverGDom,
        "yh_typeline_insert_circle",
        () => {},
        () => {},
        this,
        { fill: this.nowType.color, stroke: this.nowType.color }
      );
      console.log(
        this,
        "this-----------",
        this.editData.drawPoints[pointsIndex]
      );

      this.editData.insertBeforeDom = getDom(
        this.editData.lineGDom,
        "#yh_typeline_index_" + this.objectIndex + "_shapesIndex_" + pointsIndex
      ).attr({
        points: [
          this.editData.drawPoints[pointsIndex],
          this.editData.drawPoints[pointsIndex],
        ],
      });
      this.editData.insertAfterDom = this.drawPolyLine(
        this.editData.lineGDom,
        [
          this.editData.drawPoints[pointsIndex],
          [...this.editData.drawPoints[pointsIndex + 1]],
        ],
        this.objectIndex,
        this.nowType,
        pointsIndex + 1,
        {
          id: "yh_typeline_insert",
        }
      );
    }
    this.editData.downCircle.attr({
      cx: this.editData.drawPoints[pointsIndex][0],
      cy: this.editData.drawPoints[pointsIndex][1],
    });
    this.free();
  }
  // edit: 插入一个点的移动事件
  insertMove(x: number, y: number) {
    if (!this.editData.insertSign) return;
    try {
      // console.log(this, "this=====insertMove");

      if (this.xLimit.sign && x < this.xLimit.x) {
        x = this.xLimit.x;
      }
      this.editData.downCircle.attr({
        cx: x,
        cy: y,
      });
      this.editData.handleCircleDom.attr({
        cx: x,
        cy: y,
      });
      this.editData.handlePoint = [x, y];
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
    } catch (err) {
      console.log(err, "err--insertMove");
    }
  }
  insertDown(x: number, y: number) {
    // console.log(x, y, "----");

    this.editData.drawPoints.splice(
      this.editData.pointsIndex + 1,
      0,
      this.editData.handlePoint
    );
    this.editData.data.points.splice(this.editData.pointsIndex + 1, 0, [
      ...this.editData.handlePoint,
    ]);

    this.editData.data.type.splice(
      this.editData.pointsIndex + 1,
      0,
      this.nowType.type
    );
    this.editData.data.covered.splice(
      this.editData.pointsIndex + 1,
      0,
      this.nowType.covered
    );
    this.editData.pointsIndex = this.editData.pointsIndex + 1;
    const insert_points = [
      this.editData.drawPoints[this.editData.pointsIndex],
      this.editData.drawPoints[this.editData.pointsIndex],
    ];
    this.editData.insertBeforeDom.attr({
      points: [
        this.editData.drawPoints[this.editData.pointsIndex - 1],
        this.editData.drawPoints[this.editData.pointsIndex],
      ],
    });
    this.editData.insertBeforeDom = this.drawPolyLine(
      this.editData.lineGDom,
      insert_points,
      this.objectIndex,
      this.nowType,
      this.editData.pointsIndex + 1,
      {
        id: "yh_typeline_insert_before",
      }
    );
    this.editData.handleCircleDom = this.commonContorl.drawCircle(
      this.editData.drawPoints[this.editData.pointsIndex],
      0,
      this.editData.hoverGDom,
      "yh_typeline_insert_circle",
      () => {},
      () => {},
      this,
      { fill: this.nowType.color, stroke: this.nowType.color }
    );
    if (this.xLimit.sign) {
      this.xLimit.x = this.editData.handlePoint[0];
    }
    this.changeCircle("edit", {
      pointsIndex: this.editData.pointsIndex,
      type: this.editData.data.type[this.editData.pointsIndex],
      covered: this.editData.data.covered[this.editData.pointsIndex],
    });
  }
  insertEnd() {
    this.editData.insertSign = false;
    store.setDrawDomRefresh(1);
    this.editEnd();

    this.editData = {
      ...this.editData,
      insertSign: false, // 是否处于插入状态
      insertPoint: [], // 当前插入的点坐标
      insertBeforeDom: null,
      insertAfterDom: null,
      handleCircleDom: null,
    };
  }
  extendLineMove(x: number, y: number) {
    if (!this.editData.extendSign) return;
    if (this.xLimit.sign && x < this.xLimit.x) {
      x = this.xLimit.x;
    }
    this.editData.handleCircleDom.attr({ cx: x, cy: y });
    this.editData.extendLineDom.attr({
      points: [this.editData.drawPoints[this.editData.pointsIndex], [x, y]],
    });
    this.editData.downCircle.attr({ cx: x, cy: y });
    this.editData.handlePoint = [x, y];
  }
  // edit:延长线--前提条件是选中的是最后一个点
  extandLineDown() {
    this.editData.drawPoints.push(this.editData.handlePoint);
    this.editData.pointsIndex = this.editData.pointsIndex + 1;
    if (this.xLimit.sign) {
      this.xLimit.x = this.editData.drawPoints[this.editData.pointsIndex][0];
    }
    this.editData.extendType.push(store.getDrawTLBrushData.type);
    this.editData.extendCovered.push(store.getDrawTLBrushData.covered);
    this.editData.extendLineDom = this.editData.extendLineDom =
      this.drawPolyLine(
        this.editData.lineGDom,
        [
          this.editData.drawPoints[this.editData.pointsIndex],
          this.editData.handlePoint,
        ],
        this.objectIndex,
        store.getDrawTLBrushData,
        this.editData.pointsIndex,
        { id: "yh_typeline_extend" }
      );
    this.editData.handleCircleDom = this.commonContorl.drawCircle(
      this.editData.handlePoint,
      this.editData.pointsIndex,
      this.editData.hoverGDom,
      "yh_typeline_extend_circle",
      () => {},
      () => {},
      this,
      {
        fill: store.getDrawTLBrushData.color,
        stroke: store.getDrawTLBrushData.color,
      }
    );
    this.changeCircle("edit", {
      pointsIndex: this.editData.pointsIndex,
      ...store.getDrawTLBrushData,
    });
  }
  extendEnd() {
    for (
      let i = this.editData.data.points.length;
      i < this.editData.drawPoints.length;
      i++
    ) {
      this.editData.data.points.push([...this.editData.drawPoints[i]]);
    }
    this.editData.data.type = this.editData.data.type.concat(
      this.editData.extendType
    );
    this.editData.data.covered = this.editData.data.covered.concat(
      this.editData.extendCovered
    );
    this.editEnd();
    this.changeCircle("edit", {
      pointsIndex: this.editData.pointsIndex,
      ...this.nowType,
    });
    store.setDrawDomRefresh(1);
    this.editData.downCircle.remove();
    this.editData = {
      ...this.editData,
      extendSign: false, // 是否处于延长状态
      extendLineDom: null,
      extendPoint: [],
      extendType: [],
      extendCovered: [],
      downCircle: null,
      handleCircleDom: null,
    };
  }
  editDown(x: number, y: number) {
    if (this.editData.insertSign) {
      this.insertDown(x, y);
      return;
    }
    if (this.editData.extendSign) {
      this.extandLineDown();
      return;
    }
  }
  editMove(x: number, y: number) {
    if (this.editData.insertSign) {
      this.insertMove(x, y);
      return;
    }
    if (this.editData.extendSign) {
      this.extendLineMove(x, y);
      return;
    }
    if (this.editData.downSign) {
      this.circleMove(x, y);
      return;
    }
  }

  // 更新edit状态下的数据
  editEnd() {
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      objectIndex: this.objectIndex,
      data: this.editData.data,
      sign: "typeLine",
    });
  }
  // 更新 当前circle数据
  changeCircle(sign: string, circleObj) {
    ObserverInstance.emit(drawEvents.TYPELINE_NOW_CIRCLE_DATA, {
      objectIndex: this.objectIndex,
      sign: sign,
      ...circleObj,
    });
  }
  findColor(typesArr, obj) {
    const colorObj = typesArr.filter((item) => {
      return item.type == obj;
    })[0];
    return colorObj ? colorObj : { color: "white" };
  }

  init() {
    this.removeG();
    this.editData = {
      ...this.editData,
      hoverGDom: null,
      lineGDom: null,
      lineBeforeDom: null,
      lineAfterDom: null,
      downCircle: null,
      circleDom: null,
    };
  }
  removeG() {
    getDom(this.publicData.svgDom, "#yh_g_hover")?.remove();
  }
  free() {
    x0 = null;
    y0 = null;
    x1 = null;
    y1 = null;
  }
  initAll() {
    this.editData = {
      pointsIndex: -1,
      data: {
        points: [],
        type: [],
        covered: [],
      }, // 原始数据：points、pointsType、type
      drawPoints: [], // 渲染的坐标点 仅points比例计算后数据
      hoverGDom: null,
      downSign: false, // 按下一个circle标识
      moveXY: [-1, -1], // x和y移动的距离
      circlesDom: [], // hover状态下所有的circle元素dom
      circleDom: null, // 当前选择的circle的dom元素
      lineGDom: null, // polyline所在的g元素dom
      lineBeforeDom: null, // 当前circle的前一条线
      lineAfterDom: null, // 当前circle的后一条线，当circle为最后一个点时该值为空
      downCircle: null, // 当前circle的高亮dom
      // 插入数据
      insertSign: false, // 是否处于插入状态
      insertBeforeDom: null,
      insertAfterDom: null,
      // 延长，插入公共数据
      handlePoint: [], // 当前操作的点坐标
      handleCircleDom: null, // 当前操作的circle元素dom
      // 延长数据
      extendSign: false, // 是否处于延长状态
      extendLineDom: null,
      extendType: [],
      extendCovered: [],
    };
    this.addData = {
      sign: false, // 是否点击新建标识
      start: false, // 是否开始新建标识
      drawPoints: [], // 绘制polyline的数据
      type: [],
      covered: [],
      gDom: null, // 绘制的polyline和circle所处的g元素
      typeLineDom: null, // 当前polyline元素dom
      moveCircleDom: null, // 当前跟随鼠标移动的circle元素dom
      circlesGDom: null,
    };
    this.nowType = {
      type: "",
      covered: 0,
      color: "",
    };
    this.objectIndex = -1;
    this.xLimit = {
      // x轴限制数据
      sign: true,
      x: 0,
    };
  }
}
export default typeLineContorl;
