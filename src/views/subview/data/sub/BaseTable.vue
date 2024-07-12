<template>
  <div>
    <el-card>
      <el-input v-model="conditions" placeholder="过滤条件">
        <template #prepend>{{ searchName }}:</template>
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
      <el-table
        ref="multipleRef"
        :data="datas"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="thumbnail" label="缩略图">
          <template #default="scope">
            <div class="v-center">
              <BaseThumbnailImage style="height: 23px" :url="scope.row.url" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <TablePagination
        :pageSize="pageSize"
        :total="total"
        @currentChange="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import BaseThumbnailImage from "./BaseThumbnailImage.vue";
import { ref, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getData } from "@/utils/axios";
import TablePagination from "@/components/TablePagination.vue";
import type { VideoData, ImageData } from "@/utils/data";

const conditions = ref("");
const multipleRef = ref();

const props = defineProps<{
  searchName: string;
  getListUrl: string;
  hasDatas: number[];
}>();

const multipleSelection = ref<ImageData[] | VideoData[]>([]);
const datas = ref<ImageData[] | VideoData[]>([]);
const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getAlbumDatas();
};

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function getAlbumDatas() {
  getData(
    props.getListUrl,
    {
      page: currentPage.value,
      page_size: pageSize.value
    },
    (data: any) => {
      datas.value = data.list;
      total.value = data.total_count;
    }
  );
}

function setAlbumDatas(value) {
  datas.value = value;
}

watch(datas, (newVideoDatas) => {
  setTimeout(function () {
    datas.value.forEach((row: ImageData | VideoData) => {
      if (props.hasDatas.includes(row.id)) {
        multipleRef.value.toggleRowSelection(row, true);
      }
    });
  }, 50);
});

function getSelected() {
  const array = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];

    array.push(element.id);
  }
  return array;
}

defineExpose({ getSelected, setAlbumDatas, getAlbumDatas });
</script>

<style scoped></style>
