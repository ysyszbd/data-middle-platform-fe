<template>
  <div class="container">
    <MenuButton
      v-for="item in menu"
      :key="item.url"
      :message="item.name"
      @clickEvent="pathTo(item.url)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
import MenuButton from "@/components/MenuButton.vue";

import { useStateStore } from "@/stores/state";
const store = useStateStore();

const menu = ref();

onMounted(() => {
  menu.value = JSON.parse(store.getMenu);
});

const router = useRouter();

function pathTo(path: string) {
  //console.log(path);
  if (path == undefined) {
    ElNotification({
      title: "错误",
      message: "导航路径错误",
      type: "error",
    });
    return;
  }
  router.push(path);
}
</script>

<style scoped>
.container {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  grid-gap: 3em;
  justify-content: center;
}
</style>
