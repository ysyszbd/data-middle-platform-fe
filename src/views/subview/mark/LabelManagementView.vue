<template>
  <div class="root">
    <el-tabs v-model="activeName" class="tabs" @tab-change="handleClick">
      <el-tab-pane label="环境标签" name="1">
        <div>
          <el-button type="primary" @click="dialogVisible = true"
            >创建标签
          </el-button>
          <!-- <el-button type="primary" @click="dialogUpdateVisible = true"
            >修改标签
          </el-button> -->
          <LabelInfoEdit @submit="createData" />
          <!-- <LabelInfoUpdate @submit="updateData" /> -->
        </div>
        <LabelPanel :typeShow="true" />
      </el-tab-pane>
      <el-tab-pane label="图片标签" name="2"> </el-tab-pane>
      <el-tab-pane label="视频标签" name="3"> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from "vue";
import { create, updateIdParameter } from "@/utils/axios";
import LabelInfoEdit from "@/components/subComponents/LabelInfoEdit.vue";
import LabelInfoUpdate from "@/components/subComponents/LabelInfoUpdate.vue";
import LabelPanel from "./sub/LabelPanel.vue";
import { envtag_create, envtag_update } from "@/utils/urlset";

const activeName = ref("1");
const dialogVisible = ref(false);
provide("dialogVisible", dialogVisible);

const dialogUpdateVisible = ref(false);
provide("dialogUpdateVisible", dialogUpdateVisible);

const handleClick = (name) => {
  console.log(name);
};

function createData(data) {
  create(envtag_create, data, getTableData);
}

function updateData(data) {
  updateIdParameter(envtag_update, data, getTableData);
}

function getTableData() {
  dialogVisible.value = false;
}
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
:deep(.el-tabs__content) {
  color: #6b778c;
}
.tabs {
  padding: 10px;
}
</style>
