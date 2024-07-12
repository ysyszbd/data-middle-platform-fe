<template>
  <div class="main-view">
    <el-scrollbar>
      <el-card>
        <template #header>
          <div class="card-header">
            <router-link to="/collect/collect-task/list">返回</router-link>
            <span>{{ taskId }}</span>
            <el-button text type="primary" @click="copy"
              >获取任务识别码
            </el-button>
          </div>
        </template>
        <DataDetailsShow />
        <el-divider />
        <el-card class="box-card margin-top">
          <el-row :gutter="20">
            <el-col :span="4">
              <span>存储路径</span>
              <span class="margin-top">{{ count }}</span>
            </el-col>
            <el-col :span="4">
              <span>数据进度</span>
              <span class="margin-top">{{ count }}</span>
            </el-col>
            <el-col :span="4">
              <span>剩余时间</span>
              <span class="margin-top">{{ count }}</span>
            </el-col>
            <el-col :span="4">
              <span>数据大小</span>
              <span class="margin-top">{{ count }}</span>
            </el-col>
            <el-col :span="2">
              <span>时长</span>
              <span class="margin-top">{{ count }}</span>
            </el-col>
            <el-col :span="2" class="card-header">
              <el-button type="primary" @click="deleteData">删除</el-button>
            </el-col>
            <el-col :span="4" class="card-header">
              <el-button type="primary" @click.prevent="createTimeLine()">
                创建标注任务
              </el-button>
              <TimelineInfoEdit @submit="createData" />
            </el-col>
          </el-row>
        </el-card>
        <ThumbnailView class="margin-top" />
      </el-card>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, onMounted } from "vue";
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import DataDetailsShow from "./DataDetailsShow.vue";
import ThumbnailView from "./ThumbnailView.vue";
import TimelineInfoEdit from "@/components/subComponents/CreateAnnotationTask.vue";
import { useStateStore } from "@/stores/state";
import { useRoute, useRouter } from "vue-router";
import { create, deleteRow } from "@/utils/axios";
import { collectiontask_delete, labeltask_create } from "@/utils/urlset";

const store = useStateStore();
const router = useRouter();
const route = useRoute();
const taskId = ref("FGG45GSD5G4G45456DG454545G");
const count = ref(100);

onMounted(() => {
  taskId.value = route.params.id.toString();
  console.log(route.params);
});

const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const { toClipboard } = useClipboard();

// const emit = defineEmits<{
//   (e: "details", isshow: boolean): void;
// }>();

function createTimeLine() {
  dialogVisible.value = true;
}

function createData(form: any) {
  form.collection_task_id = Number(taskId.value);
  create(labeltask_create, form, tmpFunctions);
}

function tmpFunctions() {
  dialogVisible.value = false;
}

function goBack() {
  router.push("/collect/collect-task/list");
}

const copy = async () => {
  try {
    await toClipboard(taskId.value);
    ElMessage({
      message: "已复制",
      type: "success",
      grouping: true,
      center: true,
    });
  } catch (e) {
    console.error(e);
  }
};

function deleteData(params) {
  deleteRow(collectiontask_delete, { id: Number(route.params.id) }, goBack);
}
</script>
<style scoped src="@/assets/css/base.css"></style>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
