<template>
  <BaseInfoUpdate title="更新API" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="路径:" :label-width="formLabelWidth">
        <el-input v-model="form.path" autocomplete="off" />
      </el-form-item>
      <el-form-item label="方法:" :label-width="formLabelWidth">
        <el-select
          v-model="form.method"
          placeholder="请选择方法"
          style="width: 100%"
        >
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
        </el-select>
      </el-form-item>
      <el-form-item label="分组:" :label-width="formLabelWidth">
        <el-input v-model="form.group" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注:" :label-width="formLabelWidth">
        <el-input v-model="form.remarks" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoUpdate>
</template>

<script setup lang="ts">
import BaseInfoUpdate from "./BaseInfoUpdate.vue";
import { ref, inject } from "vue";
import type { FormInstance } from "element-plus";
import type { ApiInfo } from "@/utils/data";

const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";
const form = inject(
  "updateTableData",
  ref<ApiInfo>({
    id: 0,
    path: "",
    method: "",
    group: "",
    remarks: "",
  })
);

const emit = defineEmits<{
  (e: "update", value: any): void;
}>();

function create() {
  emit("update", form.value);
}
</script>
