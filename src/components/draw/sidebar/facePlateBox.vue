<!--
 * @LastEditTime: 2023-07-18 10:09:44
 * @Description: 控制面板组件，可拖拽移动
-->
<template>
  <div :class="['face_plate_box']">
    <div class="face_plate_title" :title="props.title" @mousedown="downFun">
      <img
        v-if="store.getTaskMove[props.plateSign]"
        class="task_fix_icon"
        src="@/assets/image/task_fix_icon.svg"
        alt=""
        title="将控制面板固定在左侧"
        @click.stop="handlePlate"
      />
      <span class="face_plate_title_text">{{ props.name }}</span>
      <Close width="15px" class="face_plate_box_close" @click="handleFUN" />
    </div>
    <!-- 插入控制面板内容 -->
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { inject, defineProps } from "vue";
import { Close } from "@element-plus/icons-vue";
import { useStateStore } from "@/stores/state";

const store = useStateStore();
const props = defineProps(["title", "name", "plateSign", "DOMid", "showSign"]);
const FACE_PLATE: any = inject("FACE_PLATE");
function handleFUN() {
  FACE_PLATE.handleFacePlate(props.showSign, false);
}
function downFun(e) {
  FACE_PLATE.downFUN(e, props.DOMid, props.plateSign);
}
function handlePlate() {
  console.log("=========handlePlate");
  
  store.setTaskMove(props.plateSign, false);
  const dom = document.getElementById(props.DOMid);
  if (props.plateSign === "right") {
    dom!.style.left = `72px`;
    dom!.style.top = `0px`;
  }
  const obj = {
    groupSign: "group",
    attributeSign: "left",
    objectSign: "right",
    workSign: "work",
  };
  console.log(FACE_PLATE.facePlate.value, "FACE_PLATE.facePlate");
  
  for (const [key, v] of Object.entries(FACE_PLATE.facePlate.value)) {
    if (props.showSign != key && !store.getTaskMove[obj[key]]) {
      FACE_PLATE.facePlate.value[key] = false;
    }
  }
  dom!.style.transform = `translate3d(0px, 0px, 1px)`;
  FACE_PLATE.transform[props.plateSign] = {
    offsetX: 0,
    offsetY: 0,
  };
}
</script>

<style lang="scss" scoped>
.face_plate_box {
  .face_plate_title {
    width: 100%;
    height: 36px;
    cursor: move;
    white-space: nowrap;
    color: rgb(112, 112, 112);
    border-bottom: 1px solid #dadce0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .task_fix_icon {
      width: 20px;
      position: absolute;
      left: 10px;
      cursor: pointer;
    }
    .face_plate_box_close {
      position: absolute;
      right: 10px;
      cursor: pointer;
    }
    .face_plate_title_text {
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      width: 30%;
      height: 50%;
      cursor: pointer;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
