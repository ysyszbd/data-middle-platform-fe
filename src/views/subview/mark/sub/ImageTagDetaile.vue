<template>
  <div
    v-for="(value, key) in imageTagData"
    :key="key"
    style="margin: 2px; position: relative; display: flex"
  >
    <div style="width: 90px; display: flex; align-items: center">
      <span class="type-name"> {{ value[0] }}： </span>
    </div>
    <el-tag
      v-for="tag in value[1]"
      :key="tag.tag_id"
      class="mx-1"
      closable
      @close="deleteData(tag.id)"
    >
      {{ eventTagStore.tagId2NameMap.get(tag.tag_id) }}
    </el-tag>
  </div>
</template>

<script setup lang="ts">
import { eventTagStore } from "@/stores/store";

const props = defineProps<{
  imageTagData: any;
}>();

const emit = defineEmits<{
  (e: "delete", id): void;
}>();

function deleteData(data) {
  emit("delete", data);
}
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
