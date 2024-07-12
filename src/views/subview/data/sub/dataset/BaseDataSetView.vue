<!--
 * @LastEditTime: 2023-06-28 18:23:57
 * @Description: 数据集--标注训练
-->
<template>
  <div class="root-main">
    <DataSetOperateBar
      type="ds"
      @switch-show-type="switchShowType"
      @filter="setFilter"
      @creat-album="creatAlbum"
    />
    <div style="height: calc(100% - 48px)">
      <splitpanes class="default-theme">
        <pane :size="filterPanelSize">
          <FilterPanel v-if="isFilter" :pageType="`data_set`" />
        </pane>
        <pane :size="dataPanelSize" v-loading="loading">
          <div
            ref="dataRoot"
            style="position: relative; display: flex; height: 100%"
          >
            <LeftAlbumTable
              ref="albumTable"
              style="width: 400px"
              :search-data="searchData"
              @table-row-clicked="leftAlbumChange"
              @select-data-change="setSelectData"
              @creat-album="creatAlbum"
            />
            <RightFileTable
              ref="fileTable"
              :search-data="searchData"
              :showtype="showtype"
              style="width: calc(100% - 400px)"
              @table-row-clicked="rightFileChange"
            />
          </div>
        </pane>
        <pane :size="infoPanelSize">
          <FilePreview
            :preview-data="previewData"
            :auth="authObj"
            type="ds"
            @filter-export="filterExportData"
            @command="onCommand"
          />
        </pane>
      </splitpanes>
    </div>
    <ExportDataDialog :ablum_id="exportDataAlumIds" title="导出数据" />
    <CreateAnnotationTask @submit="createData" />
    <FastPreviewDialog
      :data="previewData"
      v-model:visible="fastFilePreviewVisible"
    />
    <LinkAlbumDrawer
      v-model:visible="linkAlbumDrawerVisible"
      @submit="linkDataSet"
    />
    <FileAuthorityDialog
      v-model:visible="fileAuthorityDialogVisible"
      :data="previewData"
      @submit="setFileRoleAuth"
    />
    <CreatDataSet
      v-model:visible="creatDataSetDrawerVisible"
      :url="baseDataSetUrl"
      :info_use="type"
      @submit="updateTableData"
    />
  </div>
</template>

<script setup lang="ts">
import "splitpanes/dist/splitpanes.css";
import CreatDataSet from "./CreatDataSet.vue";
import FileAuthorityDialog from "../FileAuthorityDialog.vue";
import LeftAlbumTable from "./LeftAlbumTable.vue";
import RightFileTable from "./RightFileTable.vue";
import FilterPanel from "../FilterPanel.vue";
import FilePreview from "../FilePreview.vue";
import FastPreviewDialog from "../FastPreviewDialog.vue";
import DataSetOperateBar from "../DataSetOperateBar.vue";
import LinkAlbumDrawer from "./LinkAlbumDrawer.vue";
import ExportDataDialog from "@/components/subComponents/ExportDataDialog.vue";
import CreateAnnotationTask from "@/components/subComponents/CreateAnnotationTask.vue";
import { Splitpanes, Pane } from "splitpanes";
import { getFileFilter, getReadAuthority } from "@/utils/util";
import {
  labeltask_create,
  file_link_album,
  file_load_album,
  file_remove_album,
  file_recursion_add_role,
  file_recursion_del_role,
file_update
} from "@/utils/urlset";
import { ref, onMounted, onUnmounted, provide, computed } from "vue";
import { ElMessage } from "element-plus";
import { create, postData, getData, updateIdParameter, put } from "@/utils/axios";
import { getFilesApi } from "@/axios/taskAPIs";
import { useStateStore } from "@/stores/state";

const props = defineProps(["type"]);

const fileTable = ref();
const albumTable = ref();
const searchData = ref();
const loading = ref(false);
const dataRoot = ref();
const authObj = ref();
const fileAuthorityDialogVisible = ref(false);
const fastFilePreviewVisible = ref(false);
const showtype = ref(true);
const isFilter = ref(false);
const previewData: any = ref({
  basic: {
    name: "",
    type: "",
    url: ""
  }
});
const filesList: any = ref([]);
const files: any = ref([]);
const selectData: any = ref({
  list: [],
  dirArr: []
});
provide("SELECT_LIST", { selectData });
provide("FILES_LIST", { filesList, handleFiles, getFiles, filterData });

//创建标注任务
const dialogAnnotationTaskVisible = ref(false);
provide("dialogAnnotationTaskVisible", dialogAnnotationTaskVisible);
//筛选导出
const exportDataDialogVisible = ref(false);
provide("exportDataDialogVisible", exportDataDialogVisible);

const linkAlbumDrawerVisible = ref(false);
const creatDataSetDrawerVisible = ref(false);

const exportDataAlumIds = ref();
const infoPanelSize = ref(0);
const filterPanelSize = ref(0);
const dataPanelSize = computed(() => {
  return 100 - infoPanelSize.value - filterPanelSize.value;
});

const baseDataSetUrl = ref("");
// 处理文件
function handleFiles(item, pathArr) {
  if (item.length === 0) return;
  files.value = [...files.value, ...item];
  if (filesList.value.length === 0 && pathArr.length === 1) {
    filesList.value = item;
    return;
  }
  filesList.value = buildTree(files.value, "");
}
function buildTree(list, parentId) {
  const tree: any = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].basic.album_id === parentId) {
      const node = {
        ...list[i],
        name: list[i].basic.name,
        children: buildTree(list, list[i].id)
      };
      tree.push(node);
    }
  }
  return tree;
}
function linkDataSet(value) {
  console.log(previewData.value, value);

  let data = {
    target_id: previewData.value.id,
    source_ids: value
  };
  postData(file_link_album, data, () => {
    ElMessage({
      message: "链接数据成功.",
      type: "success"
    });
    updateTableData();
  });
}

/**
 * @description: 获取文件夹列表
 * @param {*} path 路径
 * @param {*} sign 操作类型：click[用户点击查看],search[筛选]
 * @param {*} searchSign 筛选类型：path[路经筛选]，root[全局筛选]
 * @return {*}
 */
async function getFiles(path = "album", sign = "click", searchSign = "") {
  console.log("获取文件夹列表", path, sign, searchSign);
  if (sign == "search" && searchSign === "path") return;
  if (sign === "search" && searchSign === "root") {
    albumTable.value.getTableData("", undefined, searchSign);
    return;
  }
  const params: any = {
    page: 1,
    page_size: 9999999,
    must: JSON.stringify({
      "basic.source_type": {
        type: "string",
        operation: "term",
        value: ["album"]
      }
    })
  };
  if (sign == "click") {
    params.path = path;
  }
  const filter = {};
  filter["basic.type.keyword"] = {
    type: "string",
    operation: "term",
    value: ["album"]
  };
  filter["info.use.keyword"] = {
    type: "string",
    operation: "term",
    value: [props.type]
  };
  filter["info.use.keyword"] = {
    type: "string",
    operation: "term",
    value: [props.type]
  };
  const filterstr = getFileFilter(searchData.value, filter);
  params["filter"] = filterstr;

  const res: any = await getFilesApi(params);
  let arr = Array.from(res.list);
  arr.map((item: any) => {
    item.hasChildren = true;
    item.children = [];
    item.name = item.basic.name;
  });
  await handleFiles(arr, path.split("/"));
  return arr;
}

function updateTableData() {
  albumTable.value.clearTableData();
  albumTable.value.getTableData();
}

function createData(form: any) {
  create(labeltask_create, form, () => {
    dialogAnnotationTaskVisible.value = false;
  });
}

async function setFileRoleAuth(data, flag, auths, checkedKeys) {
  data.role.file_role_ids = checkedKeys;
  await put(file_update, data, () => {});
  let tmpUrl = "";
  let fileUrl;
  if (flag) {
    tmpUrl = file_recursion_add_role;
    fileUrl = [data.basic.url];
  } else {
    tmpUrl = file_recursion_del_role;
    fileUrl = data.basic.url;
  }

  updateIdParameter(
    tmpUrl,
    {
      url: fileUrl,
      file_role_ids: auths
    },
    () => {
      setTimeout(() => {
        updateTableData();
      }, 1000);
    }
  );
}

function onCommand(cmd) {
  switch (cmd) {
    case "mark":
      dialogAnnotationTaskVisible.value = true;
      break;
    case "link":
      linkAlbumDrawerVisible.value = true;
      break;
    case "loaded":
      postData(file_load_album, { id: previewData.value.id }, () => {
        ElMessage({
          message: "加载数据成功.",
          type: "success"
        });
      });
      break;
    case "unloaded":
      postData(file_remove_album, { id: previewData.value.id }, () => {
        ElMessage({
          message: "卸载数据成功.",
          type: "success"
        });
      });
      break;
    case "authority":
      fileAuthorityDialogVisible.value = true;
      break;
    default:
      break;
  }
}
// 文件夹点击搜索文件
function leftAlbumChange(row) {
  rightFileChange(row);
  if (!getReadAuthority(row)) {
    ElMessage({
      message: "没有读取权限.",
      type: "warning"
    });
    return;
  }

  fileTable.value.getTableData(row);
}
function rightFileChange(row) {
  previewData.value = row;
  infoPanelSize.value = 20;
}

function setSelectData(data, auth) {
  selectData.value = data;
  authObj.value = auth;
}

function filterExportData(isMultiple) {
  if (isMultiple) {
    if (selectData.value.dirArr.length > 0) {
      exportDataAlumIds.value = selectData.value.dirArr;
      exportDataDialogVisible.value = true;
    } else {
      ElMessage({
        message: "未选择文件夹.",
        type: "warning"
      });
    }
  } else {
    if (previewData.value.basic.type != "dir") {
      ElMessage({
        message: "当前选择不是文件夹.",
        type: "warning"
      });
    } else {
      exportDataAlumIds.value = [previewData.value.basic.album_id];
      exportDataDialogVisible.value = true;
    }
  }
}

function setFilter(value) {
  isFilter.value = value;
  if (isFilter.value) {
    filterPanelSize.value = 20;
  } else {
    filterPanelSize.value = 0;
    searchData.value = undefined;
  }
}

function filterData(value) {
  searchData.value = value;
}

function switchShowType(type) {
  showtype.value = type;
}

function creatAlbum(url) {
  baseDataSetUrl.value = url;
  creatDataSetDrawerVisible.value = true;
}

const onKeyDown = (event) => {
  switch (event.code) {
    case "Space":
      if (previewData.value.basic.type == "album") {
        ElMessage({
          message: "这是一个文件夹.",
          type: "warning"
        });
        break;
      }
      fastFilePreviewVisible.value = !fastFilePreviewVisible.value;
      break;
    default:
      break;
  }
};

onMounted(() => {
  document.body.onkeydown = onKeyDown;
});
onUnmounted(() => {
  document.body.onkeydown = null;
});
</script>
<style scoped src="@/assets/css/base.css"></style>
<style lang="scss" scoped>
.datafilter {
  position: absolute;
  left: 440px;
  right: 370px;
}
</style>
