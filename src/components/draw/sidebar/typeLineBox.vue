<!--
 * @LastEditTime: 2023-07-03 16:05:55
 * @Description: 线段分割的画笔框
-->
<template>
  <div class="typeLine_box">
    <div class="typeLine_tool_top">
      <div class="typeLine_tool_selects brush_select">
        <div class="typeLine_tool_title">画笔</div>
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
          class="typeLine_tool_check"
          v-model="topSign"
          @change="selectTop"
          label="是否遮挡"
          :false-label="0"
          :true-label="1"
        />
      </div>
    </div>
    <div
      class="typeLine_tool_selects typeLine_tool_point"
      v-show="nowCircleData.pointsIndex != -1"
    >
      <div class="typeLine_tool_title">当前点</div>
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
        class="typeLine_tool_check"
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
import { ref, watch, inject, defineProps } from "vue";
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
  () => props.curvePointData,
  (val) => {
    nowCircleData.value = val;
  }
);
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
function delCircle() {
  ObserverInstance.emit(
    drawEvents.CURVE_DEL_CIRCLE,
    nowCircleData.value.pointsIndex
  );
}
</script>

<style lang="scss" scoped>
.typeLine_box {
  width: 100%;
  padding: 20px 10px 10px 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #dadce0;
  min-height: 77px;
  .typeLine_tool_top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .brush_select {
      box-sizing: border-box;
      padding: 10px;
      :deep(.el-input) {
        width: 100% !important;
      }
    }
  }
  .typeLine_tool_point {
    margin-top: 14px;
  }
  .typeLine_tool_selects {
    width: 100%;
    padding: 10px 5px;
    box-sizing: border-box;
    border: 1px solid #dadce0;
    border-radius: 4px;
    position: relative;
    display: flex;
    align-items: center;

    .typeLine_tool_title {
      display: inline-block;
      background: #f1f3f4;
      font-size: 14px;
      padding: 3px 5px;
      position: absolute;
      top: -12px;
      font-weight: 600;
    }
    .typeLine_tool_check {
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
