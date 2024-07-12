<template>
  <el-scrollbar>
    <el-space wrap :size="10">
      <BaseDataSet
        v-for="item in data"
        :key="item"
        :data="item"
        @box-click="itemClick"
        @box-db-click="itemDblClick"
        @select="select"
      />
    </el-space>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseDataSet from "./BaseDataSet.vue";
const props = defineProps(["data"]);
const emits = defineEmits(["itemClick", "itemDblClick", "select"]);

let multipleSelection = [] as any[];

watch(
  () => props.data,
  (newValue) => {
    multipleSelection = [];
  }
);

function itemClick(params) {
  emits("itemClick", params);
}
function itemDblClick(params) {
  emits("itemDblClick", params);
}

function select(flag, params) {
  if (flag) {
    multipleSelection.push(params);
  } else {
    for (let i = 0; i < multipleSelection.length; i++) {
      const item = multipleSelection[i];
      if (item.id.$oid === params.id.$oid) {
        multipleSelection.splice(i, 1);
        break;
      }
    }
  }
  emits("select", multipleSelection);
}
</script>

<style scoped></style>
