<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>资产看板</span>
      </div>
    </template>
    <div>
      <h4 class="margin-top">监控统计</h4>
      <hr />
      <div class="margin-top">
        <el-row :gutter="20">
          <el-col :span="6">
            <span>已标注任务</span>
            <span class="margin-top">{{ count }}</span>
          </el-col>
          <el-col :span="6">
            <span>进行中任务</span>
            <span class="margin-top">{{ count }}</span>
          </el-col>
          <el-col :span="6">
            <span>待开始任务</span>
            <span class="margin-top">{{ count }}</span>
          </el-col>
          <el-col :span="6">
            <span>其他</span>
            <span class="margin-top">{{ count }}</span>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="margin-top h-v-center">
          <el-col :span="3">
            <span>发起方任务总量</span>
            <span class="margin-top">{{ count }}</span>
          </el-col>
          <el-col :span="15">
            <div
              ref="elLaunch"
              style="width: 100%; height: 200px; background: #fff"
            ></div>
          </el-col>
          <el-col :span="6">
            <el-progress type="dashboard" :percentage="90">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
                <span class="percentage-label">通过率</span>
              </template>
            </el-progress>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="margin-top h-v-center">
          <el-col :span="3">
            <span>接收方任务总量</span>
            <span class="margin-top">{{ count }}</span>
          </el-col>
          <el-col :span="15">
            <div
              ref="elRecive"
              style="width: 100%; height: 200px; background: #fff"
            ></div>
          </el-col>
          <el-col :span="6">
            <el-progress type="dashboard" :percentage="100" status="success">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
                <span class="percentage-label">通过率</span>
              </template>
            </el-progress>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const count = ref(0);
const elLaunch: any = ref<HTMLElement | null>(null);
const elRecive: any = ref<HTMLElement | null>(null);

onMounted(() => {
  drawLine();
});

function drawLine() {
  let myChart = echarts.init(elLaunch.value!);
  let myChart2 = echarts.init(elRecive.value!);

  let option = {
    yAxis: {
      type: "category",
      data: ["任务量", "验收量"],
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    },
    xAxis: {
      type: "value",
    },
    series: [
      {
        data: [200, 120],
        type: "bar",
      },
    ],
  };

  myChart.setOption(option);
  myChart2.setOption(option);
}
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>
