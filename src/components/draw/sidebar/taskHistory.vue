<!--
 * @LastEditTime: 2023-06-30 10:58:38
 * @Description: 工作流历史记录
-->
<template>
  <div class="task_history_box">
    <el-timeline v-show="props.taskHistoryList?.length > 0">
      <el-timeline-item
        v-for="(item, index) in props.taskHistoryList"
        :key="index"
        :type="typeArr[item.action]"
        size="normal"
        :timestamp="item.created_time"
      >
        {{ item.comment }}
      </el-timeline-item>
    </el-timeline>
    <emptyBox
      v-show="props.taskHistoryList?.length <= 0"
      :text="`暂无历史记录~`"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { emptyBox } from "@/components/draw/drawComponents";

const props = defineProps(["taskHistoryList"]);
const typeArr = {
  approve: "primary",
  finish: "success",
  annotation_reject: "info",
};
</script>

<style lang="scss" scoped>
.task_history_box {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
}
</style>
