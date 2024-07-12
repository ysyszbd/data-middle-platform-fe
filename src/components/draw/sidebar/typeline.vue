<!--
 * @LastEditTime: 2023-07-13 16:15:16
 * @Description: 线段分割的按钮
 * 
-->
<template>
  <div class="typeline_box">
    <el-button
      @click="chooceTypelineBtn(typelineBtn)"
      :type="'primary'"
      class="typeline_btn"
      size="small"
    >
      {{ typelineBtn }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { defineProps, computed } from "vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";

const props = defineProps(["pointsIndex", "nowObjectData", "points", "index"]);

const typelineBtn = computed(() => {
  if (!props.points) return "";
  if (props.points.length === 0) return "新建线";
  if (props.points.length - 1 === props.pointsIndex) {
    return "延长线";
  } else {
    return "插入点";
  }
});

function chooceTypelineBtn(val: string) {
  if (props.pointsIndex < 0 && val === "插入点") {
    ElMessage.error("请先选择要插入的前一个点！");
    return;
  }
  if (val === "新建线") {
    ObserverInstance.emit(drawEvents.ADD_NEW_SIGN, "typeLine", props.index);
  } else {
    ObserverInstance.emit(dataEvents.HANDLE_PAGE_TIP, {
      sign: true,
      type: val,
    });
    ObserverInstance.emit(drawEvents.HANDLE_DONE_BTN, "typeLine");
    ObserverInstance.emit(drawEvents.TYPELINE_INSERT_CIRCLE, val);
  }
}
</script>

<style lang="scss" scoped>
.typeline_box {
  display: flex;
  align-items: center;
  .typeline_btn {
    margin-left: 5px;
  }
}
</style>
