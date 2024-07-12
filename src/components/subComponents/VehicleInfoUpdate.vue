<template>
  <BaseInfoUpdate title="更新用户" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="车牌:" :label-width="formLabelWidth">
        <el-input v-model="form.plate" autocomplete="off" />
      </el-form-item>
      <el-form-item label="品牌:" :label-width="formLabelWidth">
        <el-input v-model="form.brand" autocomplete="off" />
      </el-form-item>
      <el-form-item label="编号:" :label-width="formLabelWidth">
        <el-input v-model="form.no" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态:" :label-width="formLabelWidth">
        <el-input v-model="form.status" autocomplete="off" />
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
import type { VehicleInfo } from "@/utils/data";
const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";
const form = inject(
  "updateTableData",
  ref<VehicleInfo>({
    id: 0,
    plate: "",
    brand: "",
    no: "",
    status: "",
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
