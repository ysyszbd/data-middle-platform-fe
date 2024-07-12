<!--
 * @LastEditTime: 2023-07-17 15:45:40
 * @Description: typeline的点类型选择框
 * 
-->
<template>
  <div class="point_detail">
    <div class="typeLine_tool_selects brush_select">
      <div class="typeLine_tool_title">画笔</div>
      <el-select
        v-model="brushData.brush"
        class="m-2"
        placeholder="Select"
        size="small"
      >
        <el-option
          v-for="item in colorList"
          :key="item.type"
          :label="item.type"
          :value="item.type"
          class="point_detail_option"
          @click="changeBrush(item)"
        >
          <span>{{ item.type }}</span>
          <span
            class="color_tip"
            :style="`background-color: ${item.color};`"
          ></span>
        </el-option>
      </el-select>
      <el-checkbox
        class="typeLine_tool_check"
        v-model="brushData.cover"
        label="是否遮挡"
        :false-label="0"
        :true-label="1"
        @change="initCover"
      />
    </div>
    <div class="typeLine_tool_selects" v-show="pointData?.pointsIndex >= 0">
      <div class="typeLine_tool_title">当前点</div>
      <el-select
        v-model="pointData.type"
        class="m-2"
        placeholder="请选择点类别"
      >
        <el-option
          v-for="item in colorList"
          :key="item.type"
          :label="item.type"
          :value="item.type"
          class="point_detail_option"
          @click="changeType(item)"
        >
          <span>{{ item.type }}</span>
          <span
            class="color_tip"
            :style="`background-color: ${item.color};`"
          ></span>
        </el-option>
      </el-select>
      <el-checkbox
        class="typeLine_tool_check"
        v-model="pointData.covered"
        label="是否遮挡"
        :false-label="0"
        :true-label="1"
        @change="changeCover"
      />
      <div class="deleta_btn" @click="delCircle(pointData)">
        <Delete color="white" style="width: 1em; height: 1em" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents } from "@/components/draw/event/events";
import { defineProps, ref, watchEffect } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { useStateStore } from "@/stores/state";
import setData from "@/components/draw/setting.json";

const store = useStateStore();
const props = defineProps(["pointData"]);
let colorList = (setData["typeLine"] as any).objects[0]?.typesList || [],
  brushData = ref({
    brush: colorList[0].type,
    cover: 0,
  }),
  pointData: any = ref({
    pointsIndex: -1,
  });
watchEffect(async () => {
  pointData.value = props.pointData;
});
store.setDrawTLBrushData({
  type: colorList[0].type,
  color: colorList[0].color,
  covered: 0,
});
function delCircle(val) {
  if (val.pointsIndex < 0) return;
  store.setDrawDomRefresh(1);
  ObserverInstance.emit(drawEvents.TYPELINE_DELETE_CIRCLE, {
    ...val,
    sign: "typeLine",
  });
}
function changeBrush(val) {
  store.setDrawTLBrushData({
    ...store.getDrawTLBrushData,
    ...val,
  });
  ObserverInstance.emit(drawEvents.TYPELINE_CHANGE_CIRCLE_TYPE, val);
}
function initCover(val) {
  store.setDrawTLBrushData({
    ...store.getDrawTLBrushData,
    covered: val,
  });
}
// 修改edit状态下数据--类型
function changeType(val) {
  store.setDrawDomRefresh(1);
  ObserverInstance.emit(drawEvents.TYPELINE_CHANGE_CIRCLE_TYPE, val);
}
// 修改typeline：是否被遮盖
function changeCover(val) {
  console.log(val, "---val");
  store.setDrawDomRefresh(1);
  ObserverInstance.emit(drawEvents.TYPELINE_CHANGE_CIRCLE_TYPE, {
    covered: val,
  });
}
</script>

<style lang="scss" scoped>
.point_detail {
  width: 98%;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #dadce0;
  background: #f1f3f4;
  margin-bottom: 6px;
  border-radius: 4px;
  // min-height: 77px;
  .typeLine_tool_top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 10px;
  }
  .brush_select {
    box-sizing: border-box;
    padding: 10px;
    :deep(.el-input) {
      width: 100% !important;
    }
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
    margin: 20px 0 10px 0;

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
      margin-left: 14px;
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
  .point_selects {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .point_detail_title {
      min-width: 80px;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
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
  }
}
.point_detail_option {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.color_tip {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
