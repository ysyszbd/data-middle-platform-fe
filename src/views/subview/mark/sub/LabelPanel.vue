<template>
  <div
    v-for="item in eventTagStore.srcTag"
    :key="item.type"
    style="margin: 2px; position: relative; display: flex"
  >
    <div style="width: 90px; display: flex; align-items: center">
      <span
        v-show="typeShow"
        style="
          display: inline-block;
          width: 90px;
          text-align: right;
          font-size: 12px;
          color: black;
        "
      >
        {{ item.type }}：
      </span>
    </div>

    <div style="width: calc(100% - 90px)">
      <el-button-group>
        <el-button
          v-for="childItem in item.tags"
          :key="childItem.id"
          @click="handlClick(childItem, item.type)"
          type="primary"
          size="small"
          class="tag"
          :class="{
            active: isActive(item.type, childItem),
          }"
          plain
          :color="item.color"
          >{{ childItem.names }}</el-button
        >
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getData } from "@/utils/axios";
import { eventTagStore } from "@/stores/store";

const checkedMap = ref(new Map());

const props = defineProps<{
  typeShow: boolean;
}>();

const emit = defineEmits<{
  (e: "mark", id, type, active, group): void;
}>();

function isActive(type, item) {
  if (undefined != item.group) {
    return item.id == checkedMap.value.get(type) ? true : false;
  }
  if (undefined == item.active) {
    return false;
  }
  return item.active;
}

function handlClick(item, type) {
  if (undefined != item.group) {
    if (checkedMap.value.get(type) == item.id) {
      checkedMap.value.delete(type);
      emit("mark", item.id, type, false, 1);
    } else {
      checkedMap.value.set(type, item.id);
      emit("mark", item.id, type, true, 1);
    }
  } else {
    item.active = !item.active;
    emit("mark", item.id, type, item.active, 2);
  }
}
</script>

<style scoped>
.tag {
  width: 110px;
}

.active {
  background-color: var(--el-button-hover-bg-color) !important;
  color: var(--el-button-active-text-color) !important;
}
.el-button {
  --el-button-size: 20px;
}
.el-button:focus {
  background-color: var(--el-button-bg-color);
  color: var(--el-button-text-color);
}
</style>
