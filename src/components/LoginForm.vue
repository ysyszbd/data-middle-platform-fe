<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" status-icon>
    <el-form-item prop="username">
      <el-input
        v-model="ruleForm.user_name"
        autocomplete="off"
        placeholder="请输入用户名"
        :prefix-icon="User"
        @keyup.enter="submitForm(ruleFormRef)"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="ruleForm.password"
        type="password"
        autocomplete="off"
        placeholder="请输入密码"
        :prefix-icon="Lock"
        show-password
        @keyup.enter="submitForm(ruleFormRef)"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)" class="sub-btn"
        >登录
      </el-button>
      <el-button @click="resetForm(ruleFormRef)" class="reset-btn"
        >重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { ref, onMounted } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStateStore } from "@/stores/state";
import { getData, postData } from "@/utils/axios";
import { user_detail } from "@/utils/urlset";
import Cookies from 'js-cookie'

const store = useStateStore();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();

const ruleForm = ref({
  user_name: "",
  password: ""
});

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
    callback();
  }
};

const loginRules = ref({
  user_name: [{ validator: validateUser, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }]
});

onMounted(() => {
  resetForm(ruleFormRef.value);
});

function submitForm(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.validate((valid) => {
    if (valid) {
      postData("/login", ruleForm.value, (response) => {
        store.setUserId(response.data.data.userId);
        store.setUserRoleIds(response.data.data.roleIds);
        store.setToken(response.data.data.AccessToken);
        Cookies.set("yh_token", response.data.data.AccessToken);
        store.setMenu(JSON.stringify(response.data.data.menus));

        getData(user_detail, { id: store.getUserId }, (data) => {
          if (data.data.nick_name != "" || data.data.nick_name != null) {
            store.setUser(data.data.nick_name);
          } else {
            store.setUser(data.data.user_name);
          }
          router.push("/");
        });
      });
    } else {
      console.log("error submit!");
      return false;
    }
  });
}
function resetForm(formRef: FormInstance | undefined) {
  if (!formRef) {
    // console.log("reset error!");
    return;
  } else {
    // console.log("reset success!");
    formRef.resetFields();
  }
}
</script>

<style scoped>
.sub-btn {
  width: 48%;
}

.reset-btn {
  position: absolute;
  width: 48%;
  right: 0;
}
</style>
