<template>
  <BaseInfoUpdate title="更新部门" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <!-- <el-form-item label="父菜单:" :label-width="formLabelWidth">
        <el-input v-model.number="form.parent_id" autocomplete="off" />
      </el-form-item> -->
      <el-form-item label="状态:" :label-width="formLabelWidth">
        <el-input v-model="form.status" autocomplete="off" />
      </el-form-item>
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoUpdate>
</template>

<script setup lang="ts">
import BaseInfoUpdate from "./BaseInfoUpdate.vue";
import { ref, inject } from "vue";
import type { FormInstance } from "element-plus";
import type { DeptInfo } from "@/utils/data";

const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";
const form = inject(
  "updateTableData",
  ref<DeptInfo>({
    id: 0,
    parent_id: 0,
    status: "",
    name: "",
    order: 0,
  })
);

const emit = defineEmits<{
  (e: "update", value: any): void;
}>();

function create() {
  emit("update", form.value);
}
</script>
