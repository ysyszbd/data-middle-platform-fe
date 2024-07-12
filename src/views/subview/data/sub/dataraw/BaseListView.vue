<!--
 * @LastEditTime: 2023-06-28 16:02:26
 * @Description: 原始数据列表
-->

<template>
  <div ref="dataRoot" class="root-div">
    <div class="breadcrumb-div">
      <el-breadcrumb style="margin-left: 0px">
        <el-breadcrumb-item @click="getTableData('0')">列表</el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="item in albumBreadcrumb"
          :key="item.id"
          @click="getTableData(item.path)"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="all-data-div">
      <div class="left-div" v-if="searchType == 'path'">
        <el-tag class="el-tag-div" color="#fff" style="color: #909399">
          数据源
        </el-tag>
        <el-tree
          :data="sourceDataTable"
          @current-change="handleNodeClick"
          style="height: calc(100% - 43px)"
        />
      </div>
      <div
        ref="itemDataRoot"
        class="data-div"
        :style="{
          width: 'calc(100% - ' + leftWidth + 'px)'
        }"
      >
        <div v-if="showtype" class="el-table-div">
          <el-table
            ref="multipleTableRef"
            :data="allData"
            :key="tableHeaderValue.toString()"
            style="width: 100%"
            height="100%"
            stripe
            class="tableClass"
            highlight-current-row
            :header-cell-style="tableHeaderStyle"
            @row-dblclick="tableRowDbClicked"
            @row-click="tableRowClicked"
            @select="selectFun"
            @select-all="handleSelectAll"
          >
            <el-table-column
              type="selection"
              width="35"
              :selectable="
                (row, index) => {
                  return 'entrusted' == row.basic.status_description;
                }
              "
            />
            <el-table-column prop="basic.name" label="名称" width="230" />
            <el-table-column prop="basic.type" label="类型" width="100">
              <template #default="scope">
                <el-tag
                  disable-transitions
                  :type="getStyleByFileType(scope.row.basic.type)"
                >
                  {{ scope.row.basic.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag
                  :type="statusToType(scope.row.basic.status_description)"
                >
                  {{ keyToName(scope.row.basic.status_description) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="basic.url" label="路径">
              <template #default="scope">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  :content="scope.row.basic.url"
                  placement="top-start"
                >
                  <span style="text-overflow: clip">
                    {{ scope.row.basic.url }}
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              width="230"
              v-if="tableHeaderValue.includes('id')"
            />
            <el-table-column
              prop="basic.album_id"
              label="父文件夹"
              v-if="tableHeaderValue.includes('basic.album_id')"
            />
            <el-table-column align="right">
              <template #header>
                <el-select
                  v-model="tableHeaderValue"
                  multiple
                  size="small"
                  collapse-tags
                  collapse-tags-tooltip
                  placeholder="显示项"
                  style="width: 160px"
                >
                  <el-option
                    v-for="item in tableHeaderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else style="height: calc(100% - 32px)">
          <ItemList
            :data="allData"
            @item-click="tableRowClicked"
            @item-dbl-click="tableRowDbClicked"
            @select="selectFun"
          />
        </div>
      </div>
    </div>
    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import ItemList from "../ItemList.vue";
import TablePagination from "@/components/TablePagination.vue";
import { ref, onMounted, onUnmounted, provide, inject, watch } from "vue";
import { getData } from "@/utils/axios";
import { tableHeaderStyle } from "@/utils/style";
import { source_all, file_list } from "@/utils/urlset";
import { tableHeaderOptions } from "@/utils/data";
import {
  windowResizeEvent,
  getStyleByFileType,
  getFileFilter,
  statusToType,
  keyToName,
  setAlbumBreadcrumb,
  albumBreadcrumb,
  pushAlbumBreadcrumb
} from "@/utils/util";

const props = defineProps(["isFilter", "showtype", "type"]);
const emits = defineEmits([
  "selectDataChange",
  "previewDataChange",
  "dataSourceChange"
]);
const FILES_LIST: any = inject("FILES_LIST");

let currentDirPath = "";
const loading = ref(false);
const dataRoot = ref();

const itemDataRoot = ref();
const allData: any = ref([]);
const total = ref(0);
const pageSize = ref(28);
const currentPage = ref(1);
const previewData: any = ref({
  basic: {
    name: "",
    type: ""
  }
});

const selectData: any = ref({
  list: [],
  dirArr: []
});
const multipleTableRef = ref();
const sourceDataTable = ref([]) as any;
const sourceDataMap = new Map();
let selectSourceUrl = "";
const tableHeaderValue = ref(["basic.name", "basic.type"]);
const infoPanelSize = ref(0);
const searchType = ref("path");
const leftWidth = ref(200);

watch(
  () => props.type,
  () => {
    // console.log(props.searchData);
    getTableData(currentDirPath);
  },
  { deep: true }
);

function setSearchType(val) {
  searchType.value = val;
  if ("root" == val) {
    leftWidth.value = 0;
  } else {
    leftWidth.value = 200;
  }
  getTableData();
}

const handleNodeClick = (data, node) => {
  if (node.level === 1) {
    return;
  }
  // console.log(data);
  emits("dataSourceChange", data.data);
  selectSourceUrl = data.value;
  getTableData(selectSourceUrl);
};

function handleSelectAll(val) {
  selectFun(val);
}

provide("SELECT_LIST", { selectData });
// 选择文件夹
function selectFun(val) {
  let authObj = {
    export: true,
    creatDataSet: true,
    creatTask: true,
    importDataSet: true
  };

  if (val.length === 0) {
    selectData.value = [];
  } else {
    selectData.value.list = new Array(val.length).fill({});
    selectData.value.dirArr = new Array(val.length).fill({});
    val.forEach((item, index) => {
      selectData.value.dirArr[index] = item.id;
      selectData.value.list[index] = {
        album_id: item.id,
        album_name: item.basic.name,
        type: ["envLabel"],
        remarks: ""
      };
      getAuth(item, authObj);
    });
  }
  emits("selectDataChange", selectData.value, authObj);
}

function getAuth(item, authObj) {
  let actions = item.action;
  for (let action in actions) {
    let actionProto = actions[action];
    switch (actionProto.name) {
      case "批量导出":
        authObj.export &&= actionProto.is_active;
        break;
      case "创建数据集":
        authObj.creatDataSet &&= actionProto.is_active;
        break;
      case "创建任务":
        authObj.creatTask &&= actionProto.is_active;
        break;
      case "导入数据集":
        authObj.importDataSet &&= actionProto.is_active;
        break;
      default:
        break;
    }
  }
}

function updateValue(data) {
  if (data.list == null) {
    allData.value = [];
  } else {
    allData.value = data.list;
    total.value = data.total_count || 0;
  }
  loading.value = false;
}

function getTableData(path = currentDirPath) {
  if ("0" == path) {
    path = selectSourceUrl;
  }

  currentDirPath = path;

  if (currentDirPath != selectSourceUrl) {
    for (let index = 0; index < albumBreadcrumb.value.length; index++) {
      const element = albumBreadcrumb.value[index];
      if (currentDirPath == element.path) {
        setAlbumBreadcrumb(albumBreadcrumb.value.slice(0, index + 1));
      }
    }
  } else {
    setAlbumBreadcrumb(albumBreadcrumb.value.slice(0, 0));
  }

  const params = {
    page: currentPage.value,
    page_size: pageSize.value
  };

  if ("path" == searchType.value) {
    params["path"] = path;
  }

  let filter = {};
  if (props.type != "total") {
    filter["info.use.keyword"] = {
      type: "string",
      operation: "term",
      value: [props.type]
    };
  }

  if (props.isFilter || props.type != "total") {
    const filterstr = getFileFilter(FILES_LIST.searchData.value, filter);
    if (filterstr != "") params["filter"] = filterstr;
  }

  if (
    params["path"] == "" ||
    (!Object.prototype.hasOwnProperty.call(params, "path") &&
      !Object.prototype.hasOwnProperty.call(params, "filter")) ||
    (!Object.prototype.hasOwnProperty.call(params, "path") &&
      Object.prototype.hasOwnProperty.call(params, "filter") &&
      Object.keys(params["filter"]).length <= 0)
  ) {
    updateValue({ list: [] });
    return;
  }
  loading.value = true;
  getData(file_list, params, (responseData) => {
    updateValue(responseData);
  });
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData(currentDirPath);
};

function tableRowClicked(row) {
  previewData.value = row;
  if (previewData.value.basic.url == undefined) {
    previewData.value.basic.url = "";
  }
  infoPanelSize.value = 20;
  emits("previewDataChange", previewData.value);
}

function tableRowDbClicked(row) {
  if (row.basic.type != "album") {
    return;
  }

  //原始数据不判断
  // if (!getReadAuthority(row)) {
  //   ElMessage({
  //     message: "没有读取权限.",
  //     type: "warning"
  //   });
  //   return;
  // }

  let data = {
    name: row.basic.name,
    id: row.basic.dir_id,
    path: row.basic.url
  };
  getTableData(row.basic.url);
  pushAlbumBreadcrumb(data);
}

function getTableDivHeight() {
  if (props.showtype.value) {
    pageSize.value = Math.floor((dataRoot.value.clientHeight - 43) / 41);
  } else {
    const column = Math.floor(itemDataRoot.value.clientWidth / 150);
    const row = Math.round(itemDataRoot.value.clientHeight / 188);
    console.log(itemDataRoot, itemDataRoot.value.clientWidth, column, row);

    pageSize.value = column * row;
  }

  getTableData(currentDirPath);
}

function getSourceTableData() {
  getData(source_all, {}, (responseData) => {
    for (let i = 0; i < responseData.data.sources.length; i++) {
      const obj = responseData.data.sources[i];
      const url: string = obj.url;
      let pathArray = url.split("/");
      if (pathArray.length < 2) {
        continue;
      }
      let value = { name: pathArray[1], value: obj };
      if (sourceDataMap.has(pathArray[0])) {
        sourceDataMap.get(pathArray[0]).push(value);
        // sourceDataMap[pathArray[0]].push(value);
      } else {
        sourceDataMap.set(pathArray[0], [value]);
      }
    }
    for (const key of sourceDataMap) {
      let children = [] as any;
      for (const item of key[1]) {
        children.push({
          label: item.name,
          data: item.value,
          value: key[0] + "/" + item.name
        });
      }
      sourceDataTable.value.push({
        label: key[0],
        children: children
      });
    }
  });
}

onMounted(() => {
  getSourceTableData();
  windowResizeEvent(getTableDivHeight);
});
onUnmounted(() => {
  window.onresize = null;
});

defineExpose({ getTableData, setSearchType });
</script>
<style lang="scss" scoped>
.root-div {
  position: relative;
  background-color: white;
  height: 100%;
  width: 100%;
  border: 1px solid #ebeef5;
  box-sizing: border-box;
}
.breadcrumb-div {
  height: 40px;
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.data-div {
  position: relative;
  height: 100%;
  border: 1px solid #ebeef5;
  border-bottom: 0px;
  box-sizing: border-box;
}
.all-data-div {
  position: relative;
  display: flex;
  height: calc(100% - 80px);
}
.left-div {
  width: 200px;
  border-bottom: 1px solid #ebeef5;
}
.el-tag-div {
  width: 100%;
  height: 43px;
  box-sizing: border-box;
  font-size: 14px;
  color: black;
  font-weight: bold;
  border-radius: 0px;
  border-right: 0px;
  border-left: 0px;
  border-bottom: 1px solid #ebeef5;
}
.el-table-div {
  position: relative;
  height: 100%;
  width: 100%;
}
.pagination {
  position: absolute;
  right: 30px;
  bottom: 4px;
}
// :deep(.tableClass .cell) {
//   padding: 0 !important;
//   height: 30px;
//   line-height: 30px !important;
// }
</style>
