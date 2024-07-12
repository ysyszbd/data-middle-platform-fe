<template>
  <div class="root position-r">
    <div class="datafilter">
      <DataFilterPanel
        @search="filterData"
        :rightWidth="0"
        :type-show="false"
      />
    </div>
    <div class="card-header">
      <div style="margin-right: 20px; display: flex; align-items: center">
        <el-checkbox
          v-model="isFilter"
          label="是否筛选"
          size="large"
          @change="getTableData"
        />
        <OperationBar
          creatButton=""
          deleteButton="删除选中"
          @onDeleteButtonHandel="deleteSelection"
        >
        </OperationBar>
        <el-button-group class="ml-4" style="margin-left: 10px">
          <el-button :icon="Grid" @click="switchShowType(false)" v-focus />
          <el-button :icon="Picture" @click="switchShowType(true)" />
        </el-button-group>
      </div>
    </div>
    <div class="table-base" ref="dataRoot" v-loading="loading">
      <Transition name="slide" mode="out-in">
        <div v-if="showtype" style="height: 100%">
          <ItemList :data="tableData" />
        </div>
        <div v-else style="height: 100%">
          <el-table
            ref="multipleTableRef"
            :data="tableData"
            :height="tableHeight"
            style="width: 100%"
            highlight-current-row
            @selection-change="handleSelectionChange"
            :header-cell-style="tableHeaderStyle"
          >
            <el-table-column type="selection" />
            <el-table-column prop="basic.name" label="名称" />
            <el-table-column prop="basic.url" label="缩略图" width="120">
              <template #default="scope">
                <div class="v-center">
                  <el-image
                    style="height: 23px"
                    :src="getUrl(scope.row.basic.url)"
                    :preview-src-list="getUrlPreview(scope.row.basic.url)"
                    preview-teleported
                    fit="cover"
                  />
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="basic.album_id" label="父文件夹" /> -->
            <el-table-column prop="basic.type" label="类型" />
            <el-table-column prop="basic.width" label="宽" />
            <el-table-column prop="basic.height" label="高" />
            <el-table-column fixed="right" label="操作" width="150">
              <template #default="scope">
                <el-popconfirm
                  confirm-button-text="确定"
                  cancel-button-text="取消"
                  icon-color="#626AEF"
                  title="确定删除本条数据吗？"
                  @confirm="deleteData(scope.row.id.$oid)"
                >
                  <template #reference>
                    <el-button link type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </Transition>
    </div>
    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, deleteRow } from "@/utils/axios";
import { Picture, Grid } from "@element-plus/icons-vue";
import { ElTable } from "element-plus";
import {
  getUrl,
  getUrlPreview,
  getMustArray,
  windowResizeEvent,
} from "@/utils/util";
import dayjs from "dayjs";
import OperationBar from "@/components/OperationBar.vue";
import DataFilterPanel from "./sub/DataFilterPanel.vue";
import ItemList from "./sub/ItemList.vue";
import TablePagination from "@/components/TablePagination.vue";
import type { ImageData } from "@/utils/data";
import {
  resource_filter,
  resource_delete,
  resource_list,
} from "@/utils/urlset";

const loading = ref(false);
const dataRoot = ref();
const tableHeight = ref(600);

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<ImageData[]>([]);
const tableData = ref<any[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const showtype = ref(false);
let multipleMap = new Map();
let searchData;
const isFilter = ref(false);

function getChecked(key) {
  return multipleMap.has(key);
}

function switchShowType(type) {
  showtype.value = type;

  setTimeout(() => {
    getTableDivHeight();
  }, 100);
}

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
  multipleSelection.value.forEach((item) => {
    multipleMap.set(item.id, item);
  });
};

function toggleSelection(data, checked) {
  if (checked) {
    multipleMap.set(data.id, data);
  } else {
    multipleMap.delete(data.id);
  }

  console.log(multipleMap);
}

function deleteData(index) {
  deleteRow(resource_delete, { ids: [index] }, getTableData);
}

function deleteSelection() {
  let data = new Array<any>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element: any = multipleSelection.value[index];
    data.push(element.id.$oid);
  }
  deleteRow(resource_delete, { ids: data }, getTableData);
}

function filterData(value) {
  searchData = value;
  getTableData();
}

function getTableData() {
  loading.value = true;
  let url = resource_list;
  let filter;
  let array = getMustArray(searchData);
  if (isFilter.value && array.length > 0) {
    url = resource_filter;

    filter = null;
    filter = {
      query: {
        bool: {
          must: array,
        },
      },
    };
  } else {
    searchData = {};
    filter = JSON.stringify({ "basic.type": { $in: ["image"] } });
  }

  getData(
    url,
    {
      page: currentPage.value,
      page_size: pageSize.value,
      filter: filter,
    },
    (data: any) => {
      tableData.value = data.list;
      total.value = data.total_count;
      loading.value = false;
    }
  );
}

const vFocus = {
  mounted: (el) => el.focus(),
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData();
};

function getTableDivHeight() {
  tableHeight.value = dataRoot.value.clientHeight;

  if (!showtype.value) {
    pageSize.value = Math.floor(tableHeight.value / 41);
  } else {
    let column = Math.floor(dataRoot.value.clientWidth / 150);
    let row = Math.round(tableHeight.value / 188);
    pageSize.value = column * row;
  }

  getTableData();
}

onMounted(() => {
  getTableDivHeight();
  windowResizeEvent(getTableDivHeight);
});
onUnmounted(() => {
  window.onresize = null;
});
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
:deep(.el-collapse-item__arrow) {
  margin-left: 20px;
  order: -1;
}
.card-header {
  position: absolute;
  top: 0px;
  right: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.position-r {
  position: relative;
}
.table-base {
  position: absolute;
  top: 40px;
  height: calc(100% - 110px);
  width: 100%;
  z-index: 1;
}
.datafilter {
  position: absolute;
  right: 570px;
}
</style>
