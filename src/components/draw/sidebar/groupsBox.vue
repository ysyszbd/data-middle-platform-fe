<!--
 * @LastEditTime: 2023-07-18 14:58:10
 * @Description: 用于显示实例对象需要额外添加的属性、车道线的道路、车位等。
-->
<template>
  <facePlateBox
    :class="[
      'curve_roads_box',
      store.getTaskMove.group ? 'box_float' : 'box_fix',
    ]"
    id="groupBox"
    DOMid="groupBox"
    title="groups面板"
    :name="`${groupsSetData.category}列表`"
    plateSign="group"
    showSign="groupSign"
  >
    <div class="group_top" v-if="props.currentStep != 7">
      <div class="group_option">
        <div
          class="curve_tool_selects road_select"
          v-for="(item, index) in groupsSetData.setting_keys"
          :key="index"
        >
          <div class="curve_tool_title">
            {{ item.name }}
          </div>
          <el-select
            v-model="road"
            class="m-2"
            placeholder="Select"
            v-if="item.type === 'select'"
          >
            <el-option
              v-for="(item, i) in groupsSetData.setting_values[index]"
              :key="i"
              :label="item"
              :value="i"
              @click="changeAddRoad(item, i)"
            />
          </el-select>
          <el-checkbox
            v-if="item.type === 'radio'"
            v-model="radio"
            :label="'已' + item.name"
            :true-label="1"
            :false-label="0"
          />
        </div>
      </div>
      <!-- <img src="./1.png" alt=""> -->
      <div
        class="laneline_btns groups_btns"
        v-show="props.nowContentType === 'laneline'"
      >
        <div type="primary" class="road_btn" @click="addRoad">添加道路</div>
        <div type="primary" class="road_btn" @click="addLine">添加线</div>
      </div>
      <div
        class="tool2_btns groups_btns"
        v-show="props.nowContentType === 'tool2'"
      >
        <div type="primary" class="road_btn" @click="addRoad">添加车位组</div>
        <div type="primary" class="road_btn" @click="addLine">对象->车位组</div>
      </div>
    </div>
    <div class="group_list">
      <div
        v-for="(item, index) in groupsList"
        :key="`group` + index"
        @click="selectGroup(index)"
        :class="['group_item', groupIndex === index ? 'group_item_active' : '']"
      >
        <span class="group_item_index">{{ index }}.</span>
        <el-select
          v-model="item.category"
          class="group_item_select"
          placeholder="Select"
          size="small"
          :disabled="props.currentStep == 7"
          v-if="props.nowContentType === 'laneline'"
        >
          <el-option
            v-for="(item, i) in groupsSetData.setting_values[0]"
            :key="i"
            :label="item"
            :value="i"
            @click="changeRoad(item, i, index)"
          />
        </el-select>
        <el-select
          v-model="item.property[0]"
          class="group_item_select_tool2"
          placeholder="Select"
          :disabled="props.currentStep == 7"
          v-if="props.nowContentType === 'tool2'"
        >
          <el-option
            v-for="(item, i) in groupsSetData.setting_values[0]"
            :key="i"
            :label="item"
            :value="i"
            @click="changeRoad(item, i, index)"
          />
        </el-select>

        <div class="group_item_park" v-if="props.nowContentType === 'tool2'">
          <el-select
            v-model="item.property[1]"
            placeholder="Select"
            :disabled="props.currentStep == 7"
            v-if="props.nowContentType === 'tool2'"
          >
            <el-option
              v-for="(item, i) in groupsSetData.setting_values[1]"
              :key="i"
              :label="item"
              :value="i"
              @click="changeRoad(item, i, index)"
            />
          </el-select>
        </div>
        <div class="group_item_lines">
          {{
            props.nowContentType === "laneline"
              ? `lines: ${item?.lines?.toString()}`
              : `${item?.objects_id?.toString()}`
          }}
        </div>
        <el-dropdown class="handle_btn" v-if="props.currentStep != 7">
          <el-button type="primary" round size="small">
            操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @mousedown.stop="refreshGroup(index)">
                <Refresh
                  color="#E6A23C"
                  width="1em"
                  class="dropdown_icon"
                />清空
              </el-dropdown-item>
              <el-dropdown-item @mousedown.stop="delGroup(index)">
                <Delete color="#F56C6C" width="1em" class="dropdown_icon" />删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </facePlateBox>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from "vue";
import { useStateStore } from "@/stores/state";
import { Delete, Refresh, ArrowDown } from "@element-plus/icons-vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
import { ElMessage } from "element-plus";
import { roadsList } from "@/components/draw/drawData";
import { facePlateBox } from "@/components/draw/drawComponents";

const store = useStateStore();
const props = defineProps([
  "nowContentType",
  "nowObjectIndex",
  "nowData",
  "currentStep",
  "groupsSetData",
]);
const emits = defineEmits(["handleGroup"]);
let observerListenerList = [
    { eventName: dataEvents.GET_NOW_GROUP_DATA, fn: selectGroup.bind(this) },
  ],
  road = ref(),
  radio = ref(),
  groupsSetData = ref({
    category: "",
    setting_keys: [],
    setting_values: [],
  }),
  groupIndex = ref(-1),
  groupsList: any = ref([]);
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_groups");
watch(
  () => props.nowContentType,
  (val) => {
    groupIndex.value = -1;
  }
);
watch(
  () => props.groupsSetData,
  (val) => {
    if (val == undefined) {
      groupsSetData.value = {
        category: "",
        setting_keys: [],
        setting_values: [],
      };
      return;
    }
    groupsSetData.value = val;
    if (val.setting_keys.length > 0) {
      const selectIndex = val.setting_keys.findIndex((item) => {
        return item.type === "select";
      });
      if (selectIndex >= 0) {
        road.value = 0;
      }
      const radioIndex = val.setting_keys.findIndex((item) => {
        return item.type === "radio";
      });
      if (radioIndex >= 0) {
        radio.value = 0;
      }
    }
  }
);
watch(
  () => props.nowData,
  (val) => {
    groupsList.value = val?.groups;
    if (groupsList.value.length > 0) {
      val?.groups.forEach((item, index) => {
        if (props.nowContentType === "laneline" && item.lines.length > 0) {
          handleRoad(item, index, val?.objects);
        }
        if (props.nowContentType === "tool2" && item.objects_id.length > 0) {
          handleParkGroups(item, index, val?.objects);
        }
        ObserverInstance.emit(drawEvents.HANDLE_FOCUS_MODE, {
          sign: null,
          index: props.nowObjectIndex,
          a: "watch--",
        });
      });
    }
  },
  {
    deep: true,
  }
);
function selectGroup(index) {
  if (groupIndex.value === index) return;
  groupIndex.value = index;
  store.setNowDrawGroupsIndex(groupIndex.value);
  if (props.nowContentType === "laneline") {
    store.setDrawGroupsLines(groupsList.value[groupIndex.value].lines);
  }
  if (props.nowContentType === "tool2") {
    ObserverInstance.emit(
      drawEvents.TOOL2_CHANGE_INDEX,
      groupsList.value[groupIndex.value]
    );
  }
  ObserverInstance.emit(drawEvents.HANDLE_FOCUS_MODE, {
    sign: null,
    index: -1,
    a: "selectGroup",
  });
}
function refreshGroup(index) {
  selectGroup(index);
  if (props.nowContentType === "laneline") {
    groupsList.value[groupIndex.value].lines = [];
    ObserverInstance.emit(drawEvents.CURVE_CLEAR_ROAD_DOM, index);
  }
  if (props.nowContentType === "tool2") {
    groupsList.value[groupIndex.value].objects_id = [];
    ObserverInstance.emit(
      drawEvents.TOOL2_CHANGE_INDEX,
      groupsList.value[index]
    );
    ObserverInstance.emit(drawEvents.TOOL2_CLEAR_PARK_DOM, index);
  }
  emits("handleGroup", {
    groupIndex: groupIndex.value,
    sign: "one",
    groupData: groupsList.value[groupIndex.value],
  });
}
async function delGroup(index) {
  selectGroup(index);
  groupsList.value.splice(index, 1);
  if (props.nowContentType === "laneline") {
    ObserverInstance.emit(drawEvents.CURVE_CLEAR_ROAD_DOM, index);
  }
  if (props.nowContentType === "tool2") {
    ObserverInstance.emit(
      drawEvents.TOOL2_CHANGE_INDEX,
      groupsList.value[index]
    );
    ObserverInstance.emit(drawEvents.TOOL2_CLEAR_PARK_DOM, index);
  }
  emits("handleGroup", { groups: groupsList.value, sign: "all" });
}
function addRoad() {
  if (props.nowContentType === "laneline") {
    groupsList.value.push({
      lines: [],
      category: road.value,
    });
  }
  if (props.nowContentType === "tool2") {
    groupsList.value.push({
      objects_id: [],
      property: [road.value, radio.value],
    });
  }
  groupIndex.value = groupsList.value.length - 1;
  store.setNowDrawGroupsIndex(groupIndex.value);
  store.setDrawGroupsLines([]);
  ObserverInstance.emit(drawEvents.HANDLE_FOCUS_MODE, {
    sign: null,
    index: -1,
    a: "addRoad",
  });
  emits("handleGroup", { groups: groupsList.value, sign: "all" });
}
function addLine() {
  if (
    groupsList.value.length <= 0 ||
    props.nowObjectIndex < 0 ||
    groupIndex.value < 0
  )
    return;
  let res: any = -1,
    arr: number[] = [];
  if (props.nowContentType === "laneline") {
    arr = groupsList.value[groupIndex.value].lines;
  }
  if (props.nowContentType === "tool2") {
    arr = groupsList.value[groupIndex.value].objects_id;
    if (arr.length > 3) return;
  }
  res = arr.find((item) => {
    return item === props.nowObjectIndex;
  });
  if (res < 0 || res === undefined) {
    arr.push(props.nowObjectIndex);
    if (props.nowContentType === "laneline") {
      store.setDrawGroupsLines(groupsList.value[groupIndex.value].lines);
      handleRoad(
        groupsList.value[groupIndex.value],
        groupIndex.value,
        props?.nowData.objects
      );
    }
    if (props.nowContentType === "tool2") {
      handleParkGroups(
        groupsList.value[groupIndex.value],
        groupIndex.value,
        props?.nowData.objects
      );
    }
  } else {
    ElMessage({
      message: "已添加过",
      type: "warning",
      duration: 700,
    });
    return;
  }
  ObserverInstance.emit(drawEvents.HANDLE_FOCUS_MODE, {
    sign: null,
    index: -1,
    a: "addRoad",
  });
  emits("handleGroup", {
    groupIndex: groupIndex.value,
    sign: "one",
    groupData: groupsList.value[groupIndex.value],
  });
}
function handleParkGroups(groupItem, groupIndex, objects) {
  if (groupItem.objects_id.length === 2) {
    const points = [
      ...objects[groupItem.objects_id[0]].shapes[0].points,
      objects[groupItem.objects_id[1]].shapes[0].points[1],
      objects[groupItem.objects_id[1]].shapes[0].points[0],
    ];
    ObserverInstance.emit(drawEvents.TOOL2_DRAW_POLYGON, {
      groupIndex,
      parkType: groupItem.property[0],
      points,
    });
  } else {
    ObserverInstance.emit(drawEvents.TOOL2_CLEAR_PARK_DOM, groupIndex);
  }
}
function handleRoad(groupItem, groupIndex, objects) {
  if (!groupItem.lines.length) return;
  let linePoints,
    x = 0,
    y = 0;
  let allX0 = 0,
    allY0 = 0,
    allX1 = 0,
    allY1 = 0;
  objects[groupItem.lines[0]].points.forEach((item, i) => {
    allX0 = allX0 + item[0];
    allY0 = allY0 + item[1];
  });
  objects[groupItem.lines[groupItem.lines.length - 1]].points.forEach(
    (item, i) => {
      allX1 = allX1 + item[0];
      allY1 = allY1 + item[1];
    }
  );
  linePoints = [
    [
      allX0 / objects[groupItem.lines[0]].points.length,
      allY0 / objects[groupItem.lines[0]].points.length,
    ],
    [
      allX1 /
        objects[groupItem.lines[groupItem.lines.length - 1]].points.length,
      allY1 /
        objects[groupItem.lines[groupItem.lines.length - 1]].points.length,
    ],
  ];
  x =
    (linePoints[linePoints.length - 1][0] - linePoints[0][0]) / 2 +
    linePoints[0][0];
  y =
    (linePoints[linePoints.length - 1][1] - linePoints[0][1]) / 2 +
    linePoints[0][1];
  ObserverInstance.emit(
    drawEvents.CURVE_HANDLE_ROAD,
    [x, y],
    groupIndex,
    roadsList[groupsList.value[groupIndex].category],
    groupsList.value[groupIndex].lines.length,
    linePoints,
    groupItem.lines
  );
}
function changeRoad(item, index, groupIndex) {
  if (props.nowContentType === "tool2") {
    ObserverInstance.emit(drawEvents.TOOL2_CLEAR_PARK_DOM, groupIndex);
  } else {
    ObserverInstance.emit(drawEvents.CURVE_CLEAR_ROAD_DOM, groupIndex.value);
  }
  emits("handleGroup", {
    groupIndex: groupIndex.value,
    sign: "one",
    groupData: groupsList.value[groupIndex.value],
  });
}
function changeAddRoad(item, index) {
  console.log(item, index, "------------");
}
</script>

<style lang="scss" scoped>
.curve_roads_box {
  width: 400px;
  // max-height: calc(100vh - 196px);
  position: absolute;
  left: 72px;
  top: 0px;
  z-index: 240;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 10px;
  .group_top {
    width: 98%;
    padding: 15px 10px 5px 10px;
    box-sizing: border-box;
    .group_option {
      width: 100%;
      display: flex;
      align-items: center;
    }
    .curve_tool_selects {
      width: 95%;
      padding: 10px 5px;
      box-sizing: border-box;
      border: 1px solid #dadce0;
      border-radius: 4px;
      position: relative;
      display: flex;
      align-items: center;
      .curve_tool_title {
        display: inline-block;
        background: #f1f3f4;
        font-size: 14px;
        padding: 3px 5px;
        position: absolute;
        top: -12px;
        font-weight: 600;
      }
      .curve_tool_check {
        margin-left: 20px;
        height: 100% !important;
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
        right: 10px;
      }
    }
    .groups_btns {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 5px;
      .road_btn {
        width: 80%;
        background: #409eff;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        height: 22px;
        white-space: nowrap;
        cursor: pointer;
        color: #fff;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        transition: 0.1s;
        padding: 8px 15px;
        border-radius: 4px;
        font-size: 14px;
        margin: 5px;
      }
    }
    .tool2_btns {
      width: 100%;
      flex-shrink: 0;
    }
  }
  .road_select {
    width: 50%;
    margin: 0 4px;
  }
  .group_list {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    // border-top: 1px solid #dadce0;

    .group_item {
      width: 95%;
      padding: 10px 5px;
      box-sizing: border-box;
      font-size: 14px;
      color: rgb(112, 112, 112);
      display: flex;
      align-items: center;
      position: relative;
      // border-bottom: 1px solid #dadce0;
      border-radius: 4px;
      background: hsla(0, 0%, 100%, 0.07);
      margin: 4px 0;
      cursor: pointer;
      .handle_btn {
        width: 60px;
        position: absolute;
        right: 10px;
      }
      .group_item_index {
        margin-right: 5px;
      }
      .group_item_select {
        width: 35%;
      }
      .group_item_select_tool2 {
        width: 60px;
      }
      .group_item_lines {
        margin-left: 5px;
        width: 94px;
      }
      .group_item_park {
        margin-left: 5px;
        :deep(.el-select) {
          width: 88px;
        }
      }
    }
    .group_item_active {
      background: rgb(228, 228, 228);
      position: relative;
    }
    .group_item_active::after {
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
    background: var(--scroll-thumb-bg);
  }
  ::-webkit-scrollbar-track {
    background: var(--scroll-track-bg);
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
}
.box_float {
  box-shadow: 0 0 1em rgb(112, 112, 112);
  background-color: #f1f3f4;
  height: calc(100vh - 196px);
  .group_top {
    border-bottom: 1px solid #dadce0;
    margin-top: 4px;
  }
  .group_list {
    .group_item {
      background: rgb(228, 228, 228);
    }
  }
}
.box_fix {
  height: 100%;
  width: 400px;
  top: 0;
  background: rgba(37, 38, 39);
  border-radius: 0 8px 8px 0 !important;
  color: #fff;
  :deep(.face_plate_title) {
    color: #fff !important;
    flex-shrink: 0;
  }
  :deep(.empty_box) {
    color: rgba(255, 255, 255, 0.8);
  }
  :deep(.el-checkbox__label) {
    color: #fff !important;
  }
  .group_top {
    width: 95%;
    background: hsla(0, 0%, 100%, 0.2) !important;
    color: #fff !important;
    border: 1px solid rgba(255, 255, 255, 0.298);
    margin: 6px 0;
    border-radius: 4px;
    .curve_tool_selects {
      border: 2px dashed hsla(0, 0%, 100%, 0.3);
      .curve_tool_title {
        background: hsla(0, 0%, 100%, 0.2) !important;
      }
    }
  }
  .group_list {
    .group_item {
      color: #fff;
      background: hsla(0, 0%, 100%, 0.07);
    }
    .group_item {
      background: hsla(0, 0%, 100%, 0.2);
      color: #fff;
      -webkit-tap-highlight-color: transparent;
    }
  }
}
</style>
