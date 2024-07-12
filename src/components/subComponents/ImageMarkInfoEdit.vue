<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建图片标注任务"
    width="30%"
    :before-close="handleClose"
    draggable
  >
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="源:" :label-width="formLabelWidth">
        <el-tree-select
          v-model="form.source_id"
          value-key="id"
          node-key="id"
          lazy
          check-strictly
          :load="load"
          :props="props"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="人员:" :label-width="formLabelWidth">
        <el-select
          v-model="form.handler"
          filterable
          placeholder="人员"
          style="width: 100%"
        >
          <el-option
            v-for="item in userListStore.userOptions"
            :key="item.id"
            :label="item.nick_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" :label-width="formLabelWidth">
        <el-input v-model="form.status" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注:" :label-width="formLabelWidth">
        <el-input v-model="form.remarks" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="create()"> 创建 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">

import { ref, inject } from "vue";
import { ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import type { AnnotationTask } from "@/utils/data";
import { getData } from "@/utils/axios";
import { album_findChild } from "@/utils/urlset";
import { userListStore } from "@/stores/store";

const ruleFormRef = ref<FormInstance>();
const formLabelWidth = "80px";
const dialogVisible = inject("dialogImageMarkVisible", ref(false));

const props = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf",
};

const load = (node, resolve) => {
  if (node.level === 0) {
    getData(album_findChild, { id: 0 }, (data) => {
      let list = data.list;
      list.map((child) => {
        if (child.has_child == undefined) {
          child.isLeaf = true;
        }
      });
      if (list.length > 0) {
        form.value.source_id = list[0].id;
      }
      resolve(data.list);
    });
    return;
  }

  getData(album_findChild, { id: node.data.id }, (data) => {
    let list = data.list;
    list.map((child) => {
      if (child.has_child == undefined) {
        child.isLeaf = true;
      }
    });
    resolve(data.list);
  });
};

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const form = ref<AnnotationTask>({
  source_id: 0,
  album_id: 0,
  handler: 0,
  status: "",
  remarks: "",
});

function create() {
  form.value.album_id = form.value.source_id;
  emit("submit", form.value);
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭此对话框吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
