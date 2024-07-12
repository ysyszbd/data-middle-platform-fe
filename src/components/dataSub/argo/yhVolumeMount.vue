<!--
 * @LastEditTime: 2023-10-23 11:29:20
 * @Description: 
-->
<template>
  <div class="yh_volume_mount">
    <div
      v-for="(item, index) in data"
      :key="`yh_volume_mount` + index"
      class="yh_volume_mount_item"
    >
      <el-select
        v-model="item.type"
        style="width: 100px; margin-right: 4px"
        v-if="TASK_PROVIDE.Keyword.value === 'notebook'"
        @change="changeType(index)"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.id"
          :label="item.value"
          :value="item.id"
        />
      </el-select>
      <el-input
        :disabled="item.type != 'pipeline-pvc'"
        v-model="item.name"
        placeholder="请填写名称"
        style="width: 150px; margin-right: 4px"
        @input="inputFun($event, index, 'name')"
        @blur="blurFun(index, 'name')"
      />
      <el-tree-select
        v-if="item.type === 'album-pvc'"
        v-model="item.source_all"
        :data="files"
        value-key="id"
        node-key="url"
        check-strictly
        :props="props_obj"
        lazy
        :load="load"
        style="width: 200px; margin-right: 4px"
        @node-click="handleChange($event, index, item.type)"
        placeholder="请选择文件夹"
      >
      </el-tree-select>
      <el-select-v2
        v-else
        v-model="item.source"
        style="width: 200px; margin-right: 4px"
        filterable
        remote
        :remote-method="remoteMethod"
        clearable
        :options="remoteList"
        :loading="loading"
        value-key="temp"
        @change="handleChange($event, index, item.type)"
        placeholder="请选择任务"
      />
      <el-input
        v-model="item.target"
        placeholder="请填写目标"
        style="width: 150px; margin-right: 4px"
        @input="inputFun($event, index, 'target')"
      />
      <el-button
        type="primary"
        :icon="Plus"
        @click="handleData(index, 'add')"
      ></el-button>
      <el-button
        type="danger"
        :icon="Minus"
        @click="handleData(index, 'del')"
      ></el-button>
    </div>
    <!-- <div>{{ "已被选择" }}</div> -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, defineEmits, nextTick, inject } from "vue";
import { getFilesApi, getArgoworkflowInstanceListApi } from "@/axios/taskAPIs";
import { Plus, Minus } from "@element-plus/icons-vue";

const props = defineProps(["yhConfigData", "dataValue"]);
const emits = defineEmits(["inputFun"]);
const TASK_PROVIDE: any = inject("TASK_PROVIDE");
console.log(TASK_PROVIDE, "TASK_PROVIDE");
watch(
  () => props.dataValue,
  (val) => {
    console.log(val, "vallll");
    // debugger
    if (val && val != "[]") {
      data.value = JSON.parse(val);
    } else {
      data.value = [
        {
          name: "",
          source: "",
          source_all: "",
          target: "",
          type: "album-pvc",
          read_only: true,
          disabled: true,
        },
      ];
    }
  }
);
getList();
const data = ref([
    {
      name: "",
      source: "",
      source_all: "",
      target: "",
      type:
        TASK_PROVIDE.Keyword.value === "notebook"
          ? "pipeline-pvc"
          : "album-pvc",
      read_only: true,
      disabled: true,
    },
  ]),
  typeOptions = [
    {
      id: "album-pvc",
      value: "数据集",
    },
    {
      id: "pipeline-pvc",
      value: "任务调度",
    },
  ],
  taskObj = {
    cron: "定时任务",
    offline: "离线任务",
  },
  remoteList: any = ref([]),
  loading = ref(false),
  files: any = ref([]);
const props_obj = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf",
};
function blurFun(index, key) {
  console.log(index, key, "---blur", data.value);
  let i = data.value.findIndex((ele, index) => {
    console.log(ele, index, "iiii");
  });
}
async function remoteMethod(val) {
  getList(val);
}
async function getList(val = null) {
  const res: any = await getArgoworkflowInstanceListApi({
    page: 1,
    page_size: 99,
    sug_name: val,
  });
  res.list.forEach((item) => {
    item.label = `${item.name}【${taskObj[item.type]}】`;
    item.value = item.temp;
  });
  nextTick(() => {
    remoteList.value = res.list;
  });
  // if (!remoteList.value.length) {
  // }
}
function handleDisabled(data) {
  try {
    let arr: any = [];
    arr = Object.values(data);
    let res = arr.findIndex((ele) => {
      return ele.id === 1;
    });
    return res < 0 ? true : false;
  } catch (err) {
    console.log(err, "err===handleDisabled");
  }
}
function inputFun(val, index, key) {
  data.value[index][key] = val;
  emits("inputFun", JSON.stringify(data.value), props.yhConfigData.name);
}
function handleData(index, type) {
  if (type === "add") {
    data.value.splice(index + 1, 0, {
      ...props.yhConfigData.yh_template,
      type: data.value[index].type,
    });
  }
  if (type === "del") {
    if (data.value.length === 1) {
      data.value[0] = props.yhConfigData.yh_template;
    } else {
      data.value.splice(index, 1);
    }
  }
  emits("inputFun", JSON.stringify(data.value), props.yhConfigData.name);
}

function handleChange(val, index, type) {
  console.log(val, "val.url");
  if (type === "album-pvc") {
    data.value[index].source_all = val.url;
    data.value[index].source = handleSource(val.url);
  } else {
    data.value[index].source = val;
  }
  emits("inputFun", JSON.stringify(data.value), props.yhConfigData.name);
}
const load = async (node, resolve) => {
  try {
    let url = "";
    if (!node.data?.basic) {
      url = "album";
    } else {
      url = node.data.basic.url;
    }
    const params = {
      page: 1,
      page_size: 99999999,
      path: url,
      must: JSON.stringify({
        "basic.source_type": {
          type: "string",
          operation: "term",
          value: ["album"],
        },
      }),
    };
    const arr: any = await getFilesApi(params);
    arr.list.forEach((ele) => {
      ele.name = ele.basic.name;
      ele.id = ele.basic.album_id;
      ele.url = ele.basic.url;
      ele.disabled = handleDisabled(ele.action);
    });

    resolve(arr.list);
  } catch (err) {
    console.log(err, "err---load");
  }
};
function changeType(index) {
  data.value[index].source = "";
  if (TASK_PROVIDE.Keyword.value != "notebook") {
    data.value[index].source_all = "";
  }
}
function handleSource(str) {
  let arr = str.split("/");
  arr.shift();
  console.log(arr.join("/"), "arr");
  return arr.join("/");
}
</script>

<style lang="scss" scoped>
.yh_volume_mount_item {
  width: 100%;
  display: flex;
  align-items: center;
  // justify-content: center;
  margin-bottom: 4px;
}
</style>
