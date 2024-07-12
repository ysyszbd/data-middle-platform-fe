<template>
  <div class="container">
    <el-container>
      <el-aside class="aside" width="200px">
        <div class="container">
          <BaseMenu :routes="propsRouters"></BaseMenu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <PageHeader />
          <div class="right">
            <NavBar />
          </div>
        </el-header>
        <el-main class="main">
          <RouterView v-slot="{ Component }">
            <Transition mode="out-in" name="slide-fade">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { constantRoutes } from "@/router";
import BaseMenu from "../components/BaseMenu.vue";
import PageHeader from "../components/PageHeader.vue";
import NavBar from "./NavBar.vue";
import { useStateStore } from "@/stores/state";

const store = useStateStore();

const props = defineProps({
  routerName: { type: String, required: true },
});

let menuData;
let routers;
const propsRouters = ref([] as any[]);

onMounted(() => {
  const allMenu = JSON.parse(store.getMenu);

  menuData = allMenu.find(
    (element: any) => element.url.slice(1) == props.routerName
  );

  routers = constantRoutes.find(
    (element: any) => element.path.slice(1) == props.routerName
  );

  for (let index = 0; index < menuData.children.length; index++) {
    const child = menuData.children[index];
    // console.log("source:", child);
    const searchMenu: any = routers.children.find(
      (element: any) => element.path == child.url
    );
    if (searchMenu != undefined) {
      // console.log("search", searchMenu);
      if (child.children != null) {
        const res = searchMenu.children.filter((val) =>
          child.children.some(({ url }) => (val.path as any) === (url as any))
        );
        // console.log(res);
        searchMenu.children = res;
      } else {
        searchMenu.children = null;
      }
      propsRouters.value.push(searchMenu);
    }
  }
  // console.log(propsRouters.value);
});
</script>

<style scoped>
.header {
  display: inline-flex;
  align-items: center;
  box-shadow: 0 1px 3px rgb(0 21 41 / 8%);
}
.main {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
}

.aside {
  height: 100vh;
}

.container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.right {
  position: absolute;
  right: 20px;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0, 0, 1, 0);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
