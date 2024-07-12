<template>
  <div class="container" @click="$emit('clickEvent')">
    <div class="center">
      <img src="@/assets/image/platform.svg" class="img-style" alt="加载失败" />
      <span class="span-style">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  message: String,
});
</script>

<style scoped>
.container {
  position: relative;
  display: flex;
  width: 220px;
  height: 200px;
  background-color: white;
  border-radius: 25px;
  text-align: center;
}
.container:hover {
  cursor: pointer;
  width: 214px;
  height: 194px;
  border: 3px solid #2b89fd;
  box-shadow: 7px 7px 17px rgba(52, 56, 66, 0.5);
}
.center {
  margin: auto;
  width: 100%;
  height: 100%;
  text-align: center;
}
.span-style {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  width: 100%;
}
.img-style {
  margin-top: 20px;
  width: 60%;
}
</style>
