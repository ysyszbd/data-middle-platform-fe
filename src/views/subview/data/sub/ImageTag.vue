<template>
  <div
    v-for="(value, key) in imageTagData"
    :key="key"
    style="margin: 2px; position: relative; display: flex"
  >
    <!-- <div style="width: 90px; display: flex; align-items: center">
      <span class="type-name"> {{ value.type }}： </span>
    </div> -->
    <el-tag v-for="tag in value.tags" :key="tag.id">
      {{ tag.names }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import { eventTagStore } from "@/stores/store";
import { ref, watch } from "vue";

const imageTagData = ref();
const props = defineProps<{
  previewData: any;
}>();

const emit = defineEmits<{
  (e: "delete", id): void;
}>();

function deleteData(data) {
  emit("delete", data);
}

watch(
  () => props.previewData,
  (newPreviewData) => {
    imageTagData.value = [];
    if (newPreviewData.basic.type == "image") {
      // eslint-disable-next-line no-prototype-builtins
      if (newPreviewData.hasOwnProperty("label")) {
        // eslint-disable-next-line no-prototype-builtins
        if (newPreviewData.label.hasOwnProperty("tags")) {
          imageTagData.value = newPreviewData.label.tags;
        }
      }
    }
  }
);
</script>

<style scoped>
.type-name {
  display: inline-block;
  width: 90px;
  text-align: right;
  font-size: 12px;
  color: black;
}
</style>
