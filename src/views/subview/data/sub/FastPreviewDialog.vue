<template>
  <el-dialog
    v-model="visible"
    :title="data.basic.name"
    width="80%"
    draggable
    align-center
  >
    <div class="el-dialog-div">
      <BaseSourceImage
        v-if="data.basic.type == 'image'"
        :url="data.basic.url"
      />
      <div v-else-if="data.basic.type == 'video'">
        <vue3VideoPlay
          width="100%"
          height="100%"
          :title="data.basic.name"
          :src="options.src"
          :type="options.type"
          :autoPlay="false"
        />
      </div>
      <iframe
        v-else-if="data.type == 'txt'"
        src="/1.txt"
        name="iframe_a"
      ></iframe>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import BaseSourceImage from "./BaseSourceImage.vue";
import { ref, computed } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  data: { type: Object, required: true }
});
const emit = defineEmits(["update:visible"]);
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  }
});
const options = ref({
  src: "", //视频源
  type: "m3u8" //视频类型
});
</script>

<style scoped>
.el-dialog-div {
  height: 80vh;
  overflow-x: hidden;
}
</style>
