<template>
  <div class="root">
    <div class="base">
      <div style="position: absolute; right: 20px; z-index: 2">
        <el-button type="primary" :icon="Refresh" @click="refreshHandel" />
      </div>
      <el-tabs v-model="activeName" class="tabs-div" @tab-click="handleClick">
        <el-tab-pane lazy label="数据源" name="source">
          <SourceView v-if="'source' == activeName" />
        </el-tab-pane>
        <el-tab-pane lazy label="待审核" name="reviewer">
          <WorkflowView v-if="'reviewer' == activeName" type="flowing" />
        </el-tab-pane>
        <el-tab-pane lazy label="已完成" name="complete">
          <WorkflowView v-if="'complete' == activeName" type="finished" />
        </el-tab-pane>
        <el-tab-pane lazy label="全部" name="all">
          <WorkflowView v-if="'all' == activeName" type="all" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import SourceView from "./sub/datasource/SourceView.vue";
import WorkflowView from "./sub/datasource/WorkflowView.vue";
import EE from "@/utils/event";
import { Refresh } from "@element-plus/icons-vue";
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";

const activeName = ref("source");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  //console.log(tab, event);
};

function refreshHandel() {
  EE.emit("refresh");
}
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
.base {
  position: relative;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.tabs-div {
  height: calc(100% - 0px);
}
.el-tab-pane {
  height: 100%;
}
:deep(.el-tabs__content) {
  height: calc(100% - 55px);
}
</style>
