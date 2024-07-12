/*
 * @Author: yinshunyu
 * @Date: 2022-11-28 15:32:54
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-01 14:53:40
 * @FilePath: \DataClient\src\components\draw\contorls\mark3D_contorl.ts
 * @Description:
 *
 */
import { ObserverInstance } from "@/components/draw/event/observer";
import { dataEvents, drawEvents } from "@/components/draw/event/events";
import { getTypeIndex, getDom, deepClone } from "@/utils/util";
import { useStateStore } from "@/stores/state";
const store = useStateStore();

class mark3D_contorl {
  private publicData: { svgDom: any; scale: number } = {
    svgDom: null,
    scale: 1,
  };

  public editPolygonData: any = {
    objectIndex: null, // 当前操作的polygon对应的objects中的下标
    data: null, // 原始数据
    drawData: null, // 渲染数据
    direction: 0, // 方向--用来区分颜色
    gDom: null, // 包含polygon的g标签
    oneDom: null, // 对应数据为drawdata中0-4
    twoDom: null, // 对应数据为drawdata中2-5
    hoverGDom: null,
    hoverCircles: [],
    hoverCircleIndex: 0, // hover当前选择的circle下标--对应了drawData下标
    hoverCircleDom: null, // 当前选择的circle的dom元素
    guideDom03: null,
    guideDom12: null,
    guideDom34: null,
    guideDom25: null,
    guidePoint: [],
    guidePointTwo: [],
    guidePoint12: [],
    rightW: 0,
  };
  public addData: any = {
    sign: false,
    start: false,
    index: 0,
    maxSize: 4, // 最多有几个坐标，4 or 6
    gDom: null, // 新增的g元素
    oneDom: null,
    twoDom: null,
    oneData: [],
    twoData: [],
    drawPoints: [],
    lineDom: null,
  };
  handleType = "edit";
  shapesIndex = 1; // shapes中对应类型的下标
  // 当前选中的数据
  public nowObjectData: any = {
    data: {},
    index: -1,
  };
  // polygon颜色--根据direction进行区分
  public colorN = [
    ["blue"],
    ["blue", "green"],
    ["green"],
    ["green", "red"],
    ["red"],
    ["red", "white"],
    ["white"],
    ["white", "blue"],
  ];
  // 原始数据 和 draw数据 的 2与3调换位置
  drawIndexChangeArr = [0, 1, 3, 2, 4, 5];
  // 控制选中对象状态的g标签和circles标签
  commonContorl: any = null;
  observerListenerList = [
    {
      eventName: drawEvents.POLYGON_3D_CIRCLE_UP,
      fn: this.circleUp.bind(this),
    },
    {
      eventName: dataEvents.SEND_NOW_OBJECT_DATA,
      fn: this.nowObject.bind(this),
    },
    {
      eventName: drawEvents.POLYGON_3D_CHANGR_DIRECTION,
      fn: this.changeDirection.bind(this),
    },
    {
      eventName: drawEvents.POLYGON_3D_ALIGNMENT,
      fn: this.alignmentFun.bind(this),
    },
  ];

  constructor(publicData: { svgDom: any; scale: number }, commonContorl: any) {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_typeLine"
    );
    this.publicData = publicData;
    this.commonContorl = commonContorl;
    const rect: any = document
      .getElementById("big_SVG")
      ?.getBoundingClientRect();
    this.editPolygonData.rightW =
      rect?.width - publicData.svgDom.node.clientWidth * 1.3;
  }

  // 获取当前操作的object数据
  public async nowObject(data: { data: any; index: number }, sign = "edit") {
    let Box3d = null;
    if (data.data?.shapes) {
      Box3d = data.data?.shapes.find((item) => {
        return item.type === "Box3d";
      });
    }
    if (data.index === -1 || !data.data?.shapes || Box3d === undefined) return;
    console.log(data, "data--ed---3d");
    this.shapesIndex = getTypeIndex(data.data.shapes, "Box3d");

    if (this.shapesIndex < 0) return;
    this.nowObjectData = deepClone(data);

    this.handleType = sign;

    if (sign === "add") {
      let maxSize = 4;
      this.nowObjectData.data.direction % 2 == 0
        ? (maxSize = 4)
        : (maxSize = 6);

      this.addData.maxSize = maxSize;
      this.addData.drawPoints = new Array(maxSize).fill([]);
      this.addData.oneData = this.addData.drawPoints.slice(0, 4);
      this.addData.twoData = this.addData.drawPoints.slice(2);
    } else {
      this.editPolygonData.data = deepClone(
        data.data.shapes[this.shapesIndex].points
      );
      this.editPolygonData.drawData = await this.handlePoints(
        this.editPolygonData.data
      );
      this.editPolygonData.direction = data.data.direction;
      this.getObjectDom(this.nowObjectData);
    }
  }
  // add: 用户点击新建按钮
  public addUpdate(data: { data: any; index: number }) {
    if (this.addData.sign) return;
    this.addData.sign = true;
    ObserverInstance.emit(drawEvents.POLYGON_3D_STATUS_ADD, true);
    this.nowObject(data, "add");
  }
  // add: 开始创建3d
  public add3D(x: number, y: number) {
    if (this.handleType !== "add") return;
    if (this.addData.index === 0) {
      this.addData.start = true;
      this.addData.gDom = this.drawGpolygon(this.nowObjectData.index);
      this.addData.drawPoints[0] = [x, y];
      this.addData.oneDom = this.drawPolygon(
        this.addData.oneData,
        this.nowObjectData.index,
        this.addData.gDom,
        this.colorN[this.nowObjectData.data.direction][0],
        "one"
      );
      this.addData.index = 1;

      return;
    }
    if (this.addData.index === 1) {
      this.addData.drawPoints[1] = [this.addData.drawPoints[0][0], y];
      this.addData.oneDom.attr({
        points: this.addData.drawPoints,
      });
      this.addData.index = 2;
      return;
    }
    if (this.addData.index === 2) {
      this.addData.drawPoints[3] = [x, y];
      this.addData.oneDom.attr({
        points: this.addData.drawPoints,
      });
      this.addData.index = 3;
      return;
    }
    if (this.addData.index === 3) {
      this.addData.drawPoints[2] = [this.addData.drawPoints[3][0], y];
      this.addData.oneDom.attr({
        points: this.addData.drawPoints,
      });
      this.addData.index = 4;

      if (this.addData.index < this.addData.drawPoints.length) {
        this.addData.oneData = this.addData.drawPoints.slice(0, 4);
        this.addData.twoData = this.addData.drawPoints.slice(2);
        this.addData.twoDom = this.drawPolygon(
          this.addData.twoData,
          this.nowObjectData.index,
          this.addData.gDom,
          this.colorN[this.nowObjectData.data.direction][1],
          "two"
        );
      } else {
        this.addEnd();
      }
      return;
    }
    if (this.addData.index === 4) {
      this.addData.drawPoints[4] = [x, y];
      this.addData.twoData[2] = [x, y];
      this.addData.twoDom.attr({
        points: this.addData.twoData,
      });
      this.addData.index = 5;
      return;
    }
    if (this.addData.index === 5) {
      this.addData.drawPoints[5] = [this.addData.drawPoints[4][0], y];
      this.addData.twoData[3] = [this.addData.drawPoints[4][0], y];
      this.addData.twoDom.attr({
        points: this.addData.twoData,
      });
      this.addEnd();
    }
  }

  // add: 创建的过程中让当前坐标随着鼠标移动
  public add3Dmove(x: number, y: number) {
    if (this.handleType !== "add" && !this.addData.start) return;
    let Box3d_x, Box3d_y;
    if (this.addData.index === 0) {
      Box3d_x = x;
      Box3d_y = y;
    }
    if (this.addData.index === 1) {
      Box3d_x = this.addData.drawPoints[0][0];
      Box3d_y = y;
      this.addData.drawPoints[1] = [this.addData.drawPoints[0][0], y];
      this.addData.oneDom.attr({
        points: this.addData.drawPoints,
      });
    }
    if (this.addData.index === 2) {
      Box3d_x = x;
      Box3d_y = y;
      this.addData.drawPoints[3] = [x, y];
      this.addData.oneDom.attr({
        points: this.addData.drawPoints,
      });
    }
    if (this.addData.index === 3) {
      Box3d_x = this.addData.drawPoints[3][0];
      Box3d_y = y;
      this.addData.drawPoints[2] = [this.addData.drawPoints[3][0], y];
      this.addData.oneDom.attr({
        points: this.addData.drawPoints,
      });
    }

    if (this.addData.index === 4) {
      Box3d_x = x;
      Box3d_y = y;
      this.addData.drawPoints[4] = [x, y];
      this.addData.twoData[2] = [x, y];
      this.addData.twoDom.attr({
        points: this.addData.twoData,
      });
    }
    if (this.addData.index === 5) {
      Box3d_x = this.addData.drawPoints[4][0];
      Box3d_y = y;
      this.addData.drawPoints[5] = [this.addData.drawPoints[4][0], y];
      this.addData.twoData[3] = [this.addData.drawPoints[4][0], y];
      this.addData.twoDom.attr({
        points: this.addData.twoData,
      });
    }
    return {
      x: Box3d_x,
      y: Box3d_y,
    };
  }
  // add: 新增结束
  public addEnd() {
    this.handleType = "edit";
    this.nowObjectData.data.shapes[this.shapesIndex].points = this.handlePoints(
      this.addData.drawPoints,
      "toOrigin"
    );
    store.setDrawDomRefresh(1);
    ObserverInstance.emit(drawEvents.POLYGON_3D_STATUS_ADD, false);
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      data: this.nowObjectData.data,
      objectIndex: this.nowObjectData.index,
      sign: "Box3d",
    });
    this.initAdd();
  }

  public editEnd() {
    ObserverInstance.emit(dataEvents.EDIT_DRAW_DATA, {
      data: {
        shapes: this.nowObjectData.data.shapes,
        direction: this.nowObjectData.data.direction,
      },
      // data: this.nowObjectData.data,
      objectIndex: this.editPolygonData.objectIndex,
      sign: "Box3d",
    });
  }
  // 修改方向：1->2,使用的数据应该为add状态数据
  public changeDirection(direction: number) {
    let oldDirection = this.nowObjectData.data.direction % 2,
      newDirection = direction % 2;
    if (!oldDirection && newDirection) {
      // console.log('1 -> 2');
      // 编辑状态下
      if (this.commonContorl.operationType !== "add") {
        if (
          this.nowObjectData.data.shapes[this.shapesIndex].points.length !== 0
        ) {
          this.commonContorl.operationType = "add";
          ObserverInstance.emit(
            drawEvents.NOW_TYPE,
            "Box3d",
            this.nowObjectData.index,
            "changeDirection"
          );
          this.handleType = "add";
          this.addData.start = true;
          this.addData.sign = true;
          this.addData.index = 4;
          this.nowObjectData.data.direction = direction;
          this.addData.drawPoints = this.editPolygonData.drawData;
          this.addData.twoData = this.addData.drawPoints
            .slice(2)
            .concat([[], []]);
          this.addData.gDom = this.editPolygonData.gDom;
          this.addData.maxSize = 6;
          this.addData.oneDom = this.editPolygonData.oneDom.attr({
            fill: this.colorN[direction][0],
            stroke: this.colorN[direction][0],
          });
          this.addData.twoDom = this.drawPolygon(
            this.addData.twoData,
            this.nowObjectData.index,
            this.addData.gDom,
            this.colorN[direction][1],
            "two"
          );
        } else {
          this.nowObjectData.data.direction = direction;
          this.editEnd();
        }
      } else {
        // 新增状态下
        this.nowObjectData.data.direction = direction;
        this.addData.drawPoints = [];
        this.addEnd();
      }
    } else {
      // console.log('2 -> 1');
      if (this.commonContorl.operationType !== "add") {
        this.nowObjectData.data.direction = direction;
        this.nowObjectData.data.shapes[this.shapesIndex].points =
          this.nowObjectData.data.shapes[this.shapesIndex].points.splice(0, 4);
        this.editEnd();
      } else {
        // 新增状态下
        this.nowObjectData.data.direction = direction;
        this.addData.drawPoints = [];
        this.addEnd();
      }
    }
  }
  handleGuidePoints(points, sign = "one") {
    const obj = {
      0: {
        one: 0,
        two: 1,
      },
      1: {
        one: 1,
        two: 0,
      },
      2: {
        one: 2,
        two: 3,
      },
      3: {
        one: 3,
        two: 2,
      },
    };
    const guideScale03 =
        (points[obj[3][sign]][1] - points[obj[0][sign]][1]) /
        (points[obj[3][sign]][0] - points[obj[0][sign]][0]),
      guideScale12 =
        (points[obj[2][sign]][1] - points[obj[1][sign]][1]) /
        (points[obj[2][sign]][0] - points[obj[1][sign]][0]);
    const line03_y0 =
        points[obj[0][sign]][1] -
        (points[obj[0][sign]][0] +
          this.publicData.svgDom.node.clientWidth * 0.3) *
          guideScale03,
      line03_y1 =
        (this.publicData.svgDom.node.clientWidth +
          this.editPolygonData.rightW -
          points[obj[3][sign]][0]) *
          guideScale03 +
        points[obj[3][sign]][1],
      line12_y0 =
        points[obj[1][sign]][1] -
        (points[obj[1][sign]][0] +
          this.publicData.svgDom.node.clientWidth * 0.3) *
          guideScale12,
      line12_y1 =
        points[obj[2][sign]][1] +
        (this.publicData.svgDom.node.clientWidth +
          this.editPolygonData.rightW -
          points[obj[2][sign]][0]) *
          guideScale12;

    const line03 = [
        [-this.publicData.svgDom.node.clientWidth * 0.3, line03_y0],
        [
          this.publicData.svgDom.node.clientWidth + this.editPolygonData.rightW,
          line03_y1,
        ],
      ],
      line12 = [
        [-this.publicData.svgDom.node.clientWidth * 0.3, line12_y0],
        [
          this.publicData.svgDom.node.clientWidth + this.editPolygonData.rightW,
          line12_y1,
        ],
      ];
    return {
      line03: line03,
      line12: line12,
    };
  }
  // 3d辅助线
  drawGuideLine(gDom, points, index, sign) {
    try {
      if (points.one.length <= 0) return;

      const pointsObj = this.handleGuidePoints(points.one);
      if (!gDom) {
        gDom = getDom(
          this.publicData.svgDom,
          `#yh_Box3d_g_${this.nowObjectData.index}`
        );
      }
      const line03Dom = getDom(gDom, `#yh_Box3d_guideLine_03_${index}`),
        line12Dom = getDom(gDom, `#yh_Box3d_guideLine_12_${index}`);
      if (line03Dom && line12Dom) {
        line03Dom.attr({
          points: pointsObj.line03,
        });
        line12Dom.attr({
          points: pointsObj.line12,
        });
      } else {
        this.drawLine(gDom, pointsObj.line03, {
          id: `yh_Box3d_guideLine_03_${index}`,
        });
        this.drawLine(gDom, pointsObj.line12, {
          id: `yh_Box3d_guideLine_12_${index}`,
        });
      }
      // console.log(points, "points");

      if (points.two.length > 0) {
        const pointsObjTwo = this.handleGuidePoints(points.two, "two");
        const line34Dom = getDom(gDom, `#yh_Box3d_guideLine_34_${index}`),
          line25Dom = getDom(gDom, `#yh_Box3d_guideLine_25_${index}`);
        if (line34Dom && line25Dom) {
          line34Dom.attr({
            points: pointsObjTwo.line12,
          });
          line25Dom.attr({
            points: pointsObjTwo.line03,
          });
        } else {
          this.drawLine(gDom, pointsObjTwo.line03, {
            id: `yh_Box3d_guideLine_34_${index}`,
          });
          this.drawLine(gDom, pointsObjTwo.line12, {
            id: `yh_Box3d_guideLine_25_${index}`,
          });
        }
      }
    } catch (err) {
      console.log(err, "err--drawGuideLine");
    }
  }
  public drawLine(gDom, points, attr) {
    return gDom
      .line(points)
      .attr({
        "stroke-width": "0.7",
        "stroke-dasharray": "3 2",
        stroke: "#fff",
        "stroke-opacity": 0.3,
        ...attr,
      })
      .css({ "pointer-events": "none" });
    // .scale(10);
  }
  // 处理polygon的数据进行渲染--由1-2个polygon组成
  public draw3D(points: number[][], index: number, direction: number) {
    try {
      if (!points.length) return;
      // draw的polygon使用g标签进行包裹
      const gDom = this.drawGpolygon(index),
        operatePoints = this.operatePoints(points, points.length);
      this.drawGuideLine(gDom, operatePoints, index, true);

      this.drawPolygon(
        operatePoints.one,
        index,
        gDom,
        this.colorN[direction][0],
        "one"
      );
      if (operatePoints.two.length > 0)
        this.drawPolygon(
          operatePoints.two,
          index,
          gDom,
          this.colorN[direction][1],
          "two"
        );
    } catch (err) {
      console.log(err, "err---draw3D");
    }
  }
  /**
   * @description: 处理数据  在转换的过程中将需要调换位置的数据进行改变
   * @param {string} sign toDraw：将原始数据处理为渲染数据
   *                      toOrigin：将渲染数据处理为原始数据
   */
  handlePoints(points: number[][], sign = "toDraw") {
    try {
      const arr: number[][] = new Array(points.length).fill([]);
      for (let i = 0; i < points.length; i++) {
        arr[this.drawIndexChangeArr[i]] = [...points[i]];
      }
      return arr;
    } catch (err) {
      console.log(err, "err--handlePoints");
    }
  }
  // 根据points的长度判断是由1or2个polygon组成--要根据不同的direction进行判断颜色
  operatePoints(points: number[][], len: number) {
    const point: any = this.handlePoints(points);
    return {
      one: len > 4 ? point.slice(0, 4) : point,
      two: len > 4 ? point.slice(2) : [],
    };
  }
  // 绘制polygon
  drawPolygon(
    points: number[][],
    index: number,
    gDom: any,
    stroke: string,
    sign: string
  ) {
    return gDom.polygon(points).attr({
      fill: stroke,
      stroke: stroke,
      "fill-opacity": "0.2",
      "stroke-width": "0.6",
      "color-rendering": "optimizeQuality",
      "shape-rendering": "geometricprecision",
      "data-z-order": 0,
      id: "yh_object_index_" + index + "_" + sign,
      clientID: index, // 这里的index指的是当前polygon对应的objects下标
      sign: sign,
      type: "Box3d",
    });
  }
  // 绘制polygon所在的g
  drawGpolygon(index: number) {
    return this.publicData.svgDom
      .group()
      .attr({
        id: "yh_Box3d_g_" + index,
        clientID: index,
        type: "Box3d",
      })
      .on("mousedown", this.gMouseDown, this);
  }

  // edit：通过dom选择对象 g元素的mouseover事件---记下数据、拿到元素对应的object数据
  gMouseDown(e) {
    if (
      this.commonContorl.circleData.hoverSign ||
      this.commonContorl.circleData.downSign ||
      this.addData.sign ||
      (this.commonContorl.operationType === "add" &&
        this.commonContorl.operationShape !== "Box3d")
    )
      return;

    e.stopPropagation();

    // 拿到当前polygon所对应的数据下标、dom元素
    this.editPolygonData.objectIndex = Number(
      e.target.getAttribute("clientID")
    );

    this.editPolygonData.gDom = getDom(
      this.publicData.svgDom,
      "#yh_Box3d_g_" + this.editPolygonData.objectIndex
    );
    this.editPolygonData.oneDom = getDom(
      this.publicData.svgDom,
      "#yh_object_index_" + this.editPolygonData.objectIndex + "_one"
    );
    this.editPolygonData.twoDom = getDom(
      this.publicData.svgDom,
      "#yh_object_index_" + this.editPolygonData.objectIndex + "_two"
    );
    this.editPolygonData.guideDom03 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_03_${this.editPolygonData.objectIndex}`
    );
    this.editPolygonData.guideDom12 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_12_${this.editPolygonData.objectIndex}`
    );
    this.editPolygonData.guideDom34 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_34_${this.editPolygonData.objectIndex}`
    );
    this.editPolygonData.guideDom25 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_25_${this.editPolygonData.objectIndex}`
    );

    // 根据当前的polygon对应的object下标，发送获取数据信号
    ObserverInstance.emit(
      dataEvents.GET_NOW_OBJECT_DATA,
      this.editPolygonData.objectIndex
    );
    ObserverInstance.emit(
      drawEvents.NOW_TYPE,
      "Box3d",
      this.editPolygonData.objectIndex,
      "gMouseDown"
    );
  }
  // edit: 选择对象后选中svgdom元素--手动获取
  getObjectDom(nowObject) {
    this.editPolygonData.objectIndex = nowObject.index;
    this.editPolygonData.gDom = getDom(
      this.publicData.svgDom,
      "#yh_Box3d_g_" + nowObject.index
    );
    this.editPolygonData.oneDom = getDom(
      this.publicData.svgDom,
      "#yh_object_index_" + nowObject.index + "_one"
    );
    this.editPolygonData.twoDom = getDom(
      this.publicData.svgDom,
      "#yh_object_index_" + nowObject.index + "_two"
    );
    this.commonContorl.hoverData.hoverGDom = getDom(
      this.publicData.svgDom,
      "#yh_g_hover"
    );
    this.editPolygonData.guideDom03 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_03_${this.editPolygonData.objectIndex}`
    );
    this.editPolygonData.guideDom12 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_12_${this.editPolygonData.objectIndex}`
    );
    this.editPolygonData.guideDom34 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_34_${this.editPolygonData.objectIndex}`
    );
    this.editPolygonData.guideDom25 = getDom(
      this.editPolygonData.gDom,
      `#yh_Box3d_guideLine_25_${this.editPolygonData.objectIndex}`
    );
    this.commonContorl.hoverData.hoverGDom?.remove();
    this.commonContorl.hoverData.hoverGDom = this.commonContorl.drawG(
      "yh_g_hover",
      {
        type: "Box3d",
      }
    );
    console.log(
      this.commonContorl.operationShape,
      "this.commonContorl.operationShape"
    );

    this.judgeHover();
  }
  // 控制hover元素
  judgeHover(sign = null) {
    if (sign !== null && sign !== "Box3d") return;
    this.commonContorl.hoverData.hoverGDom.use(this.editPolygonData.oneDom);
    this.commonContorl.hoverData.hoverGDom.use(this.editPolygonData.twoDom);
    this.commonContorl.hoverData.hoverCircles = new Array(
      this.editPolygonData.data.length
    ).fill([]);
    // 绘制hover中的circle--方便控制
    for (let i = 0; i < this.editPolygonData.drawData.length; i++) {
      this.commonContorl.hoverData.hoverCircles[i] =
        this.commonContorl.drawCircle(
          this.editPolygonData.drawData[i],
          i,
          this.commonContorl.hoverData.hoverGDom,
          "Box3d",
          null,
          null,
          null,
          {
            fill: i <= 0 ? "block" : "blue",
            "fill-opacity": "0.9",
          }
        );
    }
  }
  // 获取03辅助线与地平线的交点P0 和 34辅助线与地平线的交点P1
  getGuidePoints(points) {
    const y_x = (points[3][1] - points[0][1]) / (points[3][0] - points[0][0]);
    const x_len = Math.abs(points[3][1] - store.getHorizonNum) / Math.abs(y_x);
    if (y_x < 0) {
      this.editPolygonData.guidePoint = [
        points[3][0] - x_len,
        store.getHorizonNum,
      ];
    } else {
      this.editPolygonData.guidePoint = [
        points[3][0] + x_len,
        store.getHorizonNum,
      ];
    }
    // console.log(points, "pointspointspointspoints=============");
    if (points.length <= 4) return;
    const y_x_tow =
      (points[4][1] - points[3][1]) / (points[4][0] - points[3][0]);
    const x_len_two =
      Math.abs(points[4][1] - store.getHorizonNum) / Math.abs(y_x_tow);
    if (y_x_tow < 0) {
      this.editPolygonData.guidePointTwo = [
        points[4][0] - x_len_two,
        store.getHorizonNum,
      ];
    } else {
      this.editPolygonData.guidePointTwo = [
        points[4][0] + x_len_two,
        store.getHorizonNum,
      ];
    }
  }
  // 对齐操作
  alignmentFun() {
    const points = this.handlePoints(this.editPolygonData.data) as number[][];
    this.getGuidePoints(points);
    let y_x, x_length, y_length, guidePoints, guidePointTwo;
    if (points.length > 4) {
      if (this.editPolygonData.guidePointTwo[0] < points[5][0]) {
        y_x =
          (points[5][1] - store.getHorizonNum) /
          (points[5][0] - this.editPolygonData.guidePointTwo[0]);
        x_length = Math.abs(
          points[2][0] - this.editPolygonData.guidePointTwo[0]
        );
        y_length = y_x * x_length;
        guidePointTwo = [points[2][0], store.getHorizonNum + y_length];
      } else {
        y_x =
          (points[5][1] - store.getHorizonNum) /
          (this.editPolygonData.guidePointTwo[0] - points[5][0]);
        x_length = Math.abs(
          this.editPolygonData.guidePointTwo[0] - points[2][0]
        );
        y_length = x_length * y_x;
        guidePointTwo = [points[2][0], store.getHorizonNum + y_length];
      }
      points[2] = guidePointTwo;
      const pointsObjTwo = this.handleGuidePoints(points.slice(2), "two");
      this.editPolygonData.guideDom25.attr({
        x1: pointsObjTwo.line12[0][0],
        y1: pointsObjTwo.line12[0][1],
        x2: pointsObjTwo.line12[1][0],
        y2: pointsObjTwo.line12[1][1],
      });
      this.commonContorl.hoverData.hoverCircles[2].attr({
        cy: guidePointTwo[1],
      });
      this.nowObjectData.data.shapes[this.shapesIndex].points[
        this.drawIndexChangeArr[2]
      ] = [...guidePointTwo];
      this.editPolygonData.twoDom.attr({
        points: points.slice(2),
      });
    }
    if (this.editPolygonData.guidePoint[0] < points[2][0]) {
      y_x =
        (points[2][1] - store.getHorizonNum) /
        (points[2][0] - this.editPolygonData.guidePoint[0]);
      x_length = Math.abs(points[2][0] - points[1][0]);
      y_length = y_x * x_length;
      guidePoints = [points[1][0], points[2][1] - y_length];
    } else {
      y_x =
        (points[2][1] - store.getHorizonNum) /
        (this.editPolygonData.guidePoint[0] - points[2][0]);
      x_length = Math.abs(this.editPolygonData.guidePoint[0] - points[1][0]);
      y_length = x_length * y_x;
      guidePoints = [points[1][0], store.getHorizonNum + y_length];
    }
    points[1] = guidePoints;
    const pointsObj = this.handleGuidePoints(points.slice(0, 4));
    this.editPolygonData.guideDom12.attr({
      x1: pointsObj.line12[0][0],
      y1: pointsObj.line12[0][1],
      x2: pointsObj.line12[1][0],
      y2: pointsObj.line12[1][1],
    });
    this.commonContorl.hoverData.hoverCircles[1].attr({
      cy: guidePoints[1],
    });
    this.nowObjectData.data.shapes[this.shapesIndex].points[
      this.drawIndexChangeArr[1]
    ] = [...guidePoints];
    this.editPolygonData.oneDom.attr({
      points: points.slice(0, 4),
    });

    this.editEnd();
  }
  // edit: svg上的移动--修改对应dom元素坐标
  moveCircle(x: number, y: number) {
    if (!this.commonContorl.circleData.downSign) return;
    const hoverIndex = this.commonContorl.hoverData.hoverCircleIndex;

    // 1,2,5只能上下移动
    if (hoverIndex === 1 || hoverIndex === 2 || hoverIndex === 5) {
      this.editPolygonData.drawData[hoverIndex][1] = y;
      this.commonContorl.hoverData.hoverCircleDom.attr({
        cy: y,
      });
    }
    // 0，3，4可以上下左右随意移动，且会影响1，2，5
    if (hoverIndex === 0 || hoverIndex === 3 || hoverIndex === 4) {
      let obj = {
        0: 1,
        3: 2,
        4: 5,
      };
      this.editPolygonData.drawData[hoverIndex] = [x, y];
      this.editPolygonData.drawData[obj[hoverIndex]][0] = x;
      this.commonContorl.hoverData.hoverCircles[obj[hoverIndex]].attr({
        cx: x,
      });
      this.commonContorl.hoverData.hoverCircleDom.attr({
        cx: x,
        cy: y,
      });
    }

    this.editPolygonData.oneDom.attr({
      points: this.editPolygonData.drawData.slice(0, 4),
    });
    this.editPolygonData?.twoDom?.attr({
      points: this.editPolygonData.drawData.slice(2),
    });

    const poinrsObj = this.handleGuidePoints(
      this.editPolygonData.drawData.slice(0, 4),
      "one"
    );
    this.editPolygonData.guideDom03.attr({
      x1: poinrsObj.line03[0][0],
      y1: poinrsObj.line03[0][1],
      x2: poinrsObj.line03[1][0],
      y2: poinrsObj.line03[1][1],
    });
    this.editPolygonData.guideDom12.attr({
      x1: poinrsObj.line12[0][0],
      y1: poinrsObj.line12[0][1],
      x2: poinrsObj.line12[1][0],
      y2: poinrsObj.line12[1][1],
    });
    const twoPoints = this.editPolygonData.drawData.slice(2);
    if (twoPoints.length > 2) {
      const pointsObjTwo = this.handleGuidePoints(twoPoints, "two");
      this.editPolygonData.guideDom25.attr({
        x1: pointsObjTwo.line12[0][0],
        y1: pointsObjTwo.line12[0][1],
        x2: pointsObjTwo.line12[1][0],
        y2: pointsObjTwo.line12[1][1],
      });
      this.editPolygonData.guideDom34.attr({
        x1: pointsObjTwo.line03[0][0],
        y1: pointsObjTwo.line03[0][1],
        x2: pointsObjTwo.line03[1][0],
        y2: pointsObjTwo.line03[1][1],
      });
    }
    this.getGuidePoints(this.editPolygonData.drawData);
  }

  // edit: 鼠标up事件,修改数据
  circleUp() {
    this.nowObjectData.data.shapes[this.shapesIndex].points = this.handlePoints(
      this.editPolygonData.drawData,
      "toOrigin"
    );

    let hoverCircleIndex =
      this.drawIndexChangeArr[this.commonContorl.hoverData.hoverCircleIndex];
    if (
      this.nowObjectData.data.shapes[this.shapesIndex].points[
        hoverCircleIndex
      ].toString() === this.editPolygonData.data[hoverCircleIndex].toString()
    ) {
      // console.log("相同--不改变");
      return;
    }
    this.editPolygonData.data =
      this.nowObjectData.data.shapes[this.shapesIndex].points;
    this.editEnd();
  }

  // 初始化
  clearHover() {
    console.log("3d初始化");

    document.getElementById("yh_g_hover")?.remove();
    this.editPolygonData = {
      objectIndex: null,
      data: null,
      drawData: null,
      direction: 0,
      gDom: null,
      oneDom: null,
      twoDom: null,
      hoverGDom: null,
      hoverCircles: [],
      hoverCircleIndex: 0,
      hoverCircleDom: null,
    };
  }
  // 初始化'add'
  initAdd() {
    this.nowObjectData = {
      data: {},
      index: -1,
    };
    this.addData = {
      sign: false,
      start: false,
      index: 0,
      maxSize: 4,
      gDom: null,
      oneDom: null,
      twoDom: null,
      oneData: [],
      twoData: [],
      drawPoints: [],
      lineDom: null,
    };
  }

  // 机器学习：数据下标对应的图片point下标  index:初始数据的下标；len数组的总长度
  matchineDataTOdraw(index: number, len: number) {
    let aArr;
    len > 4 ? (aArr = [1, 0, 2, 5, 3, 4]) : (aArr = [1, 0, 2, 3]);
    return aArr[index];
  }
}

export default mark3D_contorl;
