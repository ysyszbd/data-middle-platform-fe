<template>
  <el-dialog
    v-model="visible"
    title="映射数据集"
    width="40%"
    top="30vh"
    @open="dialogOpen"
    destroy-on-close
  >
    <el-form-item label="名称">
      <el-tree-select
        v-model="createForm.id"
        value-key="id"
        node-key="id"
        lazy
        check-strictly
        :load="load"
        :props="treeProps"
        style="width: 100%"
      >
      </el-tree-select>
    </el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="create"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getFilesApi } from "@/axios/taskAPIs";

const props = defineProps(["visible"]);
const emits = defineEmits(["update:visible", "add"]);

const createForm = ref({ id: "" });
const treeProps = {
  label: "name"
};

const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  }
});

function dialogOpen() {
  createForm.value.id = "";
}

async function load(node, resolve) {
  // console.log(node);
  const params = {
    path: "album",
    page: 1,
    page_size: 9999999
  };
  const filter = {};
  filter["basic.type.keyword"] = {
    type: "string",
    operation: "term",
    value: ["album"]
  };
  params["filter"] = JSON.stringify(filter);
  if (node.level === 0) {
    const res: any = await getFilesApi(params);
    // console.log(res.list);
    let list = res.list;
    list.forEach((e) => {
      e.path = e.basic.url;
      e.name = e.basic.name;
    });

    resolve(list);
  } else {
    params.path = node.data.path;
    const res: any = await getFilesApi(params);
    // console.log(res.list);
    let list = res.list;
    list.forEach((e) => {
      e.path = e.basic.url;
      e.name = e.basic.name;
    });
    resolve(list);
  }
}

function create() {
  // console.log(createForm.value);
  emits("add", createForm.value);
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
