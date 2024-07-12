<template>
  <el-card style="height: 100%; box-sizing: border-box">
    <template #header>
      <div class="card-header">
        <span>数据统计</span>
      </div>
    </template>
    <el-space direction="vertical" :size="20" fill :fill-ratio="100">
      <el-card> 视频数量: {{ videoCount }} </el-card>
      <el-card> 图片数量: {{ imageCount }} </el-card>
      <el-button type="primary" @click="loadRemoteData('image')"> iamge </el-button>
      <el-button type="success" @click="loadRemoteData('video')"> video</el-button>
      <el-button type="info" @click="loadRemoteData('txt')"> txt </el-button>
      <el-button type="warning" @click="loadRemoteData('excel')"> excel </el-button>
      <el-dialog v-model="dialogVisible" title="预览" width="50%">
        <div class="el-dialog-div">
          <el-image
            v-show="previewData.type == 'image'"
            style="width: 100%; height: 50vh"
            :src="
              getUrl(
                '/DMP_DATA/TEST_TDA/Traffic_test/ji-A53UE1/2021-10-26/1605809701.863154.png'
              )
            "
            :preview-src-list="
              getUrlPreview(
                '/DMP_DATA/TEST_TDA/Traffic_test/ji-A53UE1/2021-10-26/1605809701.863154.png'
              )
            "
            fit="contain"
          />
          <div v-show="previewData.type == 'video'">
            <vue3VideoPlay
              width="100%"
              height="100%"
              :title="previewData.name"
              :src="options.src"
              :type="options.type"
              :autoPlay="false"
            />
          </div>
          <iframe
            style="width: 100%; height: 90%"
            v-show="previewData.type == 'txt'"
            src="/data.txt"
            name="iframe_a"
          ></iframe>
          <div
            v-loading="loading"
            v-show="previewData.type == 'excel'"
            id="luckysheet"
          ></div>
        </div>
      </el-dialog>
    </el-space>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getData } from "@/utils/axios";
import { resource_list } from "@/utils/urlset";
import { getUrl, getUrlPreview } from "@/utils/util";
import axios from "axios";
import LuckyExcel from "luckyexcel";

const dialogVisible = ref(false);
const videoCount = ref(0);
const imageCount = ref(0);
const jsonData = ref({});
const loading = ref(false);

const previewData = ref({
  url: "",
  type: "",
  name: "",
});

const options = ref({
  src: "", //视频源
  type: "m3u8", //视频类型
});

// function updateImage(data) {
//   if (Object.hasOwn(data, "totalCount")) {
//     imageCount.value = data.totalCount;
//   } else if (Object.hasOwn(data, "total_count")) {
//     imageCount.value = data.total_count;
//   }
// }

// function updateVideo(data) {
//   if (Object.hasOwn(data, "totalCount")) {
//     videoCount.value = data.totalCount;
//   } else if (Object.hasOwn(data, "total_count")) {
//     videoCount.value = data.total_count;
//   }
// }
const transToFile = async (blob, fileName, fileType) => {
  return new window.File([blob], fileName, { type: fileType });
};

function loadRemoteData(type) {
  previewData.value.type = type;
  dialogVisible.value = true;
  if (previewData.value.type == "excel") {
    loading.value = true;
    axios({
      method: "get",
      url: "/format.xlsx",
      responseType: "arraybuffer",
    }).then((res) => {
      let blob = new Blob([res.data], { type: "application/octet-stream" });
      let pattern = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
      let result: any = pattern.exec(res.headers["content-disposition"]);
      // let fileName = decodeURI(result[1]);
      let textContain = transToFile(blob, "test", {
        type: "application/octet-stream",
      });

      textContain.then((res11) => {
        let file = res11;
        console.log(res11);
        LuckyExcel.transformExcelToLucky(
          file,
          function (exportJson, luckysheetfile) {
            if (exportJson.sheets == null || exportJson.sheets.length == 0) {
              alert(
                "Failed to read the content of the excel file, currently does not support xls files!"
              );
              return;
            }
            console.log("exportJson", exportJson);
            jsonData.value = exportJson;
            window.luckysheet.destroy();

            window.luckysheet.create({
              container: "luckysheet", //luckysheet is the container id
              showinfobar: false,
              data: exportJson.sheets,
              title: exportJson.info.name,
              userInfo: exportJson.info.name.creator,
            });
            loading.value = false;
          }
        );
      });
    });
  }
}

onMounted(() => {
  // getData(
  //   resource_list,
  //   {
  //     page: 1,
  //     page_size: 10,
  //     filter: JSON.stringify({ "basic.type": { $in: ["image"] } }),
  //   },
  //   updateImage
  // );
  // getData(
  //   resource_list,
  //   {
  //     page: 1,
  //     page_size: 10,
  //     filter: JSON.stringify({ "basic.type": { $in: ["video"] } }),
  //   },
  //   updateVideo
  // );
});
</script>

<style scoped>
#luckysheet {
  margin: 0px;
  padding: 0px;
  position: relative;
  width: 100%;
  height: 600px;
  left: 0px;
  top: 0px;
  bottom: 0px;
}
</style>
<style lang="scss" scoped>
.el-dialog-div {
  height: 60vh;
  overflow-x: hidden;
}
</style>
