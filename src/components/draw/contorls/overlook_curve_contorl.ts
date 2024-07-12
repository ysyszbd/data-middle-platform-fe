class overlookCurveContorl {
  constructor() {
    // console.log("overlookCurveContorl--init");
  }
  drawPolyLine(dom: any, points: number[][]) {
    try {
      // console.log(points, "points=======pppppp");
      
      if (!points?.length) return;
      return dom
        .polyline(points)
        .attr({
          fill: "none",
          stroke: "red",
          "fill-width": 0,
          "stroke-width": 10,
          "id": "curve_line"
        })
        .css({ cursor: "pointer" });
    } catch (err) {
      console.log(err, "err-----drawPolyLine");
    }
  }
  // 初始化--清除掉所有线条后重新绘制
  init(dom) {
    dom.each((i, children) => {
      // console.log(children[i].node.id, "children[i].node.id=================");
      if (children[i].node.id != "svg_img") {
        children[i].remove();
      }
    })
  }
}
export default overlookCurveContorl;
