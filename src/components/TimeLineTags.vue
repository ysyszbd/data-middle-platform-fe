<template>
  <div class="base-box" :class="{ active: getActive() }">
    <el-tooltip :content="type" placement="top-start">
      <div
        style="width: 7px; height: 5px"
        :style="{ background: getColor() }"
      ></div>
    </el-tooltip>

    <div class="base">
      <div
        v-for="(value, index) in videoPercent"
        :key="index"
        class="base-video"
        :style="{
          left: value.startPercent + '%',
          width: value.percent + '%',
        }"
      >
        <el-tooltip
          v-for="(item, index) in getTagByVideo(value.id)"
          :content="eventTagStore.tagId2NameMap.get(item.tag_id)"
          placement="top-start"
          :key="index"
        >
          <div
            class="base-tag"
            :style="{
              left: getLeftPercent(item, value) + '%',
              width: getPercent(item, value) + '%',
              backgroundColor: randomRgb(index),
              top: (index % 2) * 3 + 'px',
            }"
          />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getData } from "@/utils/axios";
import { randomRgb } from "@/utils/util";
import { eventTagStore } from "@/stores/store";
import { video_findBatch } from "@/utils/urlset";

const props = defineProps<{
  type: any;
  data: any;
  color: any;
  highlighted: any;
}>();

const videoPercent = ref<any[]>([]);
let totalTime = 0;

function getLeftPercent(start, src) {
  let parentDuration = src.end_time - src.start_time;
  let letfPercent = start.a_time - src.start_time;
  // console.log(start.id, (letfPercent * 100) / parentDuration);
  return (letfPercent * 100) / parentDuration;
}

function getPercent(start, src) {
  let parentDuration = src.end_time - src.start_time;

  let percent = start.b_time - start.a_time;

  // console.log(start.id, (percent * 100) / parentDuration);

  return (percent * 100) / parentDuration;
}

function getTagByVideo(id) {
  // console.log(props.data.get(id));

  return props.data.get(id);
}

function getActive() {
  return props.highlighted == props.type;
}

function getVideoPercent() {
  if (undefined == props.data) {
    return;
  }

  totalTime = 0;
  let keys = props.data.keys();
  let arr = JSON.stringify(Array.from(keys));
  getData(video_findBatch, { ids: arr }, (data) => {
    let videos = data.data.data;
    videos.forEach((ele) => {
      videoPercent.value.push(ele);
      totalTime += ele.end_time - ele.start_time;
    });
    let startPercent = 0;
    videoPercent.value.forEach((item) => {
      item.startPercent = startPercent;
      item.percent = ((item.end_time - item.start_time) * 100) / totalTime;
      startPercent += item.percent;
    });
  });
}

function getColor() {
  return props.color.get(props.type);
}

function onClick() {
  console.log(props.color);
}

onMounted(() => {
  setTimeout(() => {
    getVideoPercent();
  }, 100);
});
</script>

<style scoped>
.base-box {
  height: 11px;
  border-radius: 3px;
  padding: 1px;
  display: flex;
  align-items: center;
}

.active {
  background-color: #c8c9cc;
}
.base-box:hover {
  background-color: #c6e2ff;
}
.base {
  position: relative;
  width: calc(100% - 10px);
  height: 7px;
  margin-left: 10px;
  border-radius: 2px;
  background-color: #ecf5ff;
}
.base-video {
  position: absolute;
  height: 7px;
  border-radius: 2px;
  left: 0;
  width: 0%;
  border-left: 1px solid #303133;
  border-right: 1px solid #303133;
}

.base-tag {
  position: absolute;
  height: 4px;
  border-radius: 2px;
  left: 0;
  width: 0%;
  background-color: #ff0;
}
</style>
