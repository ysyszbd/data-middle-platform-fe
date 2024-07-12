<template>
  <BaseInfoUpdate title="更新标签" @submit="create">
    <el-form :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-input v-model="form.type" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分组:" :label-width="formLabelWidth">
        <el-input v-model="form.group" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoUpdate>
</template>

<script setup lang="ts">
import BaseInfoUpdate from "./BaseInfoUpdate.vue";
import { ref, inject, watch } from "vue";
import { getData } from "@/utils/axios";

const formLabelWidth = "80px";
const form = inject(
  "updateTableData",
  ref({
    id: 0,
    name: "",
    type: "",
    group: "",
  })
);
const dialogUpdateVisible = inject("dialogUpdateVisible", ref(false));

const envTags = ref(new Map());

const emit = defineEmits<{
  (e: "update", value: any): void;
}>();

function create() {
  emit("update", form.value);
}
</script>
