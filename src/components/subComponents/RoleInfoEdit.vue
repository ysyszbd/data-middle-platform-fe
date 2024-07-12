<template>
  <BaseInfoEdit title="创建角色" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="角色:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注:" :label-width="formLabelWidth">
        <el-input v-model="form.remark" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoEdit>
</template>

<script setup lang="ts">
import BaseInfoEdit from "./BaseInfoEdit.vue";
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import type { RoleInfo } from "@/utils/data";

const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const form = ref<RoleInfo>({
  id: 0,
  name: "",
  remark: "",
  status: "",
});

function create() {
  emit("submit", form.value);
}
</script>
