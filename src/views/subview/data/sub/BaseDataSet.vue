<template>
  <div
    class="album-box"
    :class="{ active: checked }"
    @click="boxClick()"
    @dblclick="boxDbClick()"
  >
    <div class="operation" @click.stop="" @dblclick.stop="">
      <el-checkbox
        v-model="checked"
        label=""
        size="small"
        @change="change"
        class="checkBox"
      />
    </div>
    <div v-if="data.basic.type == 'dir' || data.basic.type == 'album'">
      <div
        class="img-style"
        :class="{
          'img-style-normal': data.status == 'entrusted',
          'img-style-blue': data.status == 'mount',
          'img-style-none': data.status != 'entrusted' && data.status != 'mount'
        }"
      />
      <div class="name">{{ data.basic.name }}</div>
    </div>
    <div v-else>
      <BaseThumbnailImage :url="data.basic.url" />
      <div v-show="data.basic.type === 'video'" class="play" @click.stop="">
        <el-icon><VideoCamera /></el-icon>
      </div>
      <div
        style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
      >
        {{ data.basic.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseThumbnailImage from "./BaseThumbnailImage.vue";
import { ref } from "vue";
import { VideoCamera } from "@element-plus/icons-vue";

const props = defineProps<{
  data: any;
}>();
const checked = ref(false);
const emit = defineEmits<{
  (e: "select", value: any, data): void;
  (e: "boxClick", value: any): void;
  (e: "boxDbClick", value: any): void;
}>();

function change(value) {
  emit("select", value, props.data);
}

function boxClick() {
  emit("boxClick", props.data);
}

function boxDbClick() {
  if (props.data.basic.type == "dir" || props.data.basic.type == "album")
    emit("boxDbClick", props.data);
}
</script>

<style scoped>
.operation {
  position: relative;
  right: 0;
  height: 24px;
}

.checkBox {
  position: absolute;
  right: 10px;
}

.name {
  font-size: 12px;
  color: rgb(36, 34, 34);
}
.album-box {
  width: 120px;
  height: 158px;
  margin: 10px;
  text-align: center;
  border: 1px solid rgb(219, 219, 219);
  box-sizing: border-box;
  border-radius: 5px;
}
.album-box:hover {
  /* border-radius: 6px; */
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(52, 56, 66, 0.5);
}

.active {
  margin: 7px;
  border: 3px solid #2b89fd;
  border-radius: 6px;
  transform: rotate(0deg);
}
.active::before {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  border: 12px solid #2b89fd;
  border-top-color: transparent;
  border-left-color: transparent;
}
.active::after {
  content: "";
  display: block;
  width: 5px;
  height: 10px;
  position: absolute;
  right: 4px;
  bottom: 5px;
  border: 1px solid #fff;
  border-top-color: transparent;
  border-left-color: transparent;
  transform: rotate(45deg);
  cursor: pointer;
}
.img-style {
  background-size: 80px, 80px;
  display: inline-block;
  width: 80px;
  height: 80px;
  mask-size: cover;
}
.img-style-normal {
  background-image: url("@/assets/image/ic_file.svg");
}
.img-style-blue {
  background-image: url("@/assets/image/ic_file_blue.svg");
}
.img-style-none {
  background-image: url("@/assets/image/ic_file_none.svg");
}
</style>
