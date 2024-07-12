<template>
  <div class="root">
    <el-image :src="imageUrl" style="width: 90%" />
    <!-- <div class="v-center">
      <span style="margin-right: 20px; color: white">{{ message }}</span>
      <el-button @click="goHome">返回</el-button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import { computed } from "vue";
// import { useStateStore } from "@/stores/state";
// import { useRouter } from "vue-router";
import imageUrl from "@/assets/image/logo.png";

// const router = useRouter();

// const store = useStateStore();

// const message = computed(() => {
//   return "Hi, " + store.getUser;
// });

// function goHome() {
//   router.push("/");
// }
</script>

<style scoped>
.root {
  padding: 20px 0px 20px 0px;
  text-align: center;
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
}

.v-margin {
  margin-top: 20px;
  margin-bottom: 20px;
}

.v-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
