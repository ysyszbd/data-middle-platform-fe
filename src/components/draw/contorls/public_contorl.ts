/*
 * @LastEditTime: 2023-08-01 15:27:53
 * @Description: 标注--公共服务控制类
 */
import { ObserverInstance } from "@/components/draw/event/observer";
import { useStateStore } from "@/stores/state";
import { drawEvents } from "@/components/draw/event/events";
import { getDom } from "@/utils/util";
import { nextTick } from "vue";
const store = useStateStore();

class publicContorl {
  public observerListenerList = [
    { eventName: drawEvents.HELP_TYPE, fn: this.handleHelp.bind(this) },
    {
      eventName: drawEvents.SHORTCUT_KEYS_CLEAR,
      fn: this.handleKey.bind(this),
    },
    {
      eventName: drawEvents.SHORTCUT_KEYS_DOWN_CIRCLE,
      fn: this.handleKey.bind(this),
    },
    { eventName: drawEvents.NOW_TYPE, fn: this.getNowType.bind(this) },
    {
      eventName: drawEvents.HANDLE_FOCUS_MODE,
      fn: this.handleFocusMode.bind(this),
    },
  ];
  public mainSVGsign = false; // 鼠标是否超出主svg的dom标识
  public circleData: {
    hoverSign: boolean;
    downSign: boolean;
    eventSign: string;
  } = {
    hoverSign: false, // 是否进入circle标识
    downSign: false, // 是否按下circle标识
    eventSign: "",
  };
  hover2Data: any = {
    circlesDom: [],
    hoverGDom: null,
    hoverCircleIndex: 0,
    hoverCircleDom: null,
  };
  hoverData: any = {
    circlesDom: [],
    hoverGDom: null,
    hoverCircleIndex: 0,
    hoverCircleDom: null,
  };
  publicData: { svgDom: any; scale: number; assistSvgDom: any } = {
    svgDom: null,
    scale: 1,
    assistSvgDom: null,
  };
  keyData = "";
  helpList: any = {
    十: {
      sign: false,
      lineOneDom: null,
      lineTwoDom: null,
      fn: this.showHelpLine,
    },
    圆: {
      sign: false,
      circleDom: null,
      fn: this.showHelpCircle,
    },
  }; // 辅助线列表
  carHeadData = {
    sign: false, // 是否正在操作车头线
    key: "", // 按下的快捷键
  };
  operationType = "edit"; // 当前的操作状态
  operationShape = ""; // 当前操作的形状类型 Box2d、Box3d、polyline[线条]
  focusModeData: any = {
    index: -1,
    groupsIndex: -1,
    sign: false,
  };

  constructor(publicData: { svgDom: any; scale: number }, assistSvgDom: any) {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_mark"
    );
    this.publicData = {
      ...publicData,
      assistSvgDom: assistSvgDom,
    };
  }
  handleFocusMode(obj: { sign: boolean | null; index: number; a: string }) {
    try {
      // console.log(obj, "obj---handleFocusMode", this);
      if (obj.sign !== null) {
        this.focusModeData.sign = obj.sign;
      } else {
        if (!this.focusModeData.sign || store.getNowContentType === "envLabel")
          return;
      }
      this.focusModeData.index = obj.index;
      this.focusModeData.groupsIndex = store.getNowDrawGroupsIndex;
      if (!this.focusModeData.sign) {
        this.publicData.svgDom.each((i, children) => {
          if (children[i].visible()) return;
          children[i].show();
        });
        return;
      } else {
        const hoverName =
          this.operationShape === "Box2d" ? "yh_g_hover_Box2d" : "yh_g_hover";
        if (store.getNowContentType !== "laneline") {
          this.publicData.svgDom.each((i, children) => {
            // console.log(
            //   "children[i]==========",
            //   children[i].node.id,
            //   children[i],
            //   this.publicData.svgDom.node.contains(children[i].node)
            // );
            if (
              children[i].node.id !==
                `yh_${this.operationShape}_g_${this.focusModeData.index}` &&
              children[i].node.id !== hoverName
            ) {
              if (children[i].visible()) {
                children[i].hide();
              }
            } else {
              if (!children[i].visible()) {
                children[i]?.show();
              }
            }
          });
        } else {
          const groupId = `yh_${this.operationShape}_group_${store.getNowDrawGroupsIndex}`,
            linesArr = store.getDrawGroupsLines;
          this.publicData.svgDom.each((i, children) => {
            if (
              (children[i].node.id === hoverName &&
                this.findDom(
                  linesArr,
                  children[i]?.node?.getAttribute("objectsIndex")
                ) >= 0) ||
              children[i].node.id === groupId ||
              (this.findDom(
                linesArr,
                children[i]?.node?.getAttribute("objectsIndex")
              ) >= 0 &&
                children[i].node.id !== hoverName) ||
              (this.operationType === "add" &&
                (children[i].node.id ===
                  `yh_${this.operationShape}_${this.focusModeData.index}` ||
                  children[i].node.id === `yh_Curve_g_add`))
            ) {
              if (!children[i].visible()) children[i].show();
            } else {
              if (children[i].visible()) children[i].hide();
            }
          });
        }
      }
    } catch (err) {
      console.log(err, "err----handleFocusMode");
    }
  }
  findDom(arr, val) {
    if (arr.length > 0) {
      const res = arr.findIndex((ele) => {
        return ele == val;
      });
      return res;
    } else {
      return -1;
    }
  }
  getNowType(type: string, index: any, sign) {
    // console.log(type, "type==================getNowType", sign);
    this.operationShape = type;
    store.setOperationShape(type);
    nextTick(() => {
      this.handleFocusMode({
        sign: null,
        index: index,
        a: "getNowType",
      });
    });
  }
  handleKey(val: string) {
    if (val === this.keyData) return;
    this.keyData = val;
  }
  handleHelp(val: string) {
    try {
      if (val === "--" || this.helpList[val].sign) return;
      for (let [k, v] of Object.entries(this.helpList)) {
        if (k === val) {
          this.helpList[k].sign = true;
          this.helpList[k].fn.bind(this)();
        } else {
          this.helpList[k].sign = false;
        }
      }
    } catch (err) {
      console.log(err, "err");
    }
  }
  // 控制“十字辅助线”--保留元素，获取dom元素
  showHelpLine() {
    if (!this.helpList["十"].lineOneDom) {
      this.helpList["十"].lineOneDom =
        this.publicData.assistSvgDom.find("#yh_help_line_one")[0];
    }
    if (!this.helpList["十"].lineTwoDom) {
      this.helpList["十"].lineTwoDom =
        this.publicData.assistSvgDom.find("#yh_help_line_two")[0];
    }
  }
  // 十字辅助线随着鼠标移动
  moveHelpLine(x: number, y: number) {
    // console.log(x, y, 'x--y');

    if (!this.helpList["十"].sign) return;
    this.helpList["十"].lineOneDom.attr({
      x1: x - 150,
      y1: y,
      x2: x + 150,
      y2: y,
    });
    this.helpList["十"].lineTwoDom.attr({
      x1: x,
      y1: y - 150,
      x2: x,
      y2: y + 150,
    });
  }
  // 控制圆形辅助线--保留状态，并获取dom元素
  showHelpCircle() {
    if (!this.helpList["圆"].circleDom) {
      this.helpList["圆"].circleDom =
        this.publicData.assistSvgDom.find("#yh_help_circle")[0];
    }
  }
  // 圆形辅助线随着鼠标移动
  moveHelpCircle(x: number, y: number) {
    if (!this.helpList["圆"].sign) return;
    this.helpList["圆"].circleDom.attr({
      cx: x,
      cy: y,
    });
  }

  // 生成覆盖的g标签
  public drawG(id = "yh_g_hover", attrObj: any | null = {}) {
    return this.publicData.svgDom.group().attr({
      id: id,
      ...attrObj,
    });
  }
  // g标签中的circle
  public drawCircle(
    points: number[][],
    i: number,
    gDom: any,
    sign: string,
    downCallback: any = null,
    leaveCallback: any = null,
    that: any = this,
    attrObj: any = {},
    overCallback: any = null
  ) {
    if (!that) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      that = this;
    }
    return gDom
      .circle(attrObj?.circle ? attrObj?.circle : 4)
      .attr({
        id: "yh_g_circle_" + i,
        clientID: i,
        fill: "blue",
        "fill-opacity": "1",
        cx: points[0],
        cy: points[1],
        type: sign,
        ...attrObj,
      })
      .css({ cursor: "pointer", "pointer-events": "all" })
      .on("mousedown", downCallback ? downCallback : this.downCircle, that)
      .on(
        "mousemove",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        },
        that
      )
      .on("mouseleave", leaveCallback ? leaveCallback : this.leaveCircle, that)
      .on("mouseover", overCallback ? overCallback : () => {}, that);
  }
  public downCircle(e) {
    if (this.circleData.downSign || this.keyData !== "Control") return;
    this.circleData.downSign = true;
    const circleIndex = Number(e.target.getAttribute("clientID")),
      type = e.target.getAttribute("type");

    if (type === "Box2d") {
      this.hover2Data.hoverCircleIndex = circleIndex;
      this.hover2Data.hoverCircleDom = this.hover2Data.hoverGDom.find(
        "#" + e.target.id
      )[0];
    } else {
      this.hoverData.hoverCircleIndex = circleIndex;
      this.hoverData.hoverCircleDom = this.hoverData.hoverGDom.find(
        "#" + e.target.id
      )[0];
      console.log(this.hoverData, "this.hoverData");
    }
    this.operationShape = type;
  }
  public upCircle(type: string) {
    if (!this.circleData.downSign) return;

    const eventsObj = {
      typeLine: drawEvents.TYPELINW_CIRCLE_UP,
      Box3d: drawEvents.POLYGON_3D_CIRCLE_UP,
      Box2d: drawEvents.RECT_2D_CIRCLE_UP,
      Curve: drawEvents.CURVE_CIRCLE_UP,
      Line: drawEvents.LINE_CIRCLE_UP,
      Ray: drawEvents.RAY_CIRCLE_UP,
      Poly4: drawEvents.POLY4_CIRCLE_UP,
    };
    ObserverInstance.emit(eventsObj[type]);
    this.circleData.downSign = false;
  }
  public leaveCircle(e) {
    this.circleData.hoverSign = false;
  }

  public circleTOvoid(sign: string) {
    this.circleData.eventSign = sign;
  }

  // 初始化数据
  public init() {
    this.hoverData = {
      circlesDom: [],
      hoverCircleDom: null,
      hoverCircleIndex: -1,
      hoverGDom: null,
    };
  }
  public clearG() {
    this.publicData.svgDom.find("yh_g_hover")[0]?.clear();
  }
}
export default publicContorl;
