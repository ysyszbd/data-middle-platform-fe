<template>
  <h4 class="margin-top">城市</h4>
  <hr />
  <div ref="el" style="width: 100%; height: 376px; background: #fff"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const el = ref<HTMLElement>();

onMounted(() => {
  drawLine();
});

function drawLine() {
  let myChart = echarts.init(el.value!);

  myChart.setOption({
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: ["北京", "上海", "杭州", "内蒙古", "天津"],
    },
    yAxis: [
      {
        type: "value",
      },
    ],

    series: [
      {
        data: [120, 120, 100, 91, 22],
        type: "bar",
        barWidth: "20%",
      },
    ],
  });
}
</script>

<style scoped src="@/assets/css/base.css"></style>
