<template>
  <el-table
    ref="singleTableRef"
    :data="albumVideosDetial"
    highlight-current-row
    :header-cell-style="tableHeaderStyle"
  >
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column prop="car_plate" label="车辆" />
    <el-table-column prop="thumbnail" label="缩略图">
      <template #default="_scope">
        <div class="v-center">
          <el-image
            style="height: 23px"
            :src="url"
            :preview-src-list="srcList"
            preview-teleported
            fit="cover"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="80">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="playVideo(scope)"
          >播放
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData } from "@/utils/axios";
import { useStateStore } from "@/stores/state";
import { ElTable } from "element-plus";
import { get_album_videos, video_findBatch } from "@/utils/urlset";

const singleTableRef = ref<InstanceType<typeof ElTable>>();
const store = useStateStore();
const albumVideos = ref();
const albumVideosDetial = ref();

const url =
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
const srcList = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
];

const emit = defineEmits<{
  (e: "play", data): void;
}>();

function playVideo(data) {
  emit("play", albumVideosDetial.value.slice(data.$index));
}

function getAlbumVideos(id) {
  getData(get_album_videos, { ids: JSON.stringify([id]) }, (data) => {
    if (data.data.data != undefined) {
      albumVideos.value = data.data.data[0].video_ids;
      getAlbumDetailVideos(JSON.stringify(data.data.data[0].video_ids));
    } else {
      albumVideos.value = [];
      albumVideosDetial.value = [];
    }
  });
}

function getAlbumDetailVideos(ids) {
  getData(video_findBatch, { ids: ids }, (data) => {
    albumVideosDetial.value = data.data.data;
    albumVideosDetial.value.forEach((item) => {
      item.type = "video";
      item.name = item.url.split("/").pop();
    });
  });
}

const setCurrent = (row) => {
  singleTableRef.value!.setCurrentRow(row);
};

onMounted(() => {
  let id = store.getTimeLineTaskId;
  // console.log("getTimeLineTaskId", id);

  getAlbumVideos(Number(id));
});

defineExpose({ setCurrent });
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
.el-dialog__wrapper {
  pointer-events: none;
}
.el-dialog {
  pointer-events: auto;
}
</style>
