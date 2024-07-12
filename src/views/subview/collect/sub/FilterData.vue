<template>
  <el-card>
    <el-row>
      <el-col :span="2"><span>筛选</span></el-col>
      <el-col :span="20">
        <el-input v-model="input1" placeholder="字段名+字段">
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-divider :border-style="borderStyle" />
    <el-row>
      <el-col :span="2"><span>任务</span></el-col>
      <el-col :span="20">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="任务1" />
          <el-checkbox label="任务2" />
          <el-checkbox label="任务3" />
        </el-checkbox-group>
      </el-col>
    </el-row>
    <div v-show="showAllFilter">
      <el-divider :border-style="borderStyle" />
      <el-row>
        <el-col :span="2"><span>车辆</span></el-col>
        <el-col :span="20">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="车辆1" />
            <el-checkbox label="车辆2" />
            <el-checkbox label="车辆3" />
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-divider :border-style="borderStyle" />
      <el-row>
        <el-col :span="2"><span>人员</span></el-col>
        <el-col :span="20">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="人员1" />
            <el-checkbox label="人员2" />
            <el-checkbox label="人员3" />
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-divider :border-style="borderStyle" />
      <el-row>
        <el-col :span="2"><span>时间</span></el-col>
        <el-col :span="20">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="To"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-col>
      </el-row>
    </div>
    <el-divider :border-style="borderStyle" />
    <el-row>
      <el-button
        type="primary"
        :icon="showAllFilterIcon"
        @click="switchAllFilter"
      >
        展开/折叠
      </el-button>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
const input1 = ref("");
const checkList = ref<any>([]);
const borderStyle = ref("dashed");
const showAllFilter = ref(true);
const value1 = ref(0);
const showAllFilterIcon = ref(ArrowUp);

function switchAllFilter() {
  showAllFilter.value = !showAllFilter.value;
  if (true === showAllFilter.value) {
    showAllFilterIcon.value = ArrowUp;
  } else {
    showAllFilterIcon.value = ArrowDown;
  }
}
</script>
<style scoped src="@/assets/css/base.css"></style>
<style scoped>
.el-row {
  justify-content: center;
  align-items: center;
}
.el-divider--horizontal {
  margin: 6px 0;
}
</style>
