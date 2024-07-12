<template>
  <BaseInfoUpdate title="更新字典" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="代码:" :label-width="formLabelWidth">
        <el-input v-model="form.code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="缩写:" :label-width="formLabelWidth">
        <el-input v-model="form.acronym" autocomplete="off" />
      </el-form-item>
      <el-form-item label="编码:" :label-width="formLabelWidth">
        <el-input v-model="form.encode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="type_code:" :label-width="formLabelWidth">
        <el-input v-model="form.type_code" autocomplete="off" />
      </el-form-item>
      <el-form-item label="shortName:" :label-width="formLabelWidth">
        <el-input v-model="form.short_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="shortCode:" :label-width="formLabelWidth">
        <el-input v-model="form.short_code" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoUpdate>
</template>

<script setup lang="ts">
import BaseInfoUpdate from "./BaseInfoUpdate.vue";
import { ref, inject } from "vue";
import type { FormInstance } from "element-plus";
import type { DictionaryInfo } from "@/utils/data";

const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "100px";
const form = inject(
  "updateTableData",
  ref<DictionaryInfo>({
    id: 0,
    code: "1",
    name: "1",
    acronym: "1",
    encode: "1",
    type_code: "1",
    short_name: "1",
    short_code: "1",
  })
);
const emit = defineEmits<{
  (e: "update", value: any): void;
}>();

function create() {
  emit("update", form.value);
}
</script>
