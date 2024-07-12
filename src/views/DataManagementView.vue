<template>
  <BaseView :routerName="routerName"></BaseView>
</template>

<script setup lang="ts">
import BaseView from "../components/BaseView.vue";
import { eventTagStore, userListStore } from "@/stores/store";
userListStore.getData();
eventTagStore.getTagData();
const routerName = "data";
</script>

<style scoped></style>
