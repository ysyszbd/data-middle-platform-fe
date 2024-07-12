<template>
  <div class="main-view">
    <el-scrollbar>
      <el-card>
        <template #header>
          <div class="card-header">
            <router-link to="/collect/data-management/list">返回</router-link>
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
            <el-col :span="6">
              <span>数据大小</span>
              <span class="margin-top">{{ count }}</span>
            </el-col>
            <el-col :span="6">
              <span>时长</span>
              <span class="margin-top">{{ count }}</span>
            </el-col>
            <el-col :span="6" :offset="4">
              <span>时间轴标注状态</span>
              <el-button type="success" class="margin-top" @click="showStatus"
                >{{ status }}
              </el-button>
              <NoteStatusDialog />
            </el-col>
            <el-col :span="2" class="card-header">
              <el-button type="primary" @click="deleteData">删除</el-button>
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
import NoteStatusDialog from "./NoteStatusDialog.vue";
import ThumbnailView from "./ThumbnailView.vue";

import { useRoute } from "vue-router";

const route = useRoute();

const taskId = ref("FGG45GSD5G4G45456DG454545G");
const count = ref(100);
const status = ref("等待分发任务");

onMounted(() => {
  taskId.value = route.params.id.toString();
  console.log(route.params);
});

const statusDialogVisible = ref(false);
provide("statusDialogVisible", statusDialogVisible);

const { toClipboard } = useClipboard();

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

function deleteData(params: any) {
  console.log(params);
}

function showStatus() {
  statusDialogVisible.value = true;
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
