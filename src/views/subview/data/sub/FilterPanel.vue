<!--
 * @LastEditTime: 2023-07-21 11:20:11
 * @Description: 筛选
-->

<template>
  <div class="root">
    <el-scrollbar always>
      <el-collapse v-model="activeNames">
        <el-collapse-item
          title="采集信息"
          name="collectInfo"
          class="collect_box"
        >
          <el-radio-group
            v-model="searchType"
            @change="switchSearchType"
            class="search_type_btns"
          >
            <el-radio-button
              :label="item.label"
              v-for="(item, index) in dataConfig.screen_tabs[props.pageType]
                .tabs_arr"
              :key="index"
              :title="item.title"
            >
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
          <div class="collect_box_items">
            <el-select
              v-model="filterForm.info.car"
              filterable
              allow-create
              default-first-option
              placeholder="车辆"
              clearable
              style="width: 100%"
              @change="getFile"
              class="collect_item"
            >
              <el-option
                v-for="item in carOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-date-picker
              v-model="filterForm.info.date"
              type="date"
              placeholder="日期"
              style="width: 100%"
              @change="getFile"
              class="collect_item"
            />
            <el-tree-select
              v-model="filterForm.info.location"
              :data="china_city.provinces"
              node-key="cityName"
              value-key="value-key"
              placeholder="地点"
              :highlight-current="true"
              :props="location_props"
              style="width: 100%"
              filterable
              clearable
              @change="getFile"
              class="collect_item"
            />
            <el-select
              v-model="filterForm.sensor_type"
              placeholder="传感器类型"
              clearable
              style="width: 100%"
              @change="getFile"
              class="collect_item"
            >
              <el-option-group
                v-for="group in typeOptions"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-option-group>
            </el-select>
            <el-select
              v-model="filterForm.info.software"
              placeholder="采集软件"
              style="width: 100%"
              clearable
              @change="getFile"
              class="collect_item"
            >
              <el-option
                v-for="item in info_software"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input
              v-model="filterForm.label.self_tag[0].data"
              placeholder="私有标签"
              @input="getFile($event, 'input')"
              clearable
              class="collect_item"
            />
            <el-input
              v-model="filterForm.label.data_tag"
              placeholder="数据标签"
              @input="getFile($event, 'input')"
              clearable
              class="collect_item"
            />
            <el-input
              v-model="filterForm.label.event_tag"
              placeholder="事件标签"
              @input="getFile($event, 'input')"
              clearable
              class="collect_item"
            />
          </div>
        </el-collapse-item>
        <el-collapse-item title="标签信息" name="labelInfo">
          <div style="padding-right: 10px">
            <BaseTagButtonGroup
              v-for="tagGroup in tags.srcTag"
              :key="tagGroup.type"
              :item="tagGroup"
              @tagsChanged="updateCheckboxGroup"
            >
            </BaseTagButtonGroup>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, inject, getCurrentInstance } from "vue";
import { eventTagStore } from "@/stores/store";
import { useStateStore } from "@/stores/state";
import { info_software, carOptions, typeOptions } from "@/utils/data";
import china_city from "@/assets/data/china_city.json";
import { dataConfig } from "@/utils/configData/data_config";
import BaseTagButtonGroup from "./BaseTagButtonGroup.vue";

const emits = defineEmits(["search", "switchSearchType"]);
const props = defineProps(["pageType"]);
const { ctx } = getCurrentInstance() as any;
const FILES_LIST: any = inject("FILES_LIST");
const tags = ref(eventTagStore);
const activeNames = ref([]);
const searchType = ref("path");
const filterForm = ref({
    sensor_type: "",
    basic: {
      type: ""
    },
    info: {
      car: "",
      vin: "",
      date: "",
      location: "",
      platform: "",
      use: "",
      function: "",
      software: ""
    },
    label: {
      tags: [],
      custom_tag: "",
      self_tag: [
        {
          id: 0,
          data: ""
        }
      ],
      data_tag: "",
      event_tag: ""
    }
  }),
  countDown: any = ref({
    num: 4,
    timer: null
  });

const location_props = {
  label: "cityName",
  children: "citys",
  isLeaf: "isLeaf"
};

const checkboxGroup = ref({});

function updateCheckboxGroup(type, value) {
  checkboxGroup.value[type] = value;
  filterForm.value.label.tags = getCheckTags();
  console.log(type, value);
  getFile();
}

function getCheckTags() {
  let array: any = [];
  for (let key in checkboxGroup.value) {
    const element: any = checkboxGroup.value[key];
    array = array.concat(element);
  }
  return array;
}

/**
 * @description: 搜索数据改变则搜索文件
 * @param {*} event element组件的默认传值
 * @param {*} sign  select：直接搜索；input：使用防抖
 * @return {*}
 */
function getFile(event: any = null, sign = "select") {
  if (countDown.value.timer) {
    clearTimeout(countDown.value.timer);
  }
  console.log(searchType.value, "searchType.value=====");

  if (sign === "input") {
    countDown.value.timer = setTimeout(() => {
      FILES_LIST.filterData(filterForm.value);
      FILES_LIST.getFiles("", "search", searchType.value);
    }, 800);
  } else {
    FILES_LIST.filterData(filterForm.value);
    FILES_LIST.getFiles("", "search", searchType.value);
  }
}
function switchSearchType(val) {
  emits("switchSearchType", val);
}
</script>

<style scoped lang="scss">
.root {
  background-color: white;
  padding: 0 8px;
  .collect_box_items {
    .collect_item {
      margin: 4px 0;
    }
  }
}
.search_type_btns {
  width: 100%;
  display: flex;
  :deep(.el-radio-button) {
    width: 50%;
    .el-radio-button__inner {
      width: 100%;
    }
  }
}
</style>
