<template>
  <BaseView :routerName="routerName"></BaseView>
</template>

<script setup lang="ts">
import BaseView from "../components/BaseView.vue";
import { eventTagStore } from "@/stores/store";
eventTagStore.getTagData();
let routerName = "mark";
</script>

<style scoped></style>
