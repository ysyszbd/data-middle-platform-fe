<template>
  <div class="position-r">
    <div>
      <el-table
        ref="singleTableRef"
        highlight-current-row
        :data="albumImagesDetial"
        :header-cell-style="tableHeaderStyle"
        @row-dblclick="rowDblclick"
        @current-change="handleTableCurrentChange"
      >
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="thumbnail" label="缩略图">
          <template #default="scope">
            <div class="v-center">
              <el-image
                style="height: 23px"
                :src="getUrl(scope.row.url)"
                :preview-src-list="getUrlPreview(scope.row.url)"
                preview-teleported
                fit="cover"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="markImage(scope)"
              >标注
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <TablePagination
      ref="refPagination"
      class="new-pagination"
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData } from "@/utils/axios";
import { useStateStore } from "@/stores/state";
import { ElTable } from "element-plus";
import { getUrl, getUrlPreview } from "@/utils/util";
import TablePagination from "@/components/TablePagination.vue";
import { get_album_images, image_findBatch } from "@/utils/urlset";

const singleTableRef = ref<InstanceType<typeof ElTable>>();
const store = useStateStore();
const albumImages = ref();
const albumImagesDetial = ref();

const refPagination = ref();

let currentImageId = 0;

const total = ref(0);
const pageSize = ref(10);
const currentPage = ref(1);

let isFirst = true;

const emit = defineEmits<{
  (e: "mark", data): void;
}>();

function markImage(data) {
  // currentImageId = data.$index;
  // emit("mark", data.row);
}

const handleTableCurrentChange = (currentRow, oldCurrentRow) => {
  for (let i = 0; i < albumImagesDetial.value.length; i++) {
    if (albumImagesDetial.value[i].id == currentRow.id) {
      currentImageId = i;
    }
  }
  emit("mark", currentRow);
};

function getAlbumImages(id) {
  getData(
    get_album_images,
    {
      ids: JSON.stringify([id]),
      page: currentPage.value,
      page_size: pageSize.value,
    },
    (data) => {
      total.value = data.data.total;
      if (data.data.data != undefined) {
        albumImages.value = data.data.data[0].image_ids;
        getAlbumDetailImages(JSON.stringify(data.data.data[0].image_ids));
      } else {
        albumImages.value = [];
        albumImagesDetial.value = [];
      }
    }
  );
}

function getAlbumDetailImages(ids) {
  getData(image_findBatch, { ids: ids }, (data) => {
    albumImagesDetial.value = data.data.data;
    albumImagesDetial.value.forEach((item) => {
      item.type = "image";
      item.name = item.url.split("/").pop();
    });
    if (isFirst) {
      setCurrent(albumImagesDetial.value[0]);
    } else {
      setCurrent(albumImagesDetial.value[albumImagesDetial.value.length - 1]);
    }
  });
}

const handleCurrentChange = (val: number) => {
  if (currentPage.value > val) {
    isFirst = false;
  } else {
    isFirst = true;
  }
  currentPage.value = val;
  getTableData();
};

function getTableData() {
  console.log('getTableData');
  
  let id = store.getTimeLineTaskId;
  // console.log("getTimeLineTaskId", id);

  getAlbumImages(Number(id));
}

const setCurrent = (row) => {
  // console.log("setCurrent", row);

  singleTableRef.value!.setCurrentRow(row);
};

function rowDblclick(row, column, event) {
  // for (let i = 0; i < albumImagesDetial.value.length; i++) {
  //   if (albumImagesDetial.value[i].id == row.id) {
  //     currentImageId = i;
  //   }
  // }
  // emit("mark", row);
}

function setCurrentImage(flag) {
  if (true == flag) {
    if (currentImageId > 0) {
      currentImageId--;
      setCurrent(albumImagesDetial.value[currentImageId]);
    } else {
      refPagination.value.setCurrent(true);
    }
  } else {
    if (currentImageId < 9) {
      currentImageId++;
      setCurrent(albumImagesDetial.value[currentImageId]);
    } else {
      refPagination.value.setCurrent(false);
    }
  }
}

onMounted(() => {
  getTableData();
});

defineExpose({ setCurrentImage, setCurrent, getAlbumImages });
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
.el-dialog__wrapper {
  pointer-events: none;
}
.el-dialog {
  pointer-events: auto;
}

.new-pagination {
  position: static;
}
</style>
