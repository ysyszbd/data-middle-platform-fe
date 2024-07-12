import { ref } from "vue";
import { useStateStore } from "@/stores/state";
import { get } from "@/utils/axios";

export const albumBreadcrumb = ref<any[]>([]);

export function setAlbumBreadcrumb(data) {
  const store = useStateStore();
  albumBreadcrumb.value = data;
  store.setAlbumBreadcrumb(albumBreadcrumb.value);
}

export function pushAlbumBreadcrumb(data) {
  const store = useStateStore();
  albumBreadcrumb.value.push(data);
  store.setAlbumBreadcrumb(albumBreadcrumb.value);
}

export function getAlbumBreadcrumb() {
  const store = useStateStore();
  if (0 == albumBreadcrumb.value.length) {
    albumBreadcrumb.value = store.getAlbumBreadcrumb;
  }
  return albumBreadcrumb.value;
}

export function randomRgb(index) {
  const R = Math.floor((index * 50) % 255);
  const G = Math.floor(255 - ((index * 50) % 255));
  const B = Math.floor((index * 50) % 255);

  return "rgb(" + R + "," + G + "," + B + ")";
}

export function getSourceUrl(params: string) {
  if (params.startsWith("/")) return "/remote-data" + params;
  return "/remote-data/" + params;
  // /server/api/file/file/proxy?
}

export function getUrl(params) {
  if (params.startsWith("/")) return "/remote-data/format:thumbnail" + params;
  return "/remote-data/format:thumbnail/" + params;
}

export function getUrlPreview(params) {
  return ["/remote-data" + params];
}

export async function getSourceImage(params) {
  // let param = "format:thumbnail/" + params;
  let url: any = await get(
    "/api/file/file/proxy",
    { url: params },
    { responseType: <ResponseType>"blob" }
  );
  if ("application/json" == url.type) {
    return "无权限";
  }
  return URL.createObjectURL(url);
}

export async function getThumbnailImage(params) {
  let param = "format:thumbnail/" + params;
  let url: any = await get(
    "/api/file/file/proxy",
    { url: param },
    { responseType: <ResponseType>"blob" }
  );
  if ("application/json" == url.type) {
    return "无权限";
  }
  return URL.createObjectURL(url);
}

export function getStyleByFileType(type) {
  switch (type) {
    case "album":
    case "dir":
      return "success";
    case "video":
      return "warning";
    case "image":
      return "";
    default:
      return "info";
  }
}
export function statusToType(status) {
  switch (status) {
    case "mount":
      return "";
    case "umount":
    case "unloaded":
    case "entrusting":
      return "info";
    case "entrusted":
      return "warning";
    case "finished":
    case "loaded":
      return "success";
    case "flowing":
      return "danger";
    default:
      return "";
  }
}
// 深拷贝
export function deepClone(obj: any, map = new WeakMap()) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (map.has(obj)) return map.get(obj);
  let res: any = Array.isArray(obj) ? [] : {};
  map.set(obj, res);
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key))
      res[key] = deepClone(obj[key], map);
  }
  return res;
}
// 销毁一个元素
export function clearOneDom(idName: string) {
  document.getElementById(idName)?.remove();
}
/**
 * @description: 返回对应类型所在下标
 * @param {any} arr 要过滤的数组
 * @param {string} type 要判断的类型
 * @return {*}
 */
export function getTypeIndex(arr: any[], type: string, sign = "type") {
  return arr
    ? arr.findIndex((item) => {
        return item[sign] == type;
      })
    : -1;
}
export function getDom(dom: any, name: string) {
  // console.log(name, 'name');

  return dom?.find(name)[0];
}
// 去掉重复数据--返回一个数组
export function handleTypes(types) {
  let map = new Map();
  for (let i = 0; i < types.length; i++) {
    if (map.has(types[i])) {
      break;
    } else {
      map.set(types[i], types[i]);
    }
  }
  return Array.from(map.keys());
}
// 过滤出当前选择的对象所需配置数据
export function handleShapeTypes(val: string, settingObjects: any) {
  const obj = settingObjects.find((item) => {
    return item.category === val;
  });
  return obj
    ? obj
    : {
        shape_types: []
      };
}
// 获取本地数据
export function getSessionData(name: string) {
  return JSON.parse(sessionStorage.getItem(name) as any) || "";
}
// 存放数据至sessionstorage
export function setSessionData(name: string, data: any) {
  sessionStorage.setItem(name, JSON.stringify(data));
}
// 计算图片适配屏幕宽高
export function handleWH(
  domW: number,
  domH: number,
  imgW: number,
  imgH: number
) {
  const imgScale = imgW / imgH;
  // let w = domW,
  //   h = w / imgScale,
  //   scale;
  // if (h > domH) {
  //   h = domH;
  //   w = h * imgScale;
  //   scale = imgH / h;
  //   console.log(scale, "scale--h > domH");
  // } else {
  //   w = domW
  //   scale = imgW / w;
  //   console.log(scale, "scale--");
  // }

  return {
    scale: imgH / 946,
    h: 946,
    w: (946 * imgW) / imgH
    // scale: scale,
    // h: h,
    // w: w,
  };
}
export function getStyle(dom, attr) {
  if (typeof window.getComputedStyle !== "undefined") {
    return window.getComputedStyle(dom, null)[attr];
  } else if (typeof dom.currentStyle !== "undefined") {
    return dom.currentStyle[attr];
  }
  return "";
}
// 用于计算dom元素的transfrom
export const matrix3dReg =
  /^matrix3d\((?:[-\d.]+,\s*){12}([-\d.]+),\s*([-\d.]+)(?:,\s*[-\d.]+){2}\)/;
export const matrixReg = /^matrix\((?:[-\d.]+,\s*){4}([-\d.]+),\s*([-\d.]+)\)$/;

// 将原始数据按照比例转换为当前页需要的数据大小
export function handlePoints(points: number[][], scale: number) {
  const arr: number[][] = [];
  for (let i = 0; i < points.length; i++) {
    arr.push([points[i][0] / scale, points[i][1] / scale]);
  }
  return arr;
}
export function getMustArray(searchData) {
  const array: any = [];
  const store = useStateStore();
  for (const i in searchData) {
    if (searchData[i] instanceof Object) {
      for (const j in searchData[i]) {
        if (searchData[i][j] != "") {
          // console.log(j);

          if (j == "tags") {
            for (const k in searchData[i][j]) {
              // console.log("键名：", i + "." + j + "." + k);
              // console.log("键值：", searchData[i][j][k]);
              array.push({
                match: { "label.tags.tags.id": searchData[i][j][k] }
              });
            }
          } else if (j == "self_tag") {
            for (const k in searchData[i][j]) {
              if (searchData[i][j][k].data != "") {
                // console.log("键名：", i + "." + j + "." + k);
                // console.log("键值：", searchData[i][j][k].data);
                array.push({
                  match: { "label.self_tag.id": store.getUserId }
                });
                array.push({
                  match: { "label.self_tag.data": searchData[i][j][k].data }
                });
              }
            }
          } else if (j == "data_tag") {
            array.push({
              match: { "label.data_tag": searchData[i][j] }
            });
          } else if (j == "custom_tag") {
            array.push({
              match: { "label.custom_tag": searchData[i][j] }
            });
          } else if (j == "event_tag") {
            array.push({
              match: { "label.event_tag": searchData[i][j] }
            });
          } else {
            const key = i + "." + j;
            const value = searchData[i][j];
            // console.log(key, value);
            const terms = {};
            terms[key] = value;
            array.push({ match: terms });
          }
        }
      }
    } else {
      if (searchData[i] != "") {
        const key = i;
        const value = searchData[i];
        array.push({ match: { key: value } });
      }
    }
  }
  return array;
}

export function initTreeData(previewInfo) {
  const data = [] as any[];
  for (const i in previewInfo) {
    const value = previewInfo[i];
    const child = {
      key: i,
      label: keyToName(i),
      children: [] as any[]
    };
    if (value instanceof Object) {
      for (const j in value) {
        const subvalue = value[j];
        if (j == "tags") {
          const subChild = {
            key: j,
            label: keyToName(j),
            children: [] as any[]
          };

          for (let k = 0; k < subvalue.length; k++) {
            const type = subvalue[k].type;
            const subChild1 = {
              label: type,
              children: [] as any[]
            };
            for (let index = 0; index < subvalue[k].tags.length; index++) {
              subChild1.children.push({ label: subvalue[k].tags[index].names });
            }
            subChild.children.push(subChild1);
          }
          child.children.push(subChild);
        } else if (j == "custom_tag" || j == "data_tag" || j == "event_tag") {
          const subChild = {
            key: j,
            add: true,
            label: keyToName(j),
            children: [] as any[]
          };
          for (let k = 0; k < subvalue.length; k++) {
            const subChild1 = {
              label: subvalue[k],
              delete: true,
              edit: true,
              showEdit: false,
              children: [] as any[]
            };
            subChild.children.push(subChild1);
          }
          child.children.push(subChild);
        } else {
          const subChild = {
            key: j,
            label: keyToName(j),
            value: subvalue,
            children: [] as any[]
          };
          if (j == "self_tag") {
            subChild.value = "";
            subChild.children.push({
              label: value[j].data,
              edit: true,
              showEdit: false
            });
          }
          child.children.push(subChild);
        }
      }
    }
    data.push(child);
  }
  // console.log(data);
  return data;
}

export function getFileFilter(searchData, filter) {
  console.log(searchData, filter, "filter========");

  if (undefined === searchData) {
    return JSON.stringify(filter);
  }
  const { info, label } = searchData;
  for (const key in info) {
    if (info[key] == "") {
      continue;
    }
    let str = "info." + key + ".keyword";
    if (str in filter) {
      filter[str].value.push(info[key]);
    } else {
      filter[str] = {
        type: "string",
        operation: "term",
        value: [info[key]]
      };
    }
  }
  for (const key in label) {
    if (label[key] == "") {
      continue;
    }
    if ("self_tag" == key) {
      if (label.self_tag[0].data != "") {
        const store = useStateStore();
        filter["label.self_tag.id"] = {
          type: "int",
          operation: "term",
          value: [String(store.getUserId)]
          // value: [String(label.self_tag[0].id)],
        };
        filter["label.self_tag.data"] = {
          type: "string",
          operation: "term",
          value: [label.self_tag[0].data]
        };
      }
    } else if ("tags" == key) {
      let valueArray = [] as any;
      for (let i = 0; i < label.tags.length; i++) {
        const ele = label.tags[i];
        valueArray.push(String(ele));
      }
      filter["label.tags"] = {
        type: "int",
        operation: "term",
        value: valueArray
      };
    } else {
      let info = "label." + key + ".keyword";
      if (info in filter) {
        filter[info].value.push(label[key]);
      } else {
        filter[info] = {
          type: "string",
          operation: "term",
          value: [label[key]]
        };
      }
    }
  }
  return JSON.stringify(filter);
}

let resizeFlag;
export function windowResizeEvent(callback) {
  window.onresize = function () {
    if (resizeFlag) {
      clearTimeout(resizeFlag);
    }

    resizeFlag = setTimeout(function () {
      callback();
      resizeFlag = null;
    }, 100);
  };
}

export function keyToName(label) {
  switch (label) {
    case "info":
      return "采集信息";
    case "label":
      return "标签信息";
    case "car":
      return "车型";
    case "vin":
      return "VIN";
    case "date":
      return "日期";
    case "location":
      return "地点";
    case "platform":
      return "平台";
    case "use":
      return "用途";
    case "function":
      return "功能";
    case "software":
      return "采集软件";
    case "tags":
      return "环境标签";
    case "custom_tag":
      return "自定义标签";
    case "self_tag":
      return "私有标签";
    case "data_tag":
      return "数据标签";
    case "event_tag":
      return "事件标签";
    case "dir_date":
    case "img_date":
      return "日期";
    case "dir_name":
    case "img_name":
      return "名称";
    case "dir_size":
    case "img_size":
      return "大小";
    case "img_height":
      return "图片高度";
    case "img_width":
      return "图片宽度";
    case "labeltrain":
      return "标注训练";
    case "testdata":
      return "测试数据";
    case "customerdata":
      return "客户数据";
    case "mount":
      return "已挂载";
    case "mounting":
      return "挂载中";
    case "umount":
      return "未挂载";
    case "entrusting":
      return "托管中";
    case "entrusted":
      return "已托管";
    case "flowing":
      return "待审核";
    case "finished":
      return "已完成";
    case "pending":
      return "等待中";
    case "loaded":
      return "已加载";
    case "loading":
      return "加载中";
    case "unloaded":
      return "未加载";
    case "linking":
      return "链接中";
    case "softwaretest":
      return "软件测试";
    default:
      return label;
  }
}
export function handleId1(obj1, obj2) {
  const val1 = obj1.id;
  const val2 = obj2.id;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}
export function handleId(obj1, obj2) {
  const val1 = obj1.tags[obj1.tags.length - 1].id;
  const val2 = obj2.tags[0].id;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
}

// 处理元素拖拽
export let transform = {
  right: {
    offsetX: 0,
    offsetY: 0
  },
  left: {
    offsetX: 0,
    offsetY: 0
  },
  group: {
    offsetX: 0,
    offsetY: 0
  },
  work: {
    offsetX: 0,
    offsetY: 0
  },
  drawMain: {
    offsetX: 0,
    offsetY: 0
  }
};
export function downFUN(e, id, sign) {
  try {
    const downX = e.clientX,
      downY = e.clientY,
      { offsetX, offsetY } = transform[sign];
    const targetRect = document.getElementById(id)!.getBoundingClientRect();
    const targetLeft = targetRect.left;
    const targetTop = targetRect.top;
    const targetwidth = targetRect.width;
    const targetHeight = targetRect.height;
    const clientwidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const minLeft = -targetLeft + offsetX;
    const minTop = -targetTop + offsetY;
    const maxLeft = clientwidth - targetLeft - targetwidth + offsetX;
    const maxTop = clientHeight - targetTop - targetHeight + offsetY;
    const onMousemove = (e: MouseEvent) => {
      const moveX = Math.min(
        Math.max(offsetX + e.clientX - downX, minLeft),
        maxLeft
      );
      const moveY = Math.min(
        Math.max(offsetY + e.clientY - downY, minTop),
        maxTop
      );
      transform[sign] = {
        offsetX: moveX,
        offsetY: moveY
      };
      document.getElementById(
        id
      )!.style.transform = `translate3d(${moveX}px, ${moveY}px, 1px)`;
    };
    const onMouseup = () => {
      document.removeEventListener("mousemove", onMousemove);
      document.removeEventListener("mouseup", onMouseup);
    };
    document.addEventListener("mousemove", onMousemove);
    document.addEventListener("mouseup", onMouseup);
  } catch (err) {
    console.log(err, "err===");
  }
}
//将中国标准时间转换为年月日格式  ----开始
export function formatTen(num) {
  return num > 9 ? num + "" : "0" + num;
}
export function formatDate(date, symbol) {
  const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();
  return year + symbol + formatTen(month) + symbol + formatTen(day);
}
// 工具函数：设置transform属性
export function _setTransformProp(transform = "", prop = "", value = "") {
  const reg = new RegExp(`${prop}((.*))`, "g");
  if (transform.includes(prop)) {
    const propList = transform.replaceAll(", ", ",").trim().split(" ");
    const newPropList = propList.map((item) =>
      item.replaceAll(reg, `${prop}(${value})`)
    );
    transform = newPropList.join(" ");
  } else {
    transform = `${prop}(${value}) ` + transform;
  }
  return transform;
}
// 返回数据类型
export function handleType(val) {
  if (!val) return;
  const sign = Object.prototype.toString.call(val);
  const str = sign.slice(1, sign.length - 1),
    typeArr = str.split(" ");
  return typeArr[1];
}

export function decodeUtf8(arr) {
  console.log(arr, "arr");

  let str = arr.reduce((prev, cur) => (prev += `%${cur.toString(16)}`), "");

  return decodeURIComponent(str); // '深圳华强'
}

/**
 2  * [获取URL中的参数名及参数值的集合]
 3  * 示例URL:http://htmlJsTest/getrequest.html?uid=admin&rid=1&fid=2&name=小明
 4  * @param {[string]} urlStr [当该参数不为空的时候，则解析该url中的参数集合]
 5  * @return {[string]}       [参数集合]
 6  */
export function GetRequest(urlStr) {
  let url = "";
  if (typeof urlStr == "undefined") {
    url = decodeURI(location.search); //获取url中"?"符后的字符串
  } else {
    url = urlStr.split("?")[1] ? "?" + urlStr.split("?")[1] : "";
  }
  if (url) {
    const theRequest = new Object();
    if (url.indexOf("?") != -1) {
      let str = url.substr(1),
        strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  } else {
    return null;
  }
}

/**
 * @description: 防抖
 * @param {*} func  要执行得函数
 * @param {*} wait  等待的时间--毫秒
 * @param {*} immediate  是否立即执行--boolean
 * @param {*} _this  this
 * @param {*} args  要传递的参数
 * @return {*}
 */
export function debounce(func, wait, immediate, _this, args) {
  let timeout;

  return function () {
    if (timeout) clearTimeout(timeout); // timeout 不为null
    if (immediate) {
      let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) {
        func.apply(_this, args);
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(_this, args);
      }, wait);
    }
  };
}

// filter: { "label.tags": { "type": "int", "operation": "term", "value": ["802"] } }
// must: { "basic.source_type":{ "type": "string", "operation": "term", "value": ["album"] }}

export function getReadAuthority(row) {
  let actions = row.action;
  for (let action in actions) {
    let actionProto = actions[action];
    switch (actionProto.name) {
      case "读取":
        return actionProto.is_active;
    }
  }
}

export function isJSON(data) {
  try {
    JSON.parse(data);
    return true; // 数据是JSON格式的
  } catch (error) {
    return false; // 数据不是JSON格式的
  }
}
