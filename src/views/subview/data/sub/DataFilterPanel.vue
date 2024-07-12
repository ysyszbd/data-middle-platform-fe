<template>
  <div
    class="filter-panel"
    :class="{ active: showAllFilter }"
    :style="{ width: 'calc(100% - ' + rightWidth + 'px)' }"
    @click.stop=""
  >
    <div>
      <el-row :gutter="5">
        <el-col :span="3">
          <el-select
            v-model="filterForm.info.car"
            filterable
            allow-create
            default-first-option
            placeholder="车辆"
            clearable
          >
            <el-option
              v-for="item in carOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-date-picker
            v-model="filterForm.info.date"
            type="date"
            placeholder="日期"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="3">
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
          />
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="filterForm.sensor_type"
            placeholder="传感器类型"
            clearable
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
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="filterForm.info.platform"
            placeholder="平台"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in info_platform"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row v-show="showAllFilter" :gutter="5">
        <el-col :span="3">
          <el-tree-select
            v-model="filterForm.info.use"
            :data="info_user"
            :render-after-expand="false"
            style="width: 100%"
            placeholder="用途"
            clearable
          />
        </el-col>
        <el-col :span="3">
          <el-select
            v-model="filterForm.info.software"
            placeholder="采集软件"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in info_software"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="filterForm.label.self_tag[0].data"
            placeholder="私有标签"
            clearable
          />
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="filterForm.label.data_tag"
            placeholder="数据标签"
            clearable
          />
        </el-col>
        <el-col :span="3">
          <el-input
            v-model="filterForm.label.event_tag"
            placeholder="事件标签"
            clearable
          />
        </el-col>
      </el-row>
      <el-row v-show="showAllFilter && typeShow">
        <el-col :span="15">
          <el-radio-group v-model="filterForm.basic.type">
            <el-radio label="dir">文件夹</el-radio>
            <el-radio label="image">图片</el-radio>
            <el-radio label="video">视频</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <div class="filter-button">
        <el-button type="primary" :icon="Search" @click="search">
          搜索
        </el-button>
        <el-button
          type="primary"
          :icon="showAllFilterIcon"
          @click="switchAllFilter"
        >
          展开/折叠
        </el-button>
      </div>
    </div>
    <TransitionGroup tag="ul" name="fade" class="container">
      <div
        style="border: 0px solid #c6e2ff; display: flex; align-items: center"
        v-for="item in tagsTmp"
        :key="item.type"
      >
        <BaseEventGroup :item="item" @tagsChanged="updateCheckboxGroup" />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted, onUnmounted } from "vue";
import { ArrowDown, ArrowUp, Search } from "@element-plus/icons-vue";
import BaseEventGroup from "./BaseEventGroup.vue";
import china_city from "@/assets/data/china_city.json";
import { info_software, info_user, info_platform } from "@/utils/data";
import { eventTagStore } from "@/stores/store";

const showAllFilter = ref(false);
const showAllFilterIcon = ref(markRaw(ArrowDown));
const tagsTmp = ref<any[]>([]);
const checkboxGroup = ref({});

const props = defineProps<{
  rightWidth?: number;
  typeShow: boolean;
}>();

const filterForm = ref({
  sensor_type: "",
  basic: {
    type: "",
  },
  info: {
    car: "",
    vin: "",
    date: "",
    location: "",
    platform: "",
    use: "",
    function: "",
    software: "",
  },
  label: {
    tags: [],
    custom_tag: "",
    self_tag: [
      {
        id: 0,
        data: "",
      },
    ],
    data_tag: "",
    event_tag: "",
  },
});

const location_props = {
  label: "cityName",
  children: "citys",
  isLeaf: "isLeaf",
};

const typeOptions = [
  {
    label: "摄像头",
    options: [
      {
        value: "前视",
        label: "前视",
      },
      {
        value: "侧视",
        label: "侧视",
      },
    ],
  },
  {
    label: "激光雷达",
    options: [
      {
        value: "前",
        label: "前",
      },
      {
        value: "后",
        label: "后",
      },
    ],
  },
];

const carOptions = [
  {
    label: "京A11111",
    value: "京A11111",
  },
  {
    label: "京A22222",
    value: "京A22222",
  },
];

const emit = defineEmits<{
  (e: "search", value: any): void;
}>();

function updateCheckboxGroup(type, value) {
  checkboxGroup.value[type] = value;
  filterForm.value.label.tags = getCheckTags();
}

function search() {
  emit("search", filterForm.value);
  console.log(filterForm.value);

  if (showAllFilter.value) {
    switchAllFilter();
  }
  filterForm.value.label.tags = [];
}

function switchAllFilter() {
  showAllFilter.value = !showAllFilter.value;

  if (showAllFilter.value) {
    showAllFilterIcon.value = markRaw(ArrowUp);
    tagsTmp.value = eventTagStore.srcTag;
    document.body.onclick = (e) => {
      showAllFilter.value = true;
      switchAllFilter();
    };
  } else {
    showAllFilterIcon.value = markRaw(ArrowDown);
    tagsTmp.value = [];
    document.body.onclick = null;
  }
}

function getCheckTags() {
  let array: any = [];
  for (let key in checkboxGroup.value) {
    const element: any = checkboxGroup.value[key];
    array = array.concat(element);
  }
  return array;
}
</script>

<style scoped>
.filter-button {
  position: absolute;
  top: 4px;
  right: 20px;
}

.filter-panel {
  position: relative;
  padding: 4px;
  z-index: 2;
  background-color: #fff;
  border-radius: 4px;
  transition: width 0.5s;
}

.active {
  width: calc(100% + 360px) !important;
  border: 1px solid #bbb;
  padding-top: 3px;
  padding-left: 3px;
}

/* 1. 声明过渡效果 */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}
</style>
