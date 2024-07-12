<!--
 * @LastEditTime: 2023-02-09 13:41:04
 * @Description: 线段分割按钮
-->
<template>
  <div class="curve_box">
    <el-button
      @click="chooceTypelineBtn(textBtn)"
      :type="'primary'"
      :class="[]"
      size="small"
    >
      {{ textBtn }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { defineProps, computed } from "vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents } from "@/components/draw/event/events";

const props = defineProps(["curvePointIndex", "points", "index"]);

const textBtn = computed(() => {
  if (!props.points) return "";
  if (props.points.length === 0) return "新建线";
  if (
    props.points.length - 1 === props.curvePointIndex ||
    props.curvePointIndex === 0
  ) {
    return "延长线";
  } else {
    return "添加点";
  }
});

function chooceTypelineBtn(val: string) {
  if (props.curvePointIndex < 0 && val === "添加点") {
    ElMessage.error("请先选择要添加的位置！");
    return;
  }
  if (val === "添加点") {
    ObserverInstance.emit(drawEvents.CURVE_INSERT_CIRCLE, "添加点");
    ObserverInstance.emit(drawEvents.HANDLE_DONE_BTN, "Curve");
  } else if (val === "新建线") {
    ObserverInstance.emit(drawEvents.ADD_NEW_SIGN, "Curve", props.index);
  } else {
    ObserverInstance.emit(drawEvents.CURVE_INSERT_CIRCLE, "延长线");
    
  }
}
</script>

<style lang="scss" scoped>
.curve_box {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
</style>
