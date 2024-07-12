<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建挑图任务"
    width="30%"
    :before-close="handleClose"
    draggable
  >
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="源数据集:" :label-width="formLabelWidth">
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
      <el-form-item label="目标数据集:" :label-width="formLabelWidth">
        <el-tree-select
          v-model="form.target_id"
          value-key="id"
          node-key="id"
          lazy
          check-strictly
          :load="load"
          :props="props"
        />
        <el-input
          v-show="showDirInput"
          v-model="inputDirName"
          placeholder="文件夹"
          style="width: 120px"
        />
        <el-button type="primary" @click="createDir()">
          {{ createDirButtonName }}
        </el-button>
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-input v-model="form.pick_type" autocomplete="off" />
      </el-form-item>
      <el-form-item label="amount:" :label-width="formLabelWidth">
        <el-input v-model.number="form.amount" autocomplete="off" />
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
        <el-button type="primary" @click="createTask()"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { ref, onMounted, inject } from "vue";
import { ElMessageBox } from "element-plus";
import { getData, create } from "@/utils/axios";
import { useStateStore } from "@/stores/state";
import { album_create, album_findChild } from "@/utils/urlset";

const formLabelWidth = "80px";
const ruleFormRef = ref<FormInstance>();
const showDirInput = ref(false);
const inputDirName = ref("");
const createDirButtonName = ref("新建");
const dialogVisible = inject("dialogCreatePickVisible", ref(false));

const store = useStateStore();

const props = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf",
};

const form = ref({
  source_id: 0,
  target_id: 0,
  pick_type: "抽帧",
  amount: 0,
  status: "",
  remarks: "",
});

const newAlbum = ref({
  parent_id: form.value.target_id,
  name: inputDirName.value,
  type: "",
  remarks: "",
  creator: 0,
  bucket: "",
});

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
        form.value.target_id = list[0].id;
      }
      resolve(list);
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
    resolve(list);
  });
};

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

function createTask() {
  emit("submit", form.value);
}

function createDir() {
  console.log("createDir");
  if (showDirInput.value) {
    newAlbum.value.creator = store.getUserId;
    newAlbum.value.parent_id = form.value.target_id;
    newAlbum.value.name = inputDirName.value;
    create(album_create, newAlbum.value, (id) => {
      form.value.target_id = id;
    });
  }
  showDirInput.value = !showDirInput.value;
  if (showDirInput.value) {
    createDirButtonName.value = "确定";
  } else {
    createDirButtonName.value = "新建";
  }
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

<style scoped></style>
