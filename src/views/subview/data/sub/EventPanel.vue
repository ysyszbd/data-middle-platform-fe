<template>
  <div
    class="env-panel"
    :class="{ active: showAllFilter }"
    :style="{ width: 'calc(100% - ' + rightWidth + 'px)' }"
  >
    <div class="filter-button">
      <el-button
        type="primary"
        :icon="showAllFilterIcon"
        @click="switchAllFilter"
      >
        展开/折叠
      </el-button>
    </div>
    <TransitionGroup tag="ul" name="fade" class="container">
      <div
        style="border: 0px solid #c6e2ff; display: flex; align-items: center"
        v-for="item in tagsTmp"
        :key="item.type"
      >
        <BaseEventGroup :item="item" @tagsChanged="updateCheckboxGroup" />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from "vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import BaseEventGroup from "./BaseEventGroup.vue";
import { eventTagStore } from "@/stores/store";

const showAllFilter = ref(false);
const showAllFilterIcon = ref(markRaw(ArrowDown));
const tagsTmp = ref<any[]>([]);
tagsTmp.value = eventTagStore.firstSrcTag;
const checkboxGroup = ref({});
const props = defineProps<{
  rightWidth?: number;
}>();

const emit = defineEmits<{
  (e: "updateSelectTags", value: any): void;
}>();

function updateCheckboxGroup(type, value) {
  checkboxGroup.value[type] = value;
  emit("updateSelectTags", getCheckTags());
}

function switchAllFilter() {
  showAllFilter.value = !showAllFilter.value;
  if (false === showAllFilter.value) {
    showAllFilterIcon.value = markRaw(ArrowDown);
    tagsTmp.value = eventTagStore.srcTag.slice(0, 1);
  } else {
    showAllFilterIcon.value = markRaw(ArrowUp);
    tagsTmp.value = eventTagStore.srcTag;
  }
}

function getCheckTags() {
  let array: any = [];
  for (let key in checkboxGroup.value) {
    const element: any = checkboxGroup.value[key];
    array = array.concat(element);
  }
  return array;
}
</script>

<style scoped>
.filter-button {
  position: absolute;
  right: 20px;
}

.env-panel {
  position: relative;
  padding: 9px;
  z-index: 2;
  background-color: #fff;
  border: 1px solid #bbb;
  border-radius: 4px;
  transition: width 0.5s;
}

.active {
  width: calc(100% - 20px) !important;
}

/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}
</style>
