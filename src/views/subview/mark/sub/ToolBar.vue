<template>
  <div class="h-center">
    <div class="describe">标注工具:</div>
    <el-select
      v-model="currentType"
      placeholder="Select"
      size="large"
      @change="changeType()"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-button type="danger" @click="revoke()">撤销</el-button>
    <div class="zoom-icon-plus" @click="zoomIn">+</div>
    <div class="zoom-icon-minus" @click="zoomOut">-</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "updateType", type: string): void;
  (e: "action", type: string): void;
}>();

const currentType = ref("PAN");

const options = [
  { value: "PAN", label: "平移" },
  { value: "POLYLINE", label: "多段线" },
  { value: "RECT", label: "矩形" },
  { value: "POLYGON", label: "多边形" },
];

function changeType() {
  emit("updateType", currentType.value);
}
function revoke() {
  emit("action", "revoke");
}
function zoomIn() {
  emit("action", "zoomIn");
}
function zoomOut() {
  emit("action", "zoomOut");
}
</script>

<style scoped>
.describe {
  margin-right: 10px;
  text-align: center;
}
.h-center {
  display: flex;
  align-items: center;
}

.zoom-icon-wrapper {
  position: absolute;
  /* left: 20px; */
  /* top: 20px; */
  z-index: 1000;
}

.zoom-icon-plus {
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 20px;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-plus:hover {
  border-color: #4169e1;
}

.zoom-icon-minus {
  width: 30px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  border: 3px solid #6495ed;
  font-size: 25px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  color: #ff8c00;
  cursor: pointer;
}

.zoom-icon-minus:hover {
  border-color: #4169e1;
}
</style>
