<template>
  <div class="center">
    <el-button type="primary" link @click="openHelp">帮助文档</el-button>
    <span style="margin-right: 10px; margin-left: 10px">{{ message }}</span>
    <el-popconfirm
      confirm-button-text="确定"
      cancel-button-text="取消"
      icon-color="#626AEF"
      title="确定退出吗?"
      @confirm="logout"
    >
      <template #reference>
        <el-button type="info">退出</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStateStore } from "@/stores/state";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useStateStore();

const message = computed(() => {
  return "Hi, " + store.getUser;
});

function logout() {
  store.setUser("");
  router.push("/login");
}

function openHelp() {
  window.open(
    "https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8D6eZ1NLsm7v1AygVxLq0Ee4"
  );
}
</script>

<style scoped>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
