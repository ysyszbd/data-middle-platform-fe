<template>
  <BaseInfoEdit title="创建系统配置" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="键:" :label-width="formLabelWidth">
        <el-input v-model="form.key" autocomplete="off" />
      </el-form-item>
      <el-form-item label="值:" :label-width="formLabelWidth">
        <el-input v-model="form.value" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分组:" :label-width="formLabelWidth">
        <el-input v-model="form.group" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-input v-model="form.type" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注:" :label-width="formLabelWidth">
        <el-input v-model="form.remarks" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态:" :label-width="formLabelWidth">
        <el-input v-model="form.status" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoEdit>
</template>

<script setup lang="ts">
import BaseInfoEdit from "./BaseInfoEdit.vue";
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import type { SystemInfo } from "@/utils/data";

const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const form = ref<SystemInfo>({
  group: "",
  id: 0,
  key: "",
  name: "",
  remarks: "",
  sort: 0,
  status: "",
  type: "",
  value: "",
});

function create() {
  emit("submit", form.value);
}
</script>
