<template>
  <div style="position: absolute; height: 100%; width: 100%">
    <el-scrollbar height="100%">
      <div style="position: absolute; width: calc(100% - 112px); height: 100%">
        <div class="timeLine" :style="{ left: timeLinePose + '%' }">
          <p
            style="
              position: absolute;
              bottom: 0px;
              margin-left: -92px;
              width: 200px;
            "
          >
            {{ timeLineDetital }}
          </p>
        </div>
      </div>

      <MarkSlider
        v-for="(value, index) in currentVideoData"
        :key="index"
        :datas="value"
      />
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getData } from "@/utils/axios";
import { eventTagStore } from "@/stores/store";
import MarkSlider from "@/components/subComponents/MarkSlider.vue";
import dayjs from "dayjs";
import { get_albums_timeLineTag } from "@/utils/urlset";

const typeMap = ref();
const currentVideoData = ref<any[]>([]);
const timeLinePose = ref(0);
const timeLineDetital = ref("");

const props = defineProps<{
  playVideoData: any;
}>();

function fmtTimeLineTag(data) {
  let tagsMap = new Map();
  data.forEach((ele) => {
    let typeName = eventTagStore.tag2TypeMap.get(ele.tag_id);
    if (undefined == tagsMap.get(typeName)) {
      let videoMap = new Map();
      let datas: any[] = [];
      datas.push(ele);
      videoMap.set(ele.video_id, datas);
      tagsMap.set(typeName, videoMap);
    } else {
      let value = tagsMap.get(typeName);
      if (undefined == value.get(ele.video_id)) {
        let datas: any[] = [];
        datas.push(ele);
        value.set(ele.video_id, datas);
      } else {
        value.get(ele.video_id).push(ele);
      }
    }
  });
  return tagsMap;
}

function getVideoDatas() {
  currentVideoData.value = [];

  for (let [key, value] of typeMap.value) {
    if (undefined != value.get(props.playVideoData.id)) {
      let data = {
        id: value.id,
        type: key,
        details: props.playVideoData,
        data: value.get(props.playVideoData.id),
      };
      currentVideoData.value.push(data);
    }
  }
  console.log("currentVideoData", currentVideoData.value);
}

function update(id) {
  getData(
    get_albums_timeLineTag,
    {
      ids: JSON.stringify([id]),
      tag_ids: JSON.stringify(eventTagStore.allTag),
    },
    (data) => {
      let array = data.list.data;
      if (array != undefined) {
        typeMap.value = fmtTimeLineTag(array);
        getVideoDatas();
      } else {
        typeMap.value = [];
      }
    }
  );
}

function setTimeLinePose(leftTime) {
  let parentDuration =
    props.playVideoData.end_time - props.playVideoData.start_time;

  timeLinePose.value =
    ((leftTime - props.playVideoData.start_time) * 100) / parentDuration;
  timeLineDetital.value = dayjs(leftTime).format("YYYY-MM-DD HH:mm:ss:SSS");
}

defineExpose({ update, setTimeLinePose });
</script>

<style scoped>
.timeLine {
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: #0f0;
  z-index: 3;
}
</style>
