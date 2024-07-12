<template>
  <el-upload
    ref="upload"
    v-model:file-list="fileList"
    :limit="1"
    :auto-upload="false"
    :on-exceed="handleExceed"
  >
    <template #trigger>
      <el-button type="primary">select file</el-button>
    </template>
    <el-button class="ml-3" type="success" @click="read">
      upload to server
    </el-button>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { genFileId } from "element-plus";
import type {
  UploadInstance,
  UploadProps,
  UploadUserFile,
  UploadRawFile,
} from "element-plus";

const upload = ref<UploadInstance>();

const fileList = ref<UploadUserFile[]>([]);

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value?.handleStart(file);
};

function read() {
  // console.log(fileList.value.at(0)?.raw);
  // let reader = new FileReader();
  // reader.readAsArrayBuffer(fileList.value.at(0)!.raw!); //发起异步请求
  // reader.onload = function () {
  //   //读取完成后，数据保存在对象的result属性中
  //   let byts = new Uint8Array(this.result);

  //   let strName = "";
  //   let timeStart = 0;
  //   for (let i = 0; i < byts.length; i++) {
  //     if (i === 0) {
  //       for (let index = i; index < i + 8; index++) {
  //         timeStart += (byts[index] & 0xff) * Math.pow(2, 8 * index);
  //       }
  //       console.log(timeStart);
  //     }

  //     if (i % 72 === 16) {
  //       let strbytarr: any = [];
  //       for (let index = i; index < i + 50; index++) {
  //         strbytarr.push(String.fromCharCode(byts[index]));
  //       }
  //       if (strName != strbytarr.join("").split("/").at(-1)) {
  //         strName = strbytarr.join("").split("/").at(-1)!;
  //         console.log(strName);

  //         let time = 0;
  //         for (let index = i - 16; index < i - 8; index++) {
  //           time +=
  //             (byts[index] & 0xff) * Math.pow(2, 8 * (8 - (i - 8 - index)));
  //         }
  //         console.log(time - timeStart);
  //       }
  //     }
  //   }
  // };
}
</script>

<style scoped></style>
