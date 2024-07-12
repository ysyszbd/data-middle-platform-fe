import { ObserverInstance } from "@/components/draw/event/observer";
import { useStateStore } from "@/stores/state";
import { drawEvents } from "@/components/draw/event/events";
const store = useStateStore();

class dragContorl {
  dragDom: any = null; // 拖拽的元素dom
  boxDom: any = null; // 容器
  mainId = "";
  tx = 0;
  ty = 0;
  startX = 0;
  startY = 0;
  transform = {
    offsetY: 0,
    offsetX: 0,
  };
  scaleNum: any = 0.8;

  constructor(mainId) {
    this.dragDom = document.getElementById(mainId);
    this.boxDom = document.getElementById("canvasDOM");
    this.init();
  }
  init() {
    const sizeFun = new ResizeObserver((val) => {
      // console.log(val[0].contentRect, "val");
    });
    sizeFun.observe(this.boxDom);
  }
  // 拖拽图片
  downFun(e) {
    const dom: any = this.dragDom;
    const disX = e.clientX - dom.offsetLeft,
      disY = e.clientY - dom.offsetTop,
      domRect = dom.getBoundingClientRect();
    const onMousemove = (e) => {
      let x = e.clientX - disX,
        y = e.clientY - disY;
      // 图形移动的边界判断
      x = x <= -domRect.width / 2 ? -domRect.width / 2 : x;
      x =
        x >= e.offsetWidth - dom.offsetWidth
          ? e.offsetWidth - dom.offsetWidth
          : x;
      y = y <= -domRect.height / 2 ? -domRect.height / 2 : y;
      y =
        y >= e.offsetHeight - dom.offsetHeight
          ? e.offsetHeight - dom.offsetHeight
          : y;
      dom.style.left = x + "px";
      dom.style.top = y + "px";
    };
    const onMouseup = () => {
      e.target.removeEventListener("mousemove", onMousemove);
      e.target.removeEventListener("mouseup", onMouseup);
      e.target.removeEventListener("mouseleave", onMouseleave);
    };
    const onMouseleave = () => {
      e.target.removeEventListener("mousemove", onMousemove);
      e.target.removeEventListener("mouseup", onMouseup);
      e.target.removeEventListener("mouseleave", onMouseleave);
    };
    e.target.addEventListener("mousemove", onMousemove);
    e.target.addEventListener("mouseup", onMouseup);
    e.target.addEventListener("mouseleave", onMouseleave);
  }
  // resize
  resizeWheel(e) {
    e = window.event || e;
    const dom: any = document.getElementById("SVG_MAIN");
    let down = e.wheelDelta ? e.wheelDelta < 0 : e.detail > 0;
    if (!down) {
      // console.log("鼠标滚轮向下放大---------");
      this.scaleNum = (Number(this.scaleNum) + 0.02).toFixed(2);
      dom.style.transform = "scale(" + this.scaleNum + ")"; //scale()在这里要使用拼接的方式才能生效
      dom.style.transformOrigin = "0 0";
    } else {
      // console.log("鼠标滚轮向上缩小++++++++++");
      if (this.scaleNum == 0.01) {
        this.scaleNum = 0.01;
        return;
      } else {
        this.scaleNum = (Number(this.scaleNum) - 0.02).toFixed(2);
      }
      dom.style.transform = "scale(" + this.scaleNum + ")"; //scale()在这里要使用拼接的方式才能生效。
      dom.style.transformOrigin = "0 0";
    }
    // if (e.preventDefault) {
    //   /*FF 和 Chrome*/
    //   e.preventDefault(); // 阻止默认事件
    // }
    return false;
  }
  // 初始化图片
  initSize() {
    this.scaleNum = 0.8;
    this.dragDom.style.left = 0 + "px";
    this.dragDom.style.top = 0 + "px";
    this.dragDom.style.transform = "scale(" + this.scaleNum + ")";
    this.dragDom.style.transformOrigin = "0 0";
  }
}
export default dragContorl;
