<!--
 * @LastEditTime: 2023-08-01 15:24:58
 * @Description: 工作流的控制面板
-->
<template>
  <facePlateBox
    id="WORK_BOX"
    title="工作流面板"
    DOMid="WORK_BOX"
    name="工作流"
    plateSign="work"
    showSign="workSign"
    :class="[
      'work_box',
      store.getTaskMove.work ? 'work_box_float' : 'work_box_fix',
    ]"
  >
    <div class="work_plate_main">
      <div class="comment_plate" v-if="activeIndex === 0">
        <emptyBox
          v-show="commentsList?.length <= 0"
          :text="`${workToolObj[props.nowContentType.type]} 暂无评论！`"
        />
        <div
          :class="[
            'comment_list',
            `comment_list_${currentStep}_${props.taskDetailData.status}`,
          ]"
          v-show="commentsList?.length > 0"
        >
          <div
            :class="[
              'comment_item',
              activeCommentIndex === index ? 'comment_item_active' : '',
            ]"
            v-for="(item, index) in commentsList"
            :key="uuidv4() + index"
            @click="chooseComment(item, index)"
          >
            <div
              class="deleta_btn"
              @click="delComment(index, item.id)"
              v-if="currentStep == 4 || currentStep == 6"
            >
              <Delete color="white" style="width: 1em; height: 1em" />
            </div>
            <div
              :class="['comment_item_item', `comment_item_item_${j}`]"
              v-for="(ele, j) in commentTable"
              :key="j"
            >
              <div class="item_name">
                {{ ele }}
                <yhIcon
                  class="remark_icon"
                  :openSign="item.openSign"
                  :w="15"
                  v-if="j === 'remark'"
                  @click="handleRemark(index, j, item.openSign)"
                />
                :
              </div>
              <div :class="['item_value', `item_key_${j}`]">
                {{ j === "tool" ? workToolObj[item[j]] : item[j] }}
              </div>
            </div>
          </div>
        </div>
        <div class="comment_box" v-show="currentStep == 4 || currentStep == 6">
          <el-input
            class="comment_input"
            v-model="textarea"
            maxlength="300"
            placeholder="请选择实例对象、输入评论"
            show-word-limit
            type="textarea"
            resize="none"
          />
          <div class="handle_box">
            <el-select
              v-show="props.nowContentType.type === 'laneline'"
              v-model="typeValue"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              />
            </el-select>
            <el-button
              type="primary"
              class="comment_btn"
              round
              @click="
                addComment(
                  typeValue === '对象'
                    ? props.nowData.objects[props.nowObjectIndex]?._id?.$oid
                    : props.nowData.groups[store.getNowDrawGroupsIndex]?._id
                        ?.$oid
                )
              "
            >
              确定
            </el-button>
          </div>
        </div>
      </div>
      <div class="img_plate" v-if="activeIndex === 1">
        <div
          :class="[
            'img_item',
            item.id === props.nowImgData?.id ? 'img_item_active' : '',
          ]"
          v-for="(item, index) in imgListData.list"
          @click.stop="selectImg(index)"
          :key="uuidv4() + index"
        >
          <div>{{ item?.basic.name }}</div>
          <div
            :class="['img_btn', `img_btn_${item.job.status}`]"
            :title="statusArr[item.job.status].tip"
            @click.stop="updataImg(item.job, index)"
          >
            <Check width="15px" :color="statusArr[item.job.status].color" />
          </div>
        </div>
        <div class="file_page_center">
          <el-button
            type="primary"
            :icon="ArrowLeft"
            :disabled="imgListData.page <= 1"
            @click="changeP(imgListData.page - 1)"
            size="small"
          >
            上一页
          </el-button>
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
        <div class="img_plate_tip">
          本模块用于标注人员记录当前图片标注是否完成~
        </div>
      </div>
      <taskWorkStep
        v-if="activeIndex === 2"
        :workFlowInfo="workFlowInfo"
        :currentStep="currentStep"
        :activeIndex="activeIndex"
        :sign="2"
        :seat="`detail`"
        :work_order_id="store.getDrawTaskData.work_order_id"
      />
      <taskHistory
        class="task_history"
        v-if="activeIndex === 3"
        :taskHistoryList="taskHistoryList"
      />
      <div class="work_plate_tabs">
        <div
          :class="[
            'work_plate_tab',
            activeIndex === index ? 'work_plate_tab_active' : '',
          ]"
          v-for="(item, index) in workTabs"
          :key="index + item"
          :title="item"
          v-show="
            item !== '工作栏' ||
            (item === '工作栏' &&
              (currentStep != 2 ||
                (currentStep == 2 && props.taskDetailData.status === 'redo')))
          "
          @click="handleTab(index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </facePlateBox>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, defineExpose } from "vue";
import { workToolObj } from "@/components/draw/drawData";
import { v4 as uuidv4 } from "uuid";
import {
  facePlateBox,
  yhIcon,
  taskWorkStep,
  taskHistory,
  emptyBox,
} from "@/components/draw/drawComponents";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
import { Delete, Check, ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import {
  saveComment,
  updataImgApi,
  getCommentDetailApi,
  delCommentApi,
} from "@/axios/markResultsView";
import { ElMessage } from "element-plus";
import { useStateStore } from "@/stores/state";
import { getTypeIndex } from "@/utils/util";

const props = defineProps([
  "nowContentType",
  "nowObjectIndex",
  "jobId",
  "nowData",
  "imgListData",
  "nowImgData",
  "pushSign",
  "taskDetailData",
  "nowImgIndex",
  "moveSign",
]);
const store = useStateStore();
const emits = defineEmits([
  "changePage",
  "changeImg",
  "saveData",
  "getTaskDetail",
]);

let observerListenerList = [
    { eventName: drawEvents.NOW_TYPE, fn: getNowType.bind(this) },
    { eventName: dataEvents.NO_ROLE_UPDATE, fn: updateNoRoleImg.bind(this) },
  ],
  imgListData: any = ref({
    list: [],
    total: 1,
    totalPage: 1,
    page: 1,
    pageSize: 10,
    sign: false,
    start: false,
  }),
  shapeType = ref(""),
  activeCommentIndex = ref(-1),
  textarea = ref(""),
  workTabs = ["工作栏", "当前工作流", "父工作流", "历史"],
  commentTable = {
    tool: "工具集",
    type: "类型",
    shape: "图形",
    remark: "评论",
  },
  statusArr = {
    0: {
      tip: "未完成，点击切换状态",
      color: "#409eff",
      message: "已切换至 未完成 状态！",
    },
    1: {
      tip: "已完成，点击切换状态",
      color: "#fff",
      message: "已切换至 已完成 状态！",
    },
    "-1": {
      tip: "被打回，点击切换状态",
      color: "#fff",
      message: "已切换至 被打回 状态！",
    },
  },
  typeOptions = ref([
    {
      key: "groups",
      value: "道路",
    },
    {
      key: "objects",
      value: "对象",
    },
  ]),
  typeValue = ref("对象"),
  commentsList: any = ref([]),
  currentStep = ref(0),
  taskHistoryList = ref([]),
  activeIndex = ref(0),
  workFlowInfo: any = ref([]);
defineExpose({
  saveCommentFun,
  typeValue,
  updataImg,
});
watch(
  () => props.imgListData,
  (val) => {
    imgListData.value = val;
  },
  { deep: true }
);
watch([() => props.nowContentType, () => props.jobId], ([val_type, val_id]) => {
  // console.log(val_type, val_id, "val-----nowContentType------------");
  if (val_type.id < 0 || !val_id) return;
  getCommentList();
});
watch(
  () => props.taskDetailData,
  (val) => {
    workFlowInfo.value = val.work_flow_info.work_flow_step;
    taskHistoryList.value = val.history;
    currentStep.value = val.current_step;
    activeIndex.value =
      val.current_step != 2 || (val.current_step == 2 && val.status === "redo")
        ? 0
        : 1;
  }
);
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_comment");
async function getCommentList() {
  try {
    const res = (await getCommentDetailApi({
      job_id: props.jobId,
      obj_id: props.nowContentType.id,
    })) as { code: number; data: any };
    if (res.code === 200) {
      commentsList.value = res.data || [];
    }
  } catch (err) {
    console.log(err, "err---getCommentList");
  }
}
// 添加评论
async function addComment(id) {
  if (props.nowObjectIndex < 0 && typeValue.value === "对象") {
    ElMessage({
      message: "请先选择一个实例对象!",
      type: "error",
    });
    return;
  }
  if (store.getNowDrawGroupsIndex < 0 && typeValue.value === "道路") {
    ElMessage({
      message: "请先选择一个道路!",
      type: "error",
    });
    return;
  }
  if (props.pushSign) {
    emits("saveData", "reviewer");
  } else {
    saveCommentFun(id);
  }
}
async function saveCommentFun(id) {
  // console.log(id, "====target_id");

  let comment = {
    obj_id: props.nowContentType.id,
    job_id: props.jobId,
    tool: props.nowContentType.type,
    shape: shapeType.value,
    remark: textarea.value,
    type: typeValue.value,
    target_id: id,
  };
  commentsList.value.push(comment);
  const res = await saveComment(comment);
  console.log(res, "res");
  textarea.value = "";
  getCommentList();
}
// 选择评论--根据评论信息对应到实例对象
function chooseComment(item, index) {
  if (activeCommentIndex.value === index) return;
  activeCommentIndex.value = index;
  if (item.type === "对象") {
    const index = props.nowData.objects.findIndex((ele) => {
      return ele._id.$oid === item.target_id;
    });
    ObserverInstance.emit(dataEvents.GET_NOW_OBJECT_DATA, index);
  } else {
    const index = props.nowData.groups.findIndex((ele) => {
      return ele._id.$oid === item.target_id;
    });
    ObserverInstance.emit(dataEvents.GET_NOW_GROUP_DATA, index);
  }
}
// 删除评论
async function delComment(index, id) {
  console.log(index, "item---del");
  try {
    const res = (await delCommentApi({ id: id })) as { code: number };
    if (res.code === 200) {
      ElMessage({
        message: `删除评论成功！`,
        type: "success",
      });
      commentsList.value.splice(index, 1);
      activeCommentIndex.value = -1;
    }
  } catch (err) {
    console.log(err, "err---删除评论");
  }
}
// 更新图片状态
async function updataImg(item, index) {
  // console.log(item, index, "item, index");
  if (currentStep.value == 7) return;
  const jobStatus = {
    0: 1,
    1: 0,
    "-1": 1,
  };
  const res: { code: number; message: string } = (await updataImgApi({
    id: item.id,
    status: jobStatus[item.status],
  })) as { code: number; message: string };
  if (res.code === 200) {
    ElMessage({
      message: `${statusArr[jobStatus[item.status]].message}`,
      type: "success",
    });
    imgListData.value.list[index].job.status = jobStatus[item.status];
  } else {
    ElMessage({
      message: res.message,
      type: "error",
    });
  }
}
// 用户无查看图片权限时，将该图片的工作状态改为完成
function updateNoRoleImg() {
  if (props.nowImgData.job.status) return;
  updataImg(props.nowImgData.job, props.nowImgIndex);
}
// 获取当前操作的图形的类型
function getNowType(type: string, index: any, sign) {
  shapeType.value = type;
}
function handleRemark(index, sign, openSign) {
  commentsList.value[index][sign].openSign = !openSign;
}
function handleTab(index) {
  if (activeIndex.value === index) return;
  activeIndex.value = index;
}
// 修改页码
function changeP(page: number) {
  emits("changePage", page);
}
// 切换图片
function selectImg(index) {
  emits("changeImg", index);
}
</script>

<style lang="scss" scoped>
.work_box {
  width: 400px;
  box-sizing: border-box;
  flex-shrink: 0;
  position: absolute;
  border-radius: 0 8px 8px 0 !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  top: 0px;
  left: 72px;
  z-index: 200;
  transform: translate3d(0, 0, 1px);

  .work_plate_main {
    width: 100%;
    display: flex;
    flex-direction: column;
    .comment_plate {
      width: 100%;
      height: calc(100% - 40px);
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      .empty_box {
        height: 100%;
      }
      .comment_list {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        .comment_item {
          width: 96%;
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          padding: 15px 10px;
          margin: 4px;
          position: relative;
          border-radius: 4px;
          .comment_item_item {
            min-width: 100px;
            display: flex;
            margin-right: 8px;
            margin-bottom: 8px;
            .item_name {
              margin-right: 5px;
              padding: 0 5px;
              font-size: 16px;
              font-weight: 600;
              flex-shrink: 0;
              display: flex;
              .remark_icon {
                margin-left: 0px;
              }
            }
            .item_value {
              height: 100%;
              display: flex;
              align-items: center;
              font-size: 14px;
              word-wrap: break-word;
              word-break: break-all;
            }
          }
          .comment_item_item_remark {
            width: 100%;
            flex-shrink: 0;
            margin-top: 2px;
            margin-bottom: 0 !important;
            .item_key_remark {
              line-height: 20px;
              position: relative;
              text-align: justify;
            }
          }
          .deleta_btn {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #f56c6c;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
            margin-left: 10px;
            position: absolute;
            top: 10px;
            right: 10px;
          }
        }
        .comment_item_active {
          position: relative;
        }
        .comment_item_active::after {
          position: absolute;
          content: "";
          width: 2px;
          height: 100%;
          background: #f56c6c;
          left: 0;
          top: 0;
          border-radius: 100px 0 0 100px;
        }
      }

      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-thumb {
        width: 100%;
        border-radius: 4px;
        background: rgba(64, 158, 255, 0.6);
      }
      ::-webkit-scrollbar-track {
        background: rgba(153, 153, 153, 0.5);
      }
      ::-webkit-scrollbar-button {
        display: none;
      }
      .comment_box {
        width: calc(100%);
        min-height: 100px;
        display: flex;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: end;
        padding: 10px;
        .handle_box {
          width: 80px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: 100%;
        }
        .comment_input {
          height: 100%;
          width: calc(100% - 20px);
        }
        :deep(.el-textarea__inner) {
          height: 100%;
          width: 100%;
        }
        :deep(.el-input__count) {
          background: hsl(210, 92%, 70%);
          color: #fff;
          padding: 0 4px;
          border-radius: 4px;
        }
      }
      .comment_list_2_redo {
        height: 100% !important;
      }
    }
    .img_plate {
      width: 100%;
      box-sizing: border-box;
      position: relative;
      .img_item {
        width: 100%;
        height: 40px;
        padding: 5px 10px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        .img_btn {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid #409eff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 10px;
          cursor: pointer;
        }
        .img_btn_1 {
          background: #409eff;
        }
        .img_btn_-1 {
          background: #e6a23c;
          border-color: #e6a23c;
        }
      }
      .file_page_center {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        .file_page_text {
          font-size: 14px;
          margin: 0 6px;
        }
        :deep(.el-button) {
          width: 70px;
          margin: 5px;
        }
      }
      .img_plate_tip {
        width: 100%;
        font-size: 14px;
        padding-bottom: 10px;
        text-align: center;
        position: absolute;
        bottom: 0;
      }
    }
    .task_history {
      height: calc(100% - 40px);
      overflow-y: auto;
    }
    .work_plate_tabs {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      box-sizing: border-box;
      .work_plate_tab {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .work_plate_tab:last-child {
        border-right: none;
      }
    }
  }
}
.work_box_fix {
  height: 100%;
  background: rgba(37, 38, 39);
  :deep(.face_plate_title) {
    color: #fff !important;
  }
  :deep(.empty_box) {
    color: rgba(255, 255, 255, 0.8);
  }
  .work_plate_main {
    height: calc(100% - 36px);
    .task_history_box {
      :deep(.el-timeline-item__content) {
        color: #fff;
      }
    }
    .comment_plate {
      .comment_item {
        color: #fff;
        background: hsla(0, 0%, 100%, 0.07);
      }
      .comment_item_active {
        background: hsla(0, 0%, 100%, 0.2);
        color: #fff;
        -webkit-tap-highlight-color: transparent;
      }
      .comment_box {
        background: hsla(0, 0%, 100%, 0.1);
      }
    }
  }
  .img_plate {
    height: 100%;
    .img_item {
      color: #fff !important;
    }
    .img_item:hover {
      background: hsla(0, 0%, 100%, 0.1);
    }
    .img_item_active {
      background: #fff !important;
      font-weight: 800;
      color: rgba(37, 38, 39) !important;
    }
    .file_page_center {
      color: rgba(255, 255, 255, 0.8);
    }
    .img_plate_tip {
      color: rgba(255, 255, 255, 0.6) !important;
    }
  }
  .work_plate_tabs {
    color: #fff;
    .work_plate_tab:hover {
      background: hsla(0, 0%, 100%, 0.06);
    }
    .work_plate_tab_active {
      position: relative;
      background: hsla(0, 0%, 100%, 0.1);
    }
    .work_plate_tab_active::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 2px;
      border-radius: 3px;
      background: #fff;
      bottom: 0;
      left: 0;
    }
  }
}
.work_box_float {
  border-radius: 8px !important;
  box-shadow: 2px 2px 10px rgb(112, 112, 112), -2px -2px 10px rgb(148, 146, 146);
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: #f1f3f4;
  color: rgb(112, 112, 112);
  color: #666;
  .comment_plate {
    .comment_item {
      background: hsla(0, 0%, 89%, 0.9);
    }
    .comment_item_active {
      background: hsla(0, 0%, 81%, 0.9);
      position: relative;
    }
    .comment_box {
      background: linear-gradient(to bottom, rgba(64, 158, 255, 0.5), #fff);
    }
  }
  .work_plate_main {
    height: calc(100vh - 196px);
  }
  .img_plate {
    height: calc(100% - 40px);
    .img_item {
      color: #000 !important;
    }
    .img_item:hover {
      background: rgba(37, 38, 39, 0.1);
    }
    .img_item_active {
      background: rgb(228, 228, 228);
      font-weight: 600;
    }
    .file_page_center {
      color: rgba(0, 0, 0, 0.8);
    }
    .img_plate_tip {
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .work_plate_tabs {
    color: rgb(112, 112, 112);
    border-color: lightgray;
    .work_plate_tab {
      border-color: lightgray;
      box-shadow: inset 0.2rem 0.2rem 0.4rem #d5e0f3,
        inset -0.3rem -0.3rem 0.4rem #ffffff;
    }
    .work_plate_tab_active {
      border-color: lightgray;
      background: rgba(112, 112, 112, 0.2);
      box-shadow: 0.3rem 0.3rem 0.6rem #c1d9f0, -0.2rem -0.2rem 0.5rem #ffffff;
      box-shadow: inset 2px 2px 8px #d5e0f3, inset -4px -4px -8px #ffffff;
      background: linear-gradient(-25deg, rgb(203, 225, 247) 0%, #409eff 100%);
      color: #fff;
    }
  }
}
</style>
