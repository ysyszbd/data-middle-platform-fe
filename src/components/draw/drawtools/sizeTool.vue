<!--
 * @Author: yinshunyu
 * @Date: 2023-01-13 15:04:02
 * @LastEditors: yinshunyu
 * @LastEditTime: 2023-02-09 17:16:09
 * @FilePath: \DataClient\src\components\draw\drawtools\sizeTool.vue
 * @Description: 
 * 
-->
<template>
  <div class="size_tool">
    <div class="nav_btn btn_big" title="放大" @click="enlageSVG"></div>
    <!-- <div class="btn_num">{{ props.wheelNum + ' %' }}</div> -->
    <div class="nav_btn btn_small" title="缩小" @click="narrowSVG"></div>
    <el-button type="primary" round size="small" @click="initSize"
      >复位
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents } from "@/components/draw/event/events";
const props = defineProps(["wheelNum"]);
// 放大
function enlageSVG() {
  ObserverInstance.emit(drawEvents.ENLAGE_SVG);
}
// 缩小
function narrowSVG() {
  ObserverInstance.emit(drawEvents.NARROW_SVG);
}
// 一键复位
function initSize() {
  ObserverInstance.emit(drawEvents.INIT_SIZE_SVG);
}
</script>

<style lang="scss" scoped>
@import url("@/assets/css/draw.scss");
.size_tool {
  // width: 100px;
  height: 30px;
  background: #fff;
  border: 1px solid #000;
  position: absolute;
  z-index: 2000;
  right: 50%;
  transform: translate(-50%);
  bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  padding: 0 4px;
  .nav_btn {
    width: 21px;
    height: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn_num {
    font-size: 14px;
    margin: 0 4px;
    flex-shrink: 0;
  }
  .btn_big {
    background-position: 0 -966px;
  }
  .btn_small {
    background-position: 0 -1013px;
  }
}
</style>
