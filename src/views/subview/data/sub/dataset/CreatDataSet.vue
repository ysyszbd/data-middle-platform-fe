<template>
  <el-dialog
    v-model="visible"
    @open="open(true)"
    @close="open(false)"
    destroy-on-close
  >
    <template #header>
      <h4>创建数据集</h4>
    </template>
    <template #default>
      <el-form label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="车辆:">
          <el-row style="width: 100%">
            <el-col :span="11">
              <el-input
                v-model="form.info.car"
                placeholder="车型"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="11" :offset="2">
              <el-input
                v-model="form.info.vin"
                placeholder="VIN"
                style="width: 100%"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期">
              <el-date-picker
                v-model="form.info.date"
                type="date"
                placeholder="日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="软件">
              <el-select
                v-model="form.info.software"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in info_software"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="width: 100%">
          <el-col :span="12">
            <el-form-item label="地点">
              <el-tree-select
                v-model="form.info.location"
                :data="china_city.provinces"
                node-key="cityName"
                value-key="value-key"
                :props="location_props"
                style="width: 100%"
                filterable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台">
              <el-select
                v-model="form.info.platform"
                placeholder="平台"
                style="width: 100%"
              >
                <el-option
                  v-for="item in info_platform"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用途">
              <el-tree-select
                v-model="form.info.use"
                :data="info_user"
                :render-after-expand="false"
                :disabled="infoUseDisable"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="功能">
              <el-select
                v-model="form.info.function"
                placeholder="功能"
                style="width: 100%"
              >
                <el-option
                  v-for="item in info_function"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="自定义标签">
              <DynamicTag v-model="form.label.custom_tag" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件标签">
              <DynamicTag v-model="form.label.event_tag" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">创建</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import DynamicTag from "../DynamicTag.vue";
import china_city from "@/assets/data/china_city.json";
import { ref, computed } from "vue";
import { postData } from "@/utils/axios";
import { file_create_album } from "@/utils/urlset";
import { ElMessage } from "element-plus";
import {
  info_software,
  info_function,
  info_user,
  info_platform
} from "@/utils/data";

const props = defineProps(["visible", "url", "info_use"]);
const emits = defineEmits(["update:visible", "submit"]);
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  }
});

const location_props = {
  label: "cityName",
  children: "citys",
  isLeaf: "isLeaf"
};

const form = ref({
  source_id: 0,
  url: "",
  source_type: "album",
  info: {
    car: "",
    vin: "",
    date: "2023.01.01",
    location: "北京市",
    platform: "TDA",
    use: "softwaretest",
    function: "行车 ",
    software: "CarInfo"
  },
  label: {
    tags: [],
    custom_tag: [],
    event_tag: []
  }
});

const infoUseDisable = computed(() => {
  console.log(props.url);

  return props.url == "" ? false : true;
});

function open(value) {
  form.value.url = "";
  form.value.info.use = props.info_use;
}

function cancelClick() {
  visible.value = false;
}

function confirmClick() {
  let formData = { ...form.value };
  if ("" == props.url) {
    formData.url = "album/" + formData.url;
  } else {
    formData.url = props.url + "/" + formData.url;
  }
  postData(file_create_album, formData, () => {
    ElMessage.success("创建成功.");
    emits("submit");
    visible.value = false;
  });
}
</script>

<style scoped lang="scss">
:global(.el-drawer) {
  --el-drawer-padding-primary: 10px !important;
}
:global(.el-drawer__header) {
  margin-bottom: 0px !important;
}
.el-card {
  --el-card-padding: 10px;
}
</style>
