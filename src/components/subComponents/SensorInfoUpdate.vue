<template>
  <BaseInfoUpdate title="更新用户" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="编号:" :label-width="formLabelWidth">
        <el-input v-model="form.no" autocomplete="off" />
      </el-form-item>
      <el-form-item label="位置:" :label-width="formLabelWidth">
        <el-input v-model="form.position" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-input v-model="form.type" autocomplete="off" />
      </el-form-item>
      <el-form-item label="型号:" :label-width="formLabelWidth">
        <el-input v-model="form.model" autocomplete="off" />
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
import type { SensorInfo } from "@/utils/data";
const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";
const form = inject(
  "updateTableData",
  ref<SensorInfo>({
    name: "",
    position: "",
    no: "",
    type: "",
    model: "",
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
