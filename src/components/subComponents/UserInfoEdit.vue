<template>
  <BaseInfoEdit title="创建用户" @submit="create">
    <el-form ref="ruleFormRef" :model="form" :rules="rules">
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
      <el-form-item label="密码:" prop="password" :label-width="formLabelWidth">
        <el-input
          v-model="form.password"
          type="password"
          autocomplete="off"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="checkPass"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.checkPass"
          type="password"
          autocomplete="off"
          show-password
        />
      </el-form-item>
    </el-form>
  </BaseInfoEdit>
</template>

<script setup lang="ts">
import BaseInfoEdit from "./BaseInfoEdit.vue";
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import type { UserInfo } from "@/utils/data";

const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const form = ref<UserInfo>({
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
});

function create() {
  emit("submit", form.value);
}
const validateUser = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else {
    callback();
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (form.value.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== form.value.password) {
    callback(new Error("两次输入不匹配!"));
  } else {
    callback();
  }
};

const rules = ref({
  userName: [{ validator: validateUser, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
});
</script>
