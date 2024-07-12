<template>
  <el-image
    lazy
    style="width: 100px; height: 80px"
    :src="imageUrl"
    preview-teleported
    fit="contain"
  >
    <template #error>
      <div class="image-slot">
        <div>{{ errTxt }}</div>
      </div>
    </template>
  </el-image>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { getThumbnailImage } from "@/utils/util";

const props = defineProps({
  url: {
    type: String,
    required: true
  }
});

const imageUrl = ref("");
const errTxt = ref("略缩图不存在");

async function getGetImageUrl(url) {
  URL.revokeObjectURL(imageUrl.value);
  let data = await getThumbnailImage(url);
  if ("无权限" == data) {
    errTxt.value = "无权限";
  } else {
    imageUrl.value = data;
  }
}

watch(
  () => props.url,
  (val) => {
    // console.log("222", val);
    getGetImageUrl(val);
  },
  { immediate: true }
);
</script>

<style scoped></style>
