<!--
 * @LastEditTime: 2023-07-13 10:51:21
 * @Description: 图片展示--判断权限
-->
<template>
  <el-image
    v-if="props?.type === 'img'"
    :src="imageUrl"
    :preview-src-list="imageUrlArr"
    preview-teleported
    fit="cover"
  />
  <image v-else :href="imageUrl"></image>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps } from "vue";
import { getSourceImage } from "@/utils/util";
import { dataEvents } from "@/components/draw/event/events";
import { ObserverInstance } from "@/components/draw/event/observer";

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "img",
  },
});

const imageUrl = ref("");
const imageUrlArr = computed(() => {
  return [imageUrl.value];
});

async function getGetImageUrl(url) {
  URL.revokeObjectURL(imageUrl.value);
  let data = await getSourceImage(url);
  console.log(data, "data");
  if (data != "无权限") {
    imageUrl.value = data;
  } else {
    ObserverInstance.emit(dataEvents.NO_ROLE_UPDATE);
  }
}

watch(
  () => props.url,
  (val) => {
    // console.log("111", val);
    getGetImageUrl(val);
  },
  { immediate: true }
);
</script>

<style scoped></style>
