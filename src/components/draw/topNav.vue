<!--
 * @LastEditTime: 2023-07-17 13:32:31
 * @Description: 标注任务顶部操作栏
-->
<template>
  <div class="top_nav">
    <div class="nav_base_box">
      <div class="back_btn" @click="router.back">
        <ArrowLeft width="18px" />
        返回
      </div>
      <div class="save_btn" @click="saveData" v-if="props.currentStep != 7">
        <img src="@/assets/image/task_save_icon.svg" class="save_icon" />
        点击保存
      </div>
      <!-- 用来提示当前页面的操作状态 -->
      <div class="page_tips" v-show="pageTips.sign">
        <img src="@/assets/image/tip_icon.svg" class="tip_icon" />
        {{ tipsText[pageTips.type] }}
        <Loading
          width="18px"
          color="#fff"
          class="tip_icon_loading"
          v-show="pageTips.type === 'loading'"
        />
      </div>
      <div class="files_box">
        <el-dropdown
          trigger="click"
          @visible-change="closeFilesList"
          id="filesDOM"
        >
          <el-button type="primary" class="file_title">
            <div class="file_title_id">
              {{ "id:  " + nowImgData?.id }}
            </div>
            <div class="file_title_name">
              {{ "图片名:  " + nowImgData?.basic.name }}
            </div>
            <el-icon class="el-icon--right file_title_icon"
              ><arrow-down
            /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in imgListData.list"
                :key="index"
                :tabindex="item.id === nowImgData?.id ? 0 : -1"
                @click="selectImg(index)"
                :style="`${
                  item.id === nowImgData?.id
                    ? 'background: rgb(228, 228, 228);font-weight: 600;'
                    : ''
                }`"
              >
                <div class="file_img_list_item_id">id: {{ item.id }}</div>
                <div class="file_img_list_item_name">
                  图片名: {{ item.basic.name }}
                </div>
                <el-icon
                  v-show="item.id === nowImgData?.id"
                  class="el-icon--right file_img_list_item_icon"
                >
                  <Select color="red" />
                </el-icon>
              </el-dropdown-item>
            </el-dropdown-menu>
            <el-button-group
              class="file_page_btns"
              v-if="imgListData.totalPage > 1"
            >
              <div class="file_page_text_all">
                {{ `共 ${imgListData.totalPage} 页` }}
              </div>
              <div class="file_page_center">
                <el-button
                  type="primary"
                  :icon="ArrowLeft"
                  :disabled="imgListData.page <= 1"
                  @click="changeP(imgListData.page - 1)"
                  size="small"
                  >上一页</el-button
                >
                <div class="file_page_text">
                  {{ `第 ${imgListData.page} 页` }}
                </div>
                <el-button
                  size="small"
                  type="primary"
                  :disabled="imgListData.page === imgListData.totalPage"
                  @click="changeP(imgListData.page + 1)"
                >
                  下一页<el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </div>
            </el-button-group>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div :class="['nav_operation_box']">
      <div class="help_tools base_btn">
        <div class="top_tip">辅助线:</div>
        <el-select class="help_select_box" v-model="helpValue">
          <el-option
            v-for="item in helpList"
            :key="item.key"
            :label="item.name"
            :value="item.key"
            @click="handleHelp(item.key)"
          />
        </el-select>
      </div>
      <i class="nav_line"></i>
      <el-checkbox
        v-show="props.nowContentType.type !== 'envLabel'"
        v-model="focusMode"
        :label="
          props.nowContentType.type !== 'laneline' ? '聚焦模式' : '仅看当前道路'
        "
        size="large"
        class="focus_btn base_btn"
        @change="handleFocusMode"
      />
      <i class="nav_line" v-show="props.nowContentType.type !== 'envLabel'"></i>
      <el-checkbox
        v-show="props.nowContentType.type === 'laneline'"
        v-model="carHead"
        label="车头线"
        size="large"
        class="focus_btn base_btn"
        @change="handleHeadLine(carHead)"
      />
      <i class="nav_line" v-show="props.nowContentType.type === 'laneline'"></i>
      <el-checkbox
        v-if="props.nowContentType.type === 'typeLine'"
        v-model="typelineNoX"
        label="限制X轴方向"
        class="x_btn base_btn"
        @change="changeX(typelineNoX)"
      />
      <i class="nav_line" v-show="props.nowContentType.type === 'typeLine'"></i>
      <el-checkbox
        v-if="
          props.nowContentType.type === 'tool0' ||
          props.nowContentType.type === 'tool3'
        "
        v-model="horizonSign"
        label="地平线"
        class="x_btn base_btn"
        @change="handleHorizon"
      />
      <el-button
        v-show="doneSign"
        type="warning"
        class="btn_done"
        @click="addChartEnd"
        >Done</el-button
      >
      <el-checkbox
        v-if="props.nowContentType.type === 'laneline'"
        v-model="overLookSign"
        label="俯瞰图"
        class="x_btn base_btn"
        @change="handleOverLook(overLookSign)"
      />
      <i class="nav_line" v-show="props.nowContentType.type === 'laneline'"></i>
      <!-- <div class="nav_tools">
        <div class="nav_btn btn_before" title="撤销"></div>
                  <div class="nav_btn btn_back" title="恢复"></div>
        <div class="nav_btn btn_save" title="保存"></div>

        <i class="nav_line"></i>
      </div> -->
      <!-- 文件显示区域 -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, defineProps, defineEmits } from "vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
import { useRouter } from "vue-router";
import { useStateStore } from "@/stores/state";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Select,
  Loading,
  Search,
  CaretTop,
  CaretBottom,
} from "@element-plus/icons-vue";

const props = defineProps([
  "imgListData",
  "nowImgData",
  "nowContentType",
  "nowObjectIndex",
  "groupsIndex",
  "currentStep",
  "overlookSign",
]);
const emits = defineEmits(["changePage", "saveData", "changeImg"]);
const router = useRouter();
const store = useStateStore();

let observerListenerList = [
    { eventName: drawEvents.HANDLE_DONE_BTN, fn: getAddSign.bind(this) },
    { eventName: drawEvents.SHORTCUT_KEYS_ESC, fn: addChartEnd.bind(this) },

    {
      eventName: drawEvents.SHORTCUT_KEYS_HELP,
      fn: handleShortCutHelp.bind(this),
    },
    {
      eventName: drawEvents.SHORTCUT_KEYS_FOCUS_MODE,
      fn: handleFocusMode.bind(this),
    },
    {
      eventName: dataEvents.HANDLE_PAGE_TIP,
      fn: handleTips.bind(this),
    },
  ],
  tipsText = {
    loading: "加载中...",
    adding: "创建中...",
    editing: "编辑中...",
    延长线: "延长线ing",
    插入点: "插入点ing",
  },
  pageTips = ref({
    sign: false,
    type: "",
  }), // 页面提示信息
  overLookSign = ref(props.overlookSign), // 俯瞰图是否打开
  imgListData = ref(props.imgListData || { list: [] }), // 当前页图片列表
  nowImgData = ref(props.nowImgData), // 当前选择的图片信息
  doneSign = ref(false),
  operationType = ref(""),
  carHead = ref(true), // 车头线
  focusMode = ref(false), // 聚焦模式
  helpList = reactive([
    {
      name: "--",
      key: "--",
    },
    {
      name: "十字",
      key: "十",
    },
    {
      name: "圆形",
      key: "圆",
    },
  ]),
  helpValue = ref("--"),
  filePageNum = ref(0),
  saveLoading = ref(false), // 是否正在保存中
  horizonSign = ref(true), // 地平线
  typelineNoX = ref(true); // typeline能都往x轴左侧移动标识
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_mark");
watch(
  [() => props.imgListData, () => props.nowImgData],
  ([imgListVal, nowImgDataVal]) => {
    imgListData.value = imgListVal;
    filePageNum.value = imgListVal.page;
    nowImgData.value = nowImgDataVal;
  }
);
// 操作页面提示
function handleTips(data: { sign: boolean; type: string }) {
  console.log(data, "data-----操作页面提示");
  if (!data.sign) {
    pageTips.value.sign = data.sign;
    return;
  }
  pageTips.value = {
    ...data,
  };
}
function handleHorizon(val) {
  ObserverInstance.emit(drawEvents.HANDKE_HORIZON_LINE, val);
}
function handleHeadLine(val) {
  ObserverInstance.emit(drawEvents.HANDLE_HEAD_LINE, val);
}
function closeFilesList(e) {
  if (e) return;
  document.getElementById("filesDOM")?.blur();
}
function saveData() {
  if (saveLoading.value) return;
  saveLoading.value = true;
  emits("saveData");
  saveLoading.value = false;
}
function selectImg(index) {
  emits("changeImg", index);
}

// 新建开始--展示done按钮，用来结束--polyline
function getAddSign(sign: string) {
  operationType.value = sign;
  doneSign.value = true;
}
// 结束新建
function addChartEnd() {
  doneSign.value = false;
  ObserverInstance.emit(drawEvents.ADD_NEW_END, operationType.value);
}
function getName(url: string) {
  if (!url || url.length === 0) return "";
  let result = url.split("/");
  return result[result.length - 1];
}
function handleOverLook(item) {
  // overLookSign.value = item;
  ObserverInstance.emit(drawEvents.CURVE_HANDLE_OVERLOOK, item);
}
// 改变X轴限制
function changeX(item) {
  ObserverInstance.emit(drawEvents.TYPELINE_NO_X, item);
}
// 控制聚焦模式
function handleFocusMode(e) {
  if (e === "4") {
    focusMode.value = !focusMode.value;
  } else {
    focusMode.value = e;
  }
  ObserverInstance.emit(drawEvents.HANDLE_FOCUS_MODE, {
    sign: focusMode.value,
    index: props.nowObjectIndex,
    a: "handleFocusMode",
  });
}
// 修改页码
function changeP(page: number) {
  emits("changePage", page);
}
// 选择辅助线
function handleHelp(e) {
  helpValue.value = e;
  ObserverInstance.emit(drawEvents.HELP_TYPE, e);
}
function handleShortCutHelp(key: string) {
  const keyObj = {
    1: "十",
  };
  let str = "--";
  if (helpValue.value !== keyObj[key]) {
    str = keyObj[key];
  }
  handleHelp(str);
}
</script>

<style lang="scss" scoped>
@import url("@/assets/css/draw.scss");
.top_nav {
  width: 100%;
  // background: #f1f3f4;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-bottom: 1px solid #dadce0;
  .nav_base_box {
    width: 100%;
    height: 35px;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background: linear-gradient(to right, #5c387f, #375a8d, #2477a5);
    // background: linear-gradient(to right, #409eff, #fff, #409eff);
    .logo_box {
      height: 35px;
      width: 35px;
      overflow: hidden;
      background: #545c64;
      padding: 5px 5px;
      box-sizing: border-box;
      flex-shrink: 0;
      .logo {
        height: 100%;
      }
    }
    .title {
      font-size: 18px;
      white-space: nowrap;
      height: 35px;
      display: flex;
      align-items: center;
      padding: 0 10px;
    }
    .save_btn {
      font-size: 16px;
      padding: 4px 8px;
      background-color: hsla(0, 0%, 100%, 0.1);
      color: #fff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 2px solid transparent;
      margin-left: 8px;
      font-weight: 600;
      .save_icon {
        margin-right: 5px;
        width: 20px;
      }
    }
    .save_btn:hover {
      background: hsla(0, 0%, 100%, 0.16);
    }
    .page_tips {
      height: 100%;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 8px;
      font-size: 15px;
      color: #fff;
      background: hsla(0, 0%, 100%, 0.1);
      // background: linear-gradient(
      //   to right,
      //   rgba(64, 158, 255, 0.3),
      //   hsla(0, 0%, 100%, 0.2),
      //   rgba(64, 158, 255, 0)
      // );
      .tip_icon {
        width: 22px;
        margin-right: 4px;
      }
      .tip_icon_loading {
        animation: turn 3s linear infinite;
      }
    }
    .back_btn {
      height: 100%;
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      padding: 0 8px;
      box-sizing: border-box;
      color: #fff;
      border-radius: 3px;
      cursor: pointer;
    }
    .back_btn:hover {
      background: hsla(0, 0%, 100%, 0.07);
    }
    .files_box {
      // width: 500px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .file_title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .file_title_id {
          margin-right: 20px;
        }
        .file_title_name {
          margin-right: 20px;
        }
        .file_title_icon {
          position: absolute;
          right: 10px;
        }
      }
      :deep(.el-dropdown) {
        width: 100%;
        height: 90%;
        .el-button--primary {
          background: rgba(153, 153, 153, 0.3);
          color: #fff;
          // color: rgb(112, 112, 112);
          border-color: rgba(153, 153, 153, 0.8);
          border-color: lightgray;
        }
        .el-button {
          height: 100%;
          width: 100%;
          font-weight: 600;
        }
      }
    }
  }
  .nav_operation_box {
    width: 100%;
    height: 40px;
    // height: 100%;
    display: flex;
    align-items: center;
    border-top: 1px solid #dadce0;
    box-sizing: border-box;
    padding-left: 10px;
    :deep(.el-checkbox) {
      margin: 0;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
    .help_tools {
      font-size: 14px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      :deep(.el-select) {
        width: 80px;
        height: 28px;
        margin-left: 8px;
        .el-input {
          height: 28px;
        }
      }
    }
    .base_btn {
      padding: 0 10px;
    }
    .btn_done {
      margin: 0 10px;
    }
    .nav_tools {
      width: 260px;
      padding: 5px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 100%;

      .nav_btn {
        width: 21px;
        height: 21px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 5px;
      }
      .nav_btn:hover {
        background-color: rgba(214, 206, 206, 0.5);
      }
      .btn_before {
        background-position: 0 -920px;
      }
      .btn_back {
        background-position: 0 -645px;
      }
      .btn_save {
        background-position: 0 -598px;
      }
    }
  }
}
.file_page_btns {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0 10px;
  position: relative;
  .file_page_text {
    padding: 0 5px;
    font-size: 14px;
  }
  :deep(.el-button) {
    margin: 0 10px;
  }
  .file_page_text_all {
    position: absolute;
    left: 10px;
    font-size: 12px;
    color: rgba(112, 112, 112, 0.7);
  }
  .file_page_center {
    display: flex;
    :deep(.el-button) {
      width: 70px;
    }
  }
}
:deep(.el-dropdown-menu__item) {
  // width: 500px;
  border-bottom: 1px solid #dadce0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px 30px 5px 10px;
  position: relative;
  .file_img_list_item_id {
    min-width: 240px;
    margin-right: 20px;
  }
  .file_img_list_item_name {
    min-width: 240px;
  }
  .file_img_list_item_icon {
    width: 20px;
    flex-shrink: 0;
    margin-left: 20px;
    position: absolute;
    right: 5px;
  }
}
:deep(.el-dropdown-menu__item:not(.is-disabled):focus) {
  background: rgb(228, 228, 228);
  color: #606266;
}
.nav_line {
  display: inline-block;
  width: 0;
  height: 100%;
  border-left: 1px solid rgba(214, 206, 206, 0.5);
  // margin: 0 5px;
}
@keyframes turn {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
