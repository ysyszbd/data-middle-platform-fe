<template>
  <BaseInfoUpdate title="更新用户" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="用户名:" :label-width="formLabelWidth">
        <el-input v-model="form.user_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="昵称:" :label-width="formLabelWidth">
        <el-input v-model="form.nick_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话:" :label-width="formLabelWidth">
        <el-input v-model="form.mobile" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱:" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="头像:" :label-width="formLabelWidth">
        <el-input v-model="form.avatar" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoUpdate>
</template>

<script setup lang="ts">
import BaseInfoUpdate from "./BaseInfoUpdate.vue";
import { ref, inject } from "vue";
import type { FormInstance } from "element-plus";
import type { UserInfo } from "@/utils/data";
const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";
const form = inject(
  "updateTableData",
  ref<UserInfo>({
    id: 0,
    avatar: "",
    email: "",
    mobile: "",
    nick_name: "",
    role_id: 0,
    role_name: "",
    status: "",
    user_name: "",
    password: "",
    checkPass: "",
    salt: "",
  })
);
const emit = defineEmits<{
  (e: "update", value: any): void;
}>();

function create() {
  emit("update", form.value);
}
</script>
