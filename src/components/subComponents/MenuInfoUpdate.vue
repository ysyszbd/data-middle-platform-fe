<template>
  <BaseInfoUpdate title="更新菜单" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <!-- <el-form-item label="父菜单:" :label-width="formLabelWidth">
        <el-input v-model="form.parent_id" autocomplete="off" />
      </el-form-item> -->
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="路径:" :label-width="formLabelWidth">
        <el-input v-model="form.url" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-input v-model.number="form.type" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoUpdate>
</template>

<script setup lang="ts">
import BaseInfoUpdate from "./BaseInfoUpdate.vue";
import { ref, inject } from "vue";
import type { FormInstance } from "element-plus";
import type { MenuInfo } from "@/utils/data";
const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";
const form = inject(
  "updateTableData",
  ref<MenuInfo>({
    id: 0,
    parent_id: 0,
    type: 0,
    name: "",
    icon: "",
    sort: 0,
    url: "",
  })
);
const emit = defineEmits<{
  (e: "update", value: any): void;
}>();

function create() {
  emit("update", form.value);
}
</script>
