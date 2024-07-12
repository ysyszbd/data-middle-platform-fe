<!--
 * @LastEditTime: 2023-02-03 16:17:09
 * @Description: Box2d按钮
 * 
-->
<template>
  <div class="mark_2D">
    <el-button
      type="primary"
      v-show="getBtnText === '新建'"
      size="small"
      @click="add2D"
      >{{ getBtnText }}</el-button
    >
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
import { getTypeIndex } from "@/utils/util";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents } from "@/components/draw/event/events";

const props = defineProps(["nowObjectData", "nowObjectIndex"]);
const getBtnText = computed(() => {
  if (!props.nowObjectData.shapes) return;
  let shapesIndex = getTypeIndex(props.nowObjectData.shapes, "Box2d");
  if (props.nowObjectData.shapes[shapesIndex].points.length) {
    return "";
  } else {
    return "新建";
  }
});
function add2D() {
  ObserverInstance.emit(
    drawEvents.NOW_TYPE,
    "Box2d",
    props.nowObjectIndex,
    "add2D"
  );
  ObserverInstance.emit(drawEvents.ADD_NEW_SIGN, "Box2d");
}
</script>

<style lang="scss" scoped>
.mark_2D {
  padding: 0 10px;
  box-sizing: border-box;
}
</style>
