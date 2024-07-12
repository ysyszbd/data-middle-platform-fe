<template>
  <div
    style="
      border: 1px solid;
      border-radius: 4px;
      margin-bottom: 10px;
      padding: 3px;
    "
    :style="{ borderColor: item.color }"
  >
    <div style="font-size: 14px" :style="{ color: item.color }">
      <el-button
        type="primary"
        size="small"
        round
        :color="item.color"
        @click="handlAllClick"
      >
        ALL
      </el-button>
      {{ item.type }}
    </div>
    <el-button-group>
      <el-button
        v-for="childItem in item.tags"
        :key="childItem.id"
        @click="handlClick(childItem, item.type)"
        :class="{
          active: isActive(childItem.id),
        }"
        :color="item.color"
        size="small"
        plain
        >{{ childItem.names }}</el-button
      >
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps(["item"]);
const emits = defineEmits(["tagsChanged"]);

const selectMap = ref(new Map());

function handlClick(item, type) {
  if (selectMap.value.has(item.id)) {
    selectMap.value.delete(item.id);
  } else {
    selectMap.value.set(item.id, item.names);
  }
  emits("tagsChanged", props.item.type, Array.from(selectMap.value.keys()));
}

function handlAllClick() {
  if (selectMap.value.size != props.item.tags.length) {
    for (let i in props.item.tags) {
      selectMap.value.set(props.item.tags[i].id, props.item.tags[i].names);
    }
  } else {
    selectMap.value.clear();
  }
  emits("tagsChanged", props.item.type, Array.from(selectMap.value.keys()));
}

function isActive(id) {
  if (selectMap.value.has(id)) {
    return true;
  }
  return false;
}
</script>

<style scoped>
.active {
  background-color: var(--el-button-hover-bg-color) !important;
  color: var(--el-button-active-text-color) !important;
}
.el-button:focus {
  background-color: var(--el-button-bg-color);
  color: var(--el-button-text-color);
}
</style>
