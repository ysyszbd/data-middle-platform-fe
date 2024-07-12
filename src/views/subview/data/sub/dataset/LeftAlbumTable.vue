<!--
 * @LastEditTime: 2023-07-07 11:12:55
 * @Description: 数据集--标注训练--文件夹列表
-->
<template>
  <div class="root-div">
    <el-table
      row-key="basic.url"
      height="100%"
      table-layout="auto"
      highlight-current-row
      lazy
      stripe
      :data="allFolderData"
      :load="loadChildren"
      :tree-props="{ hasChildren: 'hasChildren' }"
      @row-click="tableRowClicked"
      @select="selectFun"
      @select-all="selectFun"
    >
      <el-table-column type="selection" width="25" />
      <el-table-column prop="basic.name" label="文件夹" />
      <el-table-column prop="basic.status_description" label="状态">
        <template #default="scope">
          <el-tag :type="statusToType(scope.row.basic.status_description)">
            {{ keyToName(scope.row.basic.status_description) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-tooltip content="添加子数据集" placement="right" effect="light">
            <el-button
              link
              type="primary"
              size="small"
              @click.stop="creatAlbum(scope.row)"
            >
              +
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { statusToType, keyToName, getReadAuthority } from "@/utils/util";
import { ElMessage } from "element-plus";

const props = defineProps(["searchData"]);
const emits = defineEmits([
  "tableRowClicked",
  "selectDataChange",
  "creatAlbum"
]);
const FILES_LIST = inject("FILES_LIST") as any;
console.log(FILES_LIST, "FILES_LIST");

const allFolderData: any = ref([]);
const previewData: any = ref(undefined);
const selectData: any = ref({
  list: [],
  dirArr: []
});

function creatAlbum(data) {
  if (getCreateDataSetAuthority(data)) {
    emits("creatAlbum", data.basic.url);
    return;
  }
  ElMessage({
    message: "没有该权限,请申请",
    type: "warning"
  });
}

function selectFun(val) {
  console.log(val, "数据集--标注训练--文件夹列表");
  let authObj = {
    export: true,
    creatDataSet: true,
    creatTask: true
  };
  // debugger
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
  console.log(selectData.value, "------------selectDataChange");

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
      default:
        break;
    }
  }
}

// 文件夹点击搜索事件
function tableRowClicked(row) {
  console.log(
    row,
    "数据集--标注训练--文件夹列表--tableRowClicked",
    previewData.value
  );
  if (previewData.value?.basic?.url == row.basic.url) return;
  previewData.value = row;
  emits("tableRowClicked", row);
}

function loadChildren(row, treeNode, resolve) {
  if (!getReadAuthority(row)) {
    ElMessage({
      message: "没有读取权限.",
      type: "warning"
    });
    resolve([]);
    return;
  }
  getTableData(row.basic.url, resolve);
}

async function getTableData(
  path = "album",
  resolve: any = undefined,
  searchSign = ""
) {
  console.log(path, "文件夹点击搜索文件");
  const arr = await FILES_LIST.getFiles(
    searchSign === "root" ? "" : path,
    searchSign === "root" ? "" : "click",
    ""
  );
  console.log(arr, "arr=====;;;;;");

  if (resolve == undefined) {
    allFolderData.value = arr;
  } else {
    resolve(arr);
  }
}

function getCreateDataSetAuthority(data) {
  let actions = data.action;
  for (let action in actions) {
    let actionProto = actions[action];
    switch (actionProto.name) {
      case "创建数据集":
        return actionProto.is_active;
      default:
        break;
    }
  }
}

function clearTableData() {
  allFolderData.value = [];
}

onMounted(() => {
  getTableData();
});

defineExpose({ getTableData, clearTableData });
</script>

<style scoped>
.root-div {
  position: relative;
  height: 100%;
  border: 1px solid #ebeef5;
  border-right: 0px;
  border-bottom: 0px;
  box-sizing: border-box;
}
</style>
