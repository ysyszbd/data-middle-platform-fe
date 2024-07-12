<!--
 * @LastEditTime: 2023-08-21 15:41:52
 * @Description: 
-->
<template>
  <h4 class="margin-top">传感器</h4>
  <hr />
  <div ref="el" style="width: 100%; height: 376px; background: #fff"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const el: any = ref<HTMLElement | null>(null);

onMounted(() => {
  drawLine();
});

function drawLine() {
  let myChart = echarts.init(el.value!);

  myChart.setOption({
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "传感器",
        type: "pie",
        radius: "80%",
        data: [
          { value: 100, name: "激光雷达" },
          { value: 140, name: "摄像头" },
        ],
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        label: {
          alignTo: "edge",
          formatter: "{name|{b}} {value|{c}}",
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: 15,
          rich: {
            time: {
              fontSize: 10,
              color: "#999",
            },
          },
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80,
        },
      },
    ],
  });
  myChart.on("click", function (params) {
    alert(params.name + " " + params.value);
  });
}
</script>

<style scoped src="@/assets/css/base.css"></style>
