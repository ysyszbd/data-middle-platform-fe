<!--
 * @LastEditTime: 2023-07-20 14:02:03
 * @Description: 车道线的画笔选择框
-->
<template>
  <div class="curve_box">
    <div class="curve_tool_top">
      <div class="curve_tool_selects brush_select">
        <div class="curve_tool_title">画笔</div>
        <el-select
          v-model="brush"
          class="m-2"
          placeholder="Select"
          size="small"
        >
          <el-option
            v-for="(item, index) in curveSettings.type"
            :key="item.name"
            :label="item.name"
            :value="item.name"
            @click="changeBrush(item, index)"
          />
        </el-select>
        <el-checkbox
          class="curve_tool_check"
          v-model="topSign"
          @change="selectTop"
          label="最顶层"
          :false-label="0"
          :true-label="1"
        />
      </div>
      <div class="curve_tool_selects top_select">
        <div class="curve_tool_title">车道线颜色</div>
        <el-select
          v-model="color"
          class="m-2"
          placeholder="请选择线颜色"
          size="small"
          @change="changeColor($event, true)"
          :disabled="props.nowObjectIndex < 0"
        >
          <el-option
            v-for="(item, index) in colorList"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>
    <div
      class="curve_tool_selects curve_tool_point"
      v-show="nowCircleData.pointsIndex != -1"
    >
      <div class="curve_tool_title">当前点</div>
      <el-select
        v-model="nowCircleData.brushName"
        class="m-2"
        placeholder="Select"
        size="small"
      >
        <el-option
          v-for="(item, index) in curveSettings.type"
          :key="item"
          :label="item.name"
          :value="item.name"
          @click="changeName(item, index)"
        />
      </el-select>
      <el-checkbox
        class="curve_tool_check"
        v-model="nowCircleData.topSign"
        label="最顶层"
        :false-label="0"
        :true-label="1"
        @change="changeTop"
      />
      <div class="deleta_btn" @click="delCircle">
        <Delete color="white" style="width: 1em; height: 1em" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, defineProps, defineExpose } from "vue";
import { useStateStore } from "@/stores/state";
import { Delete } from "@element-plus/icons-vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents } from "@/components/draw/event/events";

const store = useStateStore();
const props = defineProps([
  "nowObjectIndex",
  "color",
  "curvePointData",
  "nowContentType",
]);
const SETTINGS: any = inject("SETTINGS");
const CURVE: any = inject("CURVE");
let curveSettings: any = ref([]),
  curveIndex = ref(0),
  topSign = ref(0),
  colorList = ["--", "黄", "白", "蓝"],
  color = ref("--"),
  nowCircleData = ref({
    pointsIndex: -1,
    topSign: 0,
    brushName: "",
  }),
  brush = ref({});
defineExpose({ color });
watch(
  () => props.nowContentType,
  (val) => {
    if (val !== "laneline") return;
    curveSettings.value = SETTINGS.settingData.value.objects[0];
    console.log(curveSettings.value, "val");
    changeBrush(curveSettings.value.type[0], 0);
  },
  { immediate: true }
);
watch(
  () => props.color,
  (val) => {
    color.value = val;
    ObserverInstance.emit(drawEvents.CURVE_CHANGE_COLOR, val);
  },
  { immediate: true }
);
watch(
  () => props.curvePointData,
  (val) => {
    nowCircleData.value = val;
  }
);
changeColor(color.value, false);
function changeTop(e) {
  ObserverInstance.emit(drawEvents.CURVE_CHANGE_CIRCLE_DATA, {
    sign: "最顶层",
    value: e,
    objectsIndex: props.nowObjectIndex,
    pointsIndex: nowCircleData.value.pointsIndex,
  });
}
function changeName(item, index) {
  ObserverInstance.emit(drawEvents.CURVE_CHANGE_CIRCLE_DATA, {
    sign: "点类型",
    value: index,
    objectsIndex: props.nowObjectIndex,
    pointsIndex: nowCircleData.value.pointsIndex,
  });
}
function changeBrush(item, index) {
  brush.value = item.name;
  curveIndex.value = index;
  store.setDrawBrushData([index, topSign.value]);
}
function selectTop(e) {
  store.setDrawBrushData([curveIndex.value, topSign.value]);
}
function changeColor(e, sign) {
  // 如果在未选择实例对象的情况下修改线的颜色，则sign=false，不触发修改线颜色方法。
  if (props.nowObjectIndex < 0 || props.nowObjectIndex === null) sign = false;
  if (sign) {
    CURVE.changeCurveColor(e);
  }
  ObserverInstance.emit(drawEvents.CURVE_CHANGE_COLOR, e);
}
function delCircle() {
  ObserverInstance.emit(
    drawEvents.CURVE_DEL_CIRCLE,
    nowCircleData.value.pointsIndex
  );
}
</script>

<style lang="scss" scoped>
.curve_box {
  width: 98%;
  padding: 20px 10px 10px 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #dadce0;
  margin-bottom: 6px;
  border-radius: 4px;
  .curve_tool_top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .brush_select {
      :deep(.el-input) {
        width: 100% !important;
      }
    }
    .top_select {
      width: 35% !important;
      flex-shrink: 0;
      margin-left: 10px;
    }
  }
  .curve_tool_point {
    margin-top: 14px;
  }
  .curve_tool_selects {
    width: 100%;
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
}
</style>
