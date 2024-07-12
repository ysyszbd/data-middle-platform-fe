<template>
  <BaseView :routerName="routerName"></BaseView>
</template>

<script setup lang="ts">
import BaseView from "../components/BaseView.vue";
let routerName = "question";
console.log(routerName, "routerName");

</script>

<style scoped></style>
