<template>
  <el-dialog
    v-model="videoPlayVisible"
    width="30%"
    draggable
    destroy-on-close
    :before-close="handleClose"
  >
    <template #header>
      <el-select
        v-model="defaultPlaybackRate"
        placeholder="倍数"
        @change="playbackRateChange"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </template>
    <VideoPlayer ref="videoplayer"></VideoPlayer>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessageBox } from "element-plus";

const videoplayer = ref();
const videoPlayVisible = ref(false);
const defaultPlaybackRate = ref(1);
const options = [
  {
    value: 0.5,
    label: "0.5x",
  },
  {
    value: 1,
    label: "1x",
  },
  {
    value: 1.25,
    label: "1.25x",
  },
  {
    value: 1.5,
    label: "1.5x",
  },
  {
    value: 2,
    label: "2x",
  },
  {
    value: 5,
    label: "5x",
  },
  {
    value: 10,
    label: "10x",
  },
];

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭该窗口?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

function playbackRateChange(val) {
  videoplayer.value.playbackRateChange(val);
}

function playVideo(visible, duration, url) {
  defaultPlaybackRate.value = 1;
  videoPlayVisible.value = visible;
  setTimeout(() => {
    videoplayer.value.initVideo(duration, url);
  }, 50);
}

defineExpose({ playVideo });
</script>
