<template>
  <div class="data_show">
    <div class="top">
      <div class="time_picker">
        日期：
        <el-date-picker
          v-model="time"
          type="daterange"
          unlink-panels
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
          value-format=""
          format="YYYY-MM-DD"
          :shortcuts="shortcuts"
          @change="changeTime"
        />
      </div>
      AEB软件版本：
      <el-select
        v-model="model_ver"
        class="m-2 select_item"
        placeholder="Select"
        clearable
        @change="getData()"
      >
        <el-option
          v-for="item in model_ver_list"
          placeholder="请选择软件版本"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      模型版本：
      <el-select
        v-model="post_pro_ver"
        class="m-2 select_item"
        placeholder="Select"
        width="50px"
        @change="getData()"
        clearable
      >
        <el-option
          v-for="item in post_pro_ver_list"
          :key="item"
          placeholder="请选择版本"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
    <div class="draw_box">
      <el-button type="primary">正常测试</el-button>
      <div
        ref="pie_yh_narmal"
        style="width: 100%; height: 376px; background: #fff"
      ></div>
      <div
        ref="bar_yh_narmal"
        style="width: 100%; height: 376px; background: #fff"
      ></div>
    </div>
    <div class="draw_box">
      <el-button type="primary">场地测试</el-button>
      <div
        ref="pie_yh_road"
        style="width: 100%; height: 376px; background: #fff"
      ></div>
      <div
        ref="bar_yh_road"
        style="width: 100%; height: 376px; background: #fff"
      ></div>
    </div>
    <div class="progress" v-show="normalNum?.all > 0">
      <!-- <div class="progress_item">
        <div class="title">正常测试：</div>
        <el-progress
          class="progress_i"
          :text-inside="true"
          :stroke-width="24"
          :percentage="(normal_progress / normalNum?.trigger) * 100"
          >{{ (normal_progress / normalNum?.trigger) * 100 + "%" }}</el-progress
        >
      </div> -->
      <div class="progress_item" v-show="roadNum?.all > 0">
        <div class="title">场地测试：</div>
        <el-progress
          class="progress_i"
          :text-inside="true"
          :stroke-width="24"
          :percentage="(road_progress / roadNum?.all) * 100"
          >{{}}
        </el-progress>
        <div class="progress_num">
          {{
            `${
              ~~((road_progress / roadNum?.all) * 100) > 100
                ? 100
                : ~~((road_progress / roadNum?.all) * 100)
            } %`
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
import { formatDate } from "@/utils/util";
import { getDataApi, getOptionsApi } from "@/axios/dataShow";

const pie_yh_narmal = ref<HTMLElement>();
const bar_yh_narmal = ref<HTMLElement>();
const pie_yh_road = ref<HTMLElement>();
const bar_yh_road = ref<HTMLElement>();
let normalList: any = ref([]),
  roadList: any = ref([]),
  normalNum: any = ref(),
  roadNum: any = ref(),
  road_progress: any = ref(0),
  normal_progress: any = ref(0),
  model_ver: any = ref(),
  model_ver_list: any = ref(),
  post_pro_ver: any = ref(),
  post_pro_ver_list: any = ref();
const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
const typeArr = [
  "",
  "AEB",
  "FCW",
  "AEB + FCW",
  "AWB",
  "AEB + AWB",
  "FCW + AWB",
  "AEB + FCW + AWB",
];
const typeList: any = [
  { kay: "", arr: [] },
  { kay: "AEB", arr: [] },
  { kay: "FCW", arr: [] },
  { kay: "AEB + FCW", arr: [1, 2] },
  { kay: "AWB", arr: [] },
  { kay: "AEB + AWB", arr: [1, 4] },
  { kay: "FCW + AWB", arr: [2, 4] },
  { kay: "AEB + FCW + AWB", arr: [1, 2, 4] },
];
let time: any = ref([]);
getOptions();
onMounted(() => {
  getData();
});
function changeTime(val) {
  console.log(val, "vallll");
  handleTime(val).then((res) => {
    if (res === "1") {
      getData();
    }
  });
}
async function handleTime(val) {
  console.log(val, 'val');
  
  return new Promise((resolve, reject) => {
    let timeArr: any = [];
    if (val) {
      val.forEach((ele) => {
        timeArr.push(formatDate(ele, "-"));
      });
    }
    time.value = timeArr;
    resolve("1");
  });
}
async function getOptions() {
  const res: any = await getOptionsApi({});
  post_pro_ver_list.value = res.data.post_pro_ver;
  model_ver_list.value = res.data.model_ver;
}
async function getData() {
  console.log(time.value, 'time');
  
  const res: any = await getDataApi({
    begin_date: time.value ? time.value[0] : "",
    end_date: time.value ? time.value[1] : "",
    model_ver: model_ver.value,
    post_pro_ver: post_pro_ver.value,
  });
  normalList.value = res.data.normal_trigger;
  roadList.value = res.data.road_trigger;
  normalNum.value = res.data.normal_count;
  roadNum.value = res.data.road_count;
  let normal: any = {
      x: new Array(5).fill(0),
      y: new Array(5).fill(0),
    },
    road: any = {
      x: new Array(5).fill(0),
      y: new Array(5).fill(0),
    };
  res.data.normal_trigger.forEach((item, index) => {
    if (typeList[item.trigger_type].arr.length === 0) {
      normal.x[item.trigger_type] = typeArr[item.trigger_type];
      normal.y[item.trigger_type] = normal.y[item.trigger_type] + item.count;
    } else {
      typeList[item.trigger_type].arr.forEach((ele, i) => {
        normal.y[ele] = normal.y[ele] + item.count;
      });
    }
    normal_progress.value = normal_progress.value + item.count;
  });
  let newArr = normal.y.filter((v) => v),
    newX = normal.x.filter((v) => v);
  normal.y = newArr;
  normal.x = newX;
  res.data.road_trigger.forEach((item, index) => {
    if (typeList[item.trigger_type].arr.length === 0) {
      road.x[item.trigger_type] = typeArr[item.trigger_type];
      road.y[item.trigger_type] = road.y[item.trigger_type] + item.count;
    } else {
      typeList[item.trigger_type].arr.forEach((ele, i) => {
        road.y[ele] = road.y[ele] + item.count;
      });
    }
    road_progress.value = road_progress.value + item.count;
  });
  let newArry = road.y.filter((v) => v),
    newy = road.x.filter((v) => v);
  road.y = newArry;
  road.x = newy;
  drawPie([
    {
      name: "路试数据量",
      value: res.data.normal_count.all - res.data.normal_count.trigger,
    },
    {
      name: "触发次数",
      value: res.data.normal_count.trigger,
    },
  ]);
  drawPieRoad([
    {
      name: "测试次数",
      value: res.data.road_count.all - res.data.road_count.trigger,
    },
    {
      name: "触发次数",
      value: res.data.road_count.trigger,
    },
  ]);
  drawBar(normal);
  drawBarRoad(road);
}
function drawPie(data) {
  let myChart = echarts.init(pie_yh_narmal.value!);
  myChart.setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
}
function drawPieRoad(data) {
  let myChart = echarts.init(pie_yh_road.value!);
  myChart.setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      left: "center",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  });
}

function drawBar(data) {
  let myChart = echarts.init(bar_yh_narmal.value!);
  myChart.setOption({
    tooltip: {
      trigger: "item",
    },
    xAxis: {
      type: "category",
      data: data.x,
      axisLabel: {
        interval: 0,
        show: true,
        formatter: function (params) {
          var newParamsName = "";
          var paramsNameNumber = params.length;
          var provideNumber = 3; //一行显示几个字
          var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
          if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
              var tempStr = "";
              var start = p * provideNumber;
              var end = start + provideNumber;
              if (p == rowNumber - 1) {
                tempStr = params.substring(start, paramsNameNumber);
              } else {
                tempStr = params.substring(start, end) + "\n";
              }
              newParamsName += tempStr;
            }
          } else {
            newParamsName = params;
          }
          return newParamsName;
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        barWidth: "60%",
        data: data.y,
        type: "bar",
      },
    ],
  });
}
function drawBarRoad(data) {
  let myChart = echarts.init(bar_yh_road.value!);
  myChart.setOption({
    tooltip: {
      trigger: "item",
    },
    xAxis: {
      type: "category",
      data: [...data.x],
      axisLabel: {
        interval: 0,
        show: true,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        barWidth: "60%",
        data: data.y,
        type: "bar",
      },
    ],
  });
}
</script>
<style scoped src="@/assets/css/base.css"></style>
<style>
:deep(.el-main) {
  padding: 0 !important;
  box-sizing: border-box !important;
}
</style>
<style lang="scss" scoped>
.data_show {
  width: 100%;
  // height: calc(100% - 400px);
  overflow-y: auto;
  .top {
    height: 32px;
    line-height: 32px;
    margin-bottom: 50px;
    display: flex;
    .time_picker {
      width: 450px;
      display: flex;
      margin-right: 10px;
    }
    .select_item {
      margin-right: 10px;
    }
  }
  .draw_box {
    width: 100%;
    display: flex;
  }
  .progress {
    width: 70%;
    height: 80px;
    .progress_item {
      width: 100%;
      margin: 10px 0;
      display: flex;
      align-items: center;
      // flex-direction: column;
      .title {
        width: 80px;
        flex-shrink: 0;
      }
      .progress_i {
        width: 100%;
        margin: 5px 0;
      }
      .progress_num {
        width: 80px;
      }
    }
  }
}
</style>
