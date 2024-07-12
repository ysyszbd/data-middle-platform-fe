<template>
  <div class="container menu-div">
    <UserInfo></UserInfo>
    <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      :default-active="$route.path"
      text-color="#fff"
      router
    >
      <el-menu-item v-for="item in itmeRoutes" :key="item" :index="item.path">
        <el-icon><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
      <el-sub-menu
        v-for="subItem in subRoutes"
        :key="subItem"
        :index="subItem.path"
      >
        <template #title>
          <el-icon><component :is="subItem.meta.icon" /></el-icon>
          <span>{{ subItem.meta.title }}</span>
        </template>
        <el-menu-item
          v-for="chileditem in subItem.children"
          :key="chileditem"
          :index="chileditem.path"
        >
          <el-icon><component :is="chileditem.meta.icon" /></el-icon>
          <span>{{ chileditem.meta.title }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import UserInfo from "@/components/UserInfo.vue";
import { computed } from "vue";

const props = defineProps(["routes"]);

const itmeRoutes = computed(() => {
  return props.routes.filter((val) => {
    return val.children == undefined || null;
  });
});
const subRoutes = computed(() => {
  return props.routes.filter((val) => {
    return val.children != undefined || null;
  });
});
</script>

<style scoped>
.menu-div {
  border: 0px;
  background-color: #545c64;
}
.el-menu {
  border-right: 0px;
}
.is-active {
  background-color: #b1b3b8;
}
:deep(.el-sub-menu.is-active .el-sub-menu__title) {
  color: #ffd04b !important;
}
</style>
