<template>
  <BaseInfoUpdate title="更新标注任务" @submit="create">
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
            v-for="item in userOptions"
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
  </BaseInfoUpdate>
</template>

<script setup lang="ts">
import BaseInfoUpdate from "./BaseInfoUpdate.vue";
import { ref, onMounted, inject } from "vue";
import type { FormInstance } from "element-plus";
import type { AnnotationTask } from "@/utils/data";
import { getData, getAllUserData } from "@/utils/axios";
import { user_list, album_findChild } from "@/utils/urlset";

const ruleFormRef = ref<FormInstance>();
const formLabelWidth = "80px";
const userOptions = ref();
const form = inject(
  "updateTableData",
  ref<AnnotationTask>({
    source_id: 0,
    album_id: 0,
    handler: 0,
    status: "",
    remarks: "",
  })
);

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
  (e: "update", value: any): void;
}>();

function create() {
  emit("update", form.value);
}

onMounted(() => {
  getAllUserData(
    user_list,
    {
      page: 1,
      page_size: 10,
    },
    (data: any) => {
      userOptions.value = data;
    }
  );
});
</script>
