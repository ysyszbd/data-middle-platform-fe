<template>
  <el-dialog
    v-model="exportDataDialogVisible"
    :title="props.title"
    width="85%"
    :before-close="handleClose"
    draggable
    align-center
    destroy-on-close
  >
    <el-form :model="form" label-width="120px" v-loading="loading">
      <el-row>
        <el-col :span="6">
          <el-form-item label="文件名">
            <el-input v-model="form.file_name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="标题">
            <el-input v-model="form.sheet_name" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="后缀">
            <el-input v-model="form.time_suffix" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="资源类型">
        <el-radio-group v-model="form.resource_type">
          <el-radio label="image">图片</el-radio>
          <el-radio label="video">视频</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="工具集">
        <el-radio-group v-model="form.data_type">
          <el-radio
            v-for="item in workToolList"
            :key="item.key"
            :label="item.key"
            @change="toolsChange"
          >
            {{ item.value }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.data_type != 'envLabel'" label="类别">
        <el-checkbox-group v-model="form.category">
          <el-checkbox v-for="item in categorys" :key="item" :label="item">{{
            item
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="导出格式" v-show="form.data_type == 'envLabel'">
        <el-radio-group v-model="form.export_type">
          <el-radio label="1">excel</el-radio>
          <el-radio label="2">other</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.data_type == 'envLabel'" label="标签逻辑">
        <el-radio-group v-model="form.tag_logic">
          <el-radio label="and">与逻辑</el-radio>
          <el-radio label="or">或逻辑</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <EventPanel
      v-show="form.data_type == 'envLabel'"
      @update-select-tags="updateSelectTags"
      :rightWidth="0"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="
            exportDataDialogVisible = false;
            loading = false;
          "
          >取消</el-button
        >
        <el-button type="primary" @click="submit()"> 导出 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { ElMessageBox } from "element-plus";
import { getData, getFileData } from "@/utils/axios";
import EventPanel from "@/views/subview/data/sub/EventPanel.vue";
import { annotation_download, file_file_export } from "@/utils/urlset";
import { getSourceUrl } from "@/utils/util";
import { ElMessage } from "element-plus";
import { workToolList } from "@/utils/data";
import tools_category from "@/components/draw/setting.json";

const categorys = ref();
const loading = ref(false);
const form = ref({
  album_id: [],
  file_name: "",
  export_type: "1",
  data_type: "envLabel",
  tag_logic: "and",
  // title: "",
  time_suffix: "",
  sheet_name: "",
  tag_ids: [],
  resource_type: "image",
  category: ["线段分割"]
});

const exportDataDialogVisible = inject("exportDataDialogVisible", ref(false));

const props = defineProps(["ablum_id", "title"]);

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭此对话框吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

function getLabelTags() {
  if (form.value.tag_ids.length > 0) {
    if (form.value.tag_logic == "and") {
      return {
        "label.tags": {
          type: "int",
          operation: "term",
          value: form.value.tag_ids
        }
      };
    } else {
      return {
        "label.tags": {
          type: "int",
          operation: "terms",
          value: form.value.tag_ids
        }
      };
    }
  }
}

function params(obj) {
  let result = "";
  let item;
  for (item in obj) {
    if (obj[item] && JSON.stringify(obj[item])) {
      result += `&${item}=${JSON.stringify(obj[item])}`;
    }
  }
  if (result) {
    result = "?" + result.slice(1);
  }
  console.log(result);
  return result;
}

function submit() {
  loading.value = true;
  ElMessage({
    message: "开始导出...",
    type: "success"
  });
  form.value.album_id = props.ablum_id;
  if (form.value.data_type != "envLabel") {
    const data = {
      resource_type: form.value.resource_type,
      tool: form.value.data_type,
      category: JSON.stringify(form.value.category),
      album_id: JSON.stringify(form.value.album_id)
    };

    getData(annotation_download, data, (res) => {
      exportDataDialogVisible.value = false;
      window.open(getSourceUrl(res.data));
      loading.value = false;
    });
  } else {
    let linersData = {
      "liners.liner_id.keyword": {
        type: "string",
        operation: "terms",
        value: form.value.album_id
      }
    };

    let seachData = { ...linersData, ...getLabelTags() };

    const filter = {
      file_name: form.value.file_name,
      time_suffix: form.value.time_suffix,
      sheet_name: form.value.sheet_name,

      filter: JSON.stringify(seachData)
    };

    getFileData(file_file_export, filter, (res) => {
      const blob = new Blob([res.data], { type: "application/octet-stream" });
      const pattern = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
      const result: any = pattern.exec(res.headers["content-disposition"]);
      const fileName = decodeURI(result[1]);
      const downloadElement = document.createElement("a");
      const href = window.URL.createObjectURL(blob);
      downloadElement.style.display = "none";
      downloadElement.href = href;
      downloadElement.download = fileName;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);

      exportDataDialogVisible.value = false;
      loading.value = false;
    });
  }
}

function updateSelectTags(value) {
  let tag_ids: any = [];
  for (let id in value) {
    tag_ids.push(id.toString());
  }
  form.value.tag_ids = tag_ids;
}

function toolsChange() {
  form.value.category = [];
  categorys.value = [];
  if (form.value.data_type != "envLabel") {
    const objs = tools_category[form.value.data_type].objects;
    for (let i = 0; i < objs.length; i++) {
      categorys.value.push(objs[i].category);
    }
    form.value.category = categorys.value;
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 6px;
}
.el-checkbox {
  margin-right: 10px;
}
</style>
