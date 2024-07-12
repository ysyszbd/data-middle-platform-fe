<template>
  <el-dialog
    v-model="visible"
    title="数据集导入"
    width="40%"
    :before-close="handleClose"
    draggable
    destroy-on-close
    align-center
  >
    <el-form :model="form" :label-width="formLabelWidth">
      <el-form-item label="源地址:">
        <el-tree-select
          v-model="form.sources"
          value-key="index"
          node-key="index"
          lazy
          check-strictly
          :load="loadSources"
          :props="treeProps"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="目标地址:">
        <el-tree-select
          v-model="form.targets"
          value-key="index"
          node-key="index"
          lazy
          check-strictly
          :load="loadTargets"
          :props="treeProps"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="车辆:">
        <el-row style="width: 100%">
          <el-col :span="12">
            <el-input
              v-model="form.info.car"
              placeholder="车型"
              style="width: 100%"
            />
          </el-col>
          <el-col :span="12">
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
          <el-form-item label="采集软件">
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
    <!-- <el-upload drag :auto-upload="false" @on-success="upload">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload> -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submit()"> 开始导入 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import DynamicTag from "./DynamicTag.vue";
import china_city from "@/assets/data/china_city.json";
import { ref, computed } from "vue";
import { ElMessageBox } from "element-plus";
import { getData, create } from "@/utils/axios";
import { source_dir, files_scp } from "@/utils/urlset";
import {
  info_software,
  info_function,
  info_user,
  info_platform
} from "@/utils/data";
const props = defineProps(["visible"]);
const emits = defineEmits(["submit", "update:visible"]);
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  }
});

const formLabelWidth = "100px";

const form = ref({
  sources: "",
  targets: "",
  info: {
    car: "",
    vin: "",
    date: "2023.01.01",
    location: "北京市",
    platform: "TDA",
    use: "执行器测试数据",
    function: "行车 ",
    software: "CarInfo"
  },
  label: {
    tags: [],
    custom_tag: [],
    event_tag: []
  }
});

const treeProps = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf"
};

const location_props = {
  label: "cityName",
  children: "citys",
  isLeaf: "isLeaf"
};

const loadSources = (node, resolve) => {
  if (node.level === 0) {
    getData(
      source_dir,
      { path: "/DMP_DATA_SRC", type: "nas-local" },
      (data) => {
        let list = data.data;
        if (list == null) {
          resolve([]);
        } else {
          list.map((child) => {
            if (child.kind != "dir") {
              child.isLeaf = true;
            }
          });
          if (list.length > 0) {
            form.value.sources = list[0].index;
          }
          resolve(list);
        }
      }
    );
    return;
  }

  getData(source_dir, { path: node.data.index, type: "nas-local" }, (data) => {
    let list = data.data;
    if (list == null) {
      resolve([]);
    } else {
      list.map((child) => {
        if (child.kind != "dir") {
          child.isLeaf = true;
        }
      });
      resolve(list);
    }
  });
};

const loadTargets = (node, resolve) => {
  if (node.level === 0) {
    getData(source_dir, { path: 0, type: "nas" }, (data) => {
      let list = data.data;
      if (list == null) {
        resolve([]);
      } else {
        list.map((child) => {
          if (child.kind != "dir") {
            child.isLeaf = true;
          }
        });
        if (list.length > 0) {
          form.value.targets = list[0].index;
        }
        resolve(list);
      }
    });
    return;
  }

  getData(source_dir, { path: node.data.index, type: "nas" }, (data) => {
    let list = data.data;
    if (list == null) {
      resolve([]);
    } else {
      list.map((child) => {
        if (child.kind != "dir") {
          child.isLeaf = true;
        }
      });
      resolve(list);
    }
  });
};

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭此对话框吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

function submit() {
  visible.value = false;
  emits("submit", form.value);

  let info = {
    info: form.value.info,
    label: form.value.label
  };
  create(
    files_scp,
    {
      from: { path: form.value.sources, type: "nas-local" },
      to: { path: form.value.targets, type: "nas" },
      info: info
    },
    (data) => {
      console.log(data);
    }
  );
}
</script>

<style scoped></style>
