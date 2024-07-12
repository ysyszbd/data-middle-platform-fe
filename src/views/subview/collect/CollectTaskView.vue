<template>
  <div class="main-view">
    <RouterView v-slot="{ Component }">
      <Transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<script setup lang="ts"></script>

<style scoped src="@/assets/css/base.css"></style>
