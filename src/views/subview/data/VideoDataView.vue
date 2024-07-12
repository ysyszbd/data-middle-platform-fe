<template>
  <div class="root position-r">
    <EventPanel
      v-show="isFilter"
      @update-select-tags="updateSelectTags"
      :rightWidth="360"
    />
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
    <div class="table-base">
      <Transition name="slide" mode="out-in">
        <div v-if="showtype" style="height: 100%">
          <ItemList :data="tableData" />
        </div>
        <el-table
          v-else
          ref="multipleTableRef"
          :data="tableData"
          highlight-current-row
          @selection-change="handleSelectionChange"
          :header-cell-style="tableHeaderStyle"
          table-layout="auto"
        >
          <el-table-column type="selection" />
          <!-- <el-table-column prop="id" label="ID" /> -->
          <el-table-column prop="car_plate" label="车辆" />
          <el-table-column prop="thumbnail" label="缩略图">
            <template #default="_scope">
              <div class="v-center">
                <el-image
                  style="height: 23px"
                  :src="url"
                  :preview-src-list="srcList"
                  preview-teleported
                  fit="cover"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="start_time" label="开始时间">
            <template #default="scope">
              {{
                dayjs(Number(scope.row.start_time)).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
              }}
            </template>
          </el-table-column>
          <el-table-column prop="end_time" label="结束时间">
            <template #default="scope">
              {{
                dayjs(Number(scope.row.end_time)).format("YYYY-MM-DD HH:mm:ss")
              }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="playVideo(scope.row)"
                >播放
              </el-button>
              <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon-color="#626AEF"
                title="确定删除本条数据吗？"
                @confirm="deleteData(scope.row.id)"
              >
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </Transition>

      <TablePagination
        :pageSize="pageSize"
        :total="total"
        @currentChange="handleCurrentChange"
      />
      <PlayVideoDialog ref="videoplayer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, deleteRow } from "@/utils/axios";
import { Picture, Grid } from "@element-plus/icons-vue";
import { ElTable } from "element-plus";
import dayjs from "dayjs";
import OperationBar from "@/components/OperationBar.vue";
import EventPanel from "./sub/EventPanel.vue";
import TablePagination from "@/components/TablePagination.vue";
import PlayVideoDialog from "./sub/PlayVideoDialog.vue";
import ItemList from "./sub/ItemList.vue";
import type { VideoData } from "@/utils/data";
import {
  video_delete,
  video_deleteBatch,
  resource_list,
  exacttag_filiter,
} from "@/utils/urlset";

const multipleTableRef = ref<InstanceType<typeof ElTable>>();
const multipleSelection = ref<VideoData[]>([]);
const tableData = ref<any[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);
const showtype = ref(false);
const loading = ref(true);
let multipleMap = new Map();
const selectTags = ref();
const url =
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg";
const srcList = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
];

const videoplayer = ref();
const isFilter = ref(false);

function getChecked(key) {
  return multipleMap.has(key);
}

function switchShowType(type) {
  showtype.value = type;
  if (showtype.value) {
    // pageSize.value = 30;
  } else {
    // pageSize.value = 10;
    setTimeout(() => {
      multipleTableRef.value!.clearSelection();
      for (let value of multipleMap.values()) {
        multipleTableRef.value!.toggleRowSelection(value, true);
      }
      multipleMap.clear();
    }, 100);
  }
  // getTableData();
}

function updateSelectTags(value) {
  selectTags.value = value;
  getTableData();
}

function playVideo(data) {
  let url = "/remote-data" + data.url;
  let duration = data.end_time - data.start_time;

  videoplayer.value.playVideo(true, duration, url);
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

function deleteData(index: number) {
  deleteRow(video_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];
    data.push(element.id);
  }
  deleteRow(video_deleteBatch, { ids: data }, getTableData);
}

function filterData(data) {
  //
}

function getTableData() {
  loading.value = true;
  getData(
    resource_list,
    {
      page: currentPage.value,
      page_size: pageSize.value,
      filter: JSON.stringify({ "basic.type": { $in: ["image"] } }),
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
  console.log(val);
  getTableData();
};
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
:deep(.el-collapse-item__arrow) {
  margin-left: 20px;
  order: -1;
}
.card-header {
  position: absolute;
  top: 6px;
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
  top: 52px;
  height: calc(100% - 52px);
  width: 100%;
  z-index: 1;
}
</style>
