<!--
 * @LastEditTime: 2023-06-28 15:26:20
 * @Description: 原始数据
-->
<template>
  <div class="root-main">
    <DataSetOperateBar
      type="dr"
      :show-other="true"
      @switch-show-type="switchShowType"
      @creatAlbumSuccess="updateTableData"
      @filter="setFilter"
      @search-type-change="(val) => (type = val)"
    />
    <div ref="dataRoot" style="height: calc(100% - 48px)">
      <splitpanes class="default-theme">
        <pane :size="filterPanelSize">
          <FilterPanel
            v-if="isFilter"
            :pageType="`data_raw`"
            @search="filterData"
            @switch-search-type="switchSearchType"
          />
        </pane>
        <pane :size="dataPanelSize" v-loading="loading">
          <BaseListView
            ref="dataTable"
            :type="type"
            :showtype="showtype"
            :is-filter="isFilter"
            @select-data-change="setSelectData"
            @preview-data-change="previewDataUpdate"
            @data-source-change="dataSourceUpdate"
          />
        </pane>
        <pane :size="infoPanelSize">
          <FilePreview
            :preview-data="previewData"
            :auth="authObj"
            type="dr"
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
    <CreateTrusteeshipDialog
      v-model:visible="trusteeshipDialogVisible"
      :source="selectSource"
      :preview-data="previewData"
      parent-type="dr"
      @create="createTrusteeship"
    />
    <ImportToDataSetDialog
      v-model:visible="importToSourceDialogVisible"
      @add="linkDataSet"
    />
    <FileAuthorityDialog
      v-model:visible="fileAuthorityDialogVisible"
      :data="previewData"
      @submit="setFileRoleAuth"
    />
  </div>
</template>

<script setup lang="ts">
import FileAuthorityDialog from "../FileAuthorityDialog.vue";
import ImportToDataSetDialog from "./ImportToDataSetDialog.vue";
import CreateTrusteeshipDialog from "../datasource/CreateTrusteeshipDialog.vue";
import ExportDataDialog from "@/components/subComponents/ExportDataDialog.vue";
import CreateAnnotationTask from "@/components/subComponents/CreateAnnotationTask.vue";
import FastPreviewDialog from "../FastPreviewDialog.vue";
import FilterPanel from "../FilterPanel.vue";
import DataSetOperateBar from "../DataSetOperateBar.vue";
import FilePreview from "../FilePreview.vue";
import BaseListView from "./BaseListView.vue";
import "splitpanes/dist/splitpanes.css";
import { ref, onMounted, onUnmounted, provide, computed } from "vue";
import { ElMessage } from "element-plus";
import { create, postData, put, updateIdParameter } from "@/utils/axios";
import {
  file_link_album,
  labeltask_create,
  workorder_apply,
  file_recursion_add_role,
  file_recursion_del_role,
  file_update
} from "@/utils/urlset";
import { Splitpanes, Pane } from "splitpanes";

const type = ref("total");
const dataTable = ref();
const searchData = ref();
const loading = ref(false);
const dataRoot = ref();
const fileAuthorityDialogVisible = ref(false);
const importToSourceDialogVisible = ref(false);
const trusteeshipDialogVisible = ref(false);
const fastFilePreviewVisible = ref(false);
const showtype = ref(true);
const isFilter = ref(false);
const selectSource = ref();
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
provide("SELECT_LIST", { selectData });
provide("FILES_LIST", { filterData, getFiles, searchData });

//创建标注任务
const dialogAnnotationTaskVisible = ref(false);
provide("dialogAnnotationTaskVisible", dialogAnnotationTaskVisible);
//筛选导出
const exportDataDialogVisible = ref(false);
provide("exportDataDialogVisible", exportDataDialogVisible);

const exportDataAlumIds = ref();

const infoPanelSize = ref(0);
const filterPanelSize = ref(0);
const dataPanelSize = computed(() => {
  return 100 - infoPanelSize.value - filterPanelSize.value;
});

const authObj = ref();

function setSelectData(data, auth) {
  selectData.value = data;
  authObj.value = auth;
}

function linkDataSet(value) {
  let data = {
    target_id: value.id,
    source_ids: selectData.value.dirArr
  };
  postData(file_link_album, data, () => {
    importToSourceDialogVisible.value = false;
    ElMessage({
      message: "链接数据成功.",
      type: "success"
    });
    updateTableData();
  });
}

function createTrusteeship(data) {
  trusteeshipDialogVisible.value = false;
  create(workorder_apply, data, () => {});
}

function previewDataUpdate(data) {
  previewData.value = data;
  infoPanelSize.value = 20;
}
function dataSourceUpdate(data) {
  selectSource.value = data;
}
function getFiles(path, sign) {
  console.log(sign, "sign");

  dataTable.value.getTableData();
}
function updateTableData() {
  dataTable.value.getTableData();
}

function createData(form: any) {
  create(labeltask_create, form, () => {
    dialogAnnotationTaskVisible.value = false;
    updateTableData();
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
    case "trusteeship":
      trusteeshipDialogVisible.value = true;
      break;
    case "link":
      importToSourceDialogVisible.value = true;
      break;
    case "authority":
      fileAuthorityDialogVisible.value = true;
      break;
    default:
      break;
  }
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
      exportDataAlumIds.value = [previewData.value.basic.dir_id];
      exportDataDialogVisible.value = true;
    }
  }
}

function setFilter(value) {
  isFilter.value = value;
  if (!value) {
    searchData.value = undefined;
    filterPanelSize.value = 0;
  } else {
    filterPanelSize.value = 20;
  }
}

function filterData(value) {
  //console.log(value);

  searchData.value = value;
}

function switchShowType(type) {
  showtype.value = type;
}
function switchSearchType(type) {
  dataTable.value.setSearchType(type);
}

const onKeyDown = (event) => {
  switch (event.code) {
    case "Space":
      if (previewData.value.basic.type == "dir") {
        ElMessage({
          message: "这是一个文件夹.",
          type: "warning"
        });
        break;
      }
      if (fastFilePreviewVisible.value) {
        fastFilePreviewVisible.value = false;
      } else {
        fastFilePreviewVisible.value = true;
      }
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
.data-div {
  position: relative;
  height: 100%;
  width: calc(100% - 200px);
  border: 1px solid #ebeef5;
  box-sizing: border-box;
}
.item-div {
  position: relative;
  height: 100%;
  background-color: white;
  border: 1px solid #ebeef5;
  box-sizing: border-box;
}
.el-tag-div {
  width: 100%;
  height: 42px;
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
</style>
