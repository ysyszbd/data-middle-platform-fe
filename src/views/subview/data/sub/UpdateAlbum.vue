<template>
  <div>
    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      size="50%"
      :before-close="handleClose"
    >
      <template #title>
        <h4>设置内容</h4>
      </template>
      <template #default>
        <div>
          <el-row>
            <el-col :span="11">
              <BaseTable
                ref="imageTableRef"
                searchName="图片"
                :getListUrl="image_list"
                :hasDatas="hasImages"
              ></BaseTable>
            </el-col>
            <el-col :span="11" :offset="2">
              <BaseTable
                ref="videoTableRef"
                searchName="视频"
                :getListUrl="video_list"
                :hasDatas="hasVideos"
              ></BaseTable>
            </el-col>
          </el-row>
        </div>
        <div></div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">更新</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { ref, inject, watch } from "vue";
import { useRoute } from "vue-router";
import { updateIdParameter } from "@/utils/axios";
import BaseTable from "./BaseTable.vue";
import {
  video_list,
  image_list,
  set_album_videos,
  set_album_images,
} from "@/utils/urlset";

const props = defineProps<{
  hasVideos: [];
  hasImages: [];
}>();

const route = useRoute();
const videoTableRef = ref();
const imageTableRef = ref();

const drawerVisible = inject("updateDrawerVisible", ref(false));

watch(drawerVisible, (newDrawerVisible) => {
  if (newDrawerVisible === true) {
    setTimeout(function () {
      videoTableRef.value.getAlbumDatas();
      imageTableRef.value.getAlbumDatas();
    }, 50);
  } else {
    setTimeout(function () {
      videoTableRef.value.setAlbumDatas([]);
      imageTableRef.value.setAlbumDatas([]);
    }, 50);
  }
});

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

function cancelClick() {
  drawerVisible.value = false;
}

function setAlbumVideos() {
  let array = videoTableRef.value.getSelected();

  const data = {
    album_id: Number(route.params.id),
    video_ids: array,
  };
  updateIdParameter(set_album_videos, data, update);
}

function setAlbumImages() {
  let array = imageTableRef.value.getSelected();

  const data = {
    album_id: Number(route.params.id),
    image_ids: array,
  };
  updateIdParameter(set_album_images, data, update);
}

function update() {
  emit("submit");
}

function confirmClick() {
  setAlbumVideos();
  setAlbumImages();
  cancelClick();
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__header) {
  margin-bottom: 0px;
}
</style>
