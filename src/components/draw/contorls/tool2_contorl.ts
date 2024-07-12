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
      eventName: drawEvents.TOOL2_DRAW_POLYGON,
      fn: this.drawTool2Polygon.bind(this),
    },
    {
      eventName: drawEvents.TOOL2_CLEAR_PARK_DOM,
      fn: this.clearParkDom.bind(this),
    },
  ];
  groupColors = ["white", "blue", "green"];
  TAG = "tool2";

  constructor(publicData: { svgDom: any; scale: number }, commonContorl: any) {
    ObserverInstance.selfAddListenerList(
      this.observerListenerList,
      "yh_svg_tool2"
    );
    this.publicData = publicData;
    this.commonContorl = commonContorl;
  }
  // 清除组dom
  clearParkDom(index) {
    getDom(this.publicData.svgDom, `#yh_${this.TAG}_group_${index}`)?.remove();
  }
  drawTool2Polygon(groupObj: { groupIndex: number; parkType: number; points }) {
    const parkDom = getDom(
      this.publicData.svgDom,
      `#yh_${this.TAG}_group_${groupObj.groupIndex}`
    );
    if (parkDom) {
      parkDom.attr({
        points: this.handleDrawPoints(groupObj.points),
        fill: this.groupColors[groupObj.parkType],
        stroke: this.groupColors[groupObj.parkType],
      });
    } else {
      this.drawPolygon(
        this.handleDrawPoints(groupObj.points),
        groupObj.groupIndex,
        groupObj.parkType
      );
    }
  }
  // 绘制polygon 最多4个点
  drawPolygon(points: number[][], index: number, groupType) {
    return this.publicData.svgDom
      .polygon(points)
      .attr({
        fill: this.groupColors[groupType],
        stroke: this.groupColors[groupType],
        "fill-opacity": "0",
        "stroke-width": "0.8",
        "color-rendering": "optimizeQuality",
        "shape-rendering": "geometricprecision",
        "data-z-order": 0,
        id: `yh_${this.TAG}_group_${index}`,
        groupsIndex: index, // 这里的index指的是当前polygon对应的objects下标
        sign: this.TAG,
        type: this.TAG,
      })
      .css({ "pointer-events": "none" });
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
