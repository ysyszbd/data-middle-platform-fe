<template>
  <BaseInfoEdit title="创建部门" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态:" :label-width="formLabelWidth">
        <el-input v-model="form.status" autocomplete="off" />
      </el-form-item>
      <el-form-item label="顶级部门">
        <el-radio-group v-model="topTepartment" @change="change">
          <el-radio :label="false">是</el-radio>
          <el-radio :label="true">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-show="topTepartment">
        <el-form-item label="上级部门:" :label-width="formLabelWidth">
          <el-tree-select
            v-model="form.parent_id"
            value-key="id"
            node-key="id"
            lazy
            check-strictly
            :load="load"
            :props="props"
          />
        </el-form-item>
      </div>
    </el-form>
  </BaseInfoEdit>
</template>

<script setup lang="ts">
import BaseInfoEdit from "./BaseInfoEdit.vue";
import { ref } from "vue";
import type { FormInstance } from "element-plus";
import type { DeptInfo } from "@/utils/data";
import { getData } from "@/utils/axios";
import { dept_findChild } from "@/utils/urlset";

const ruleFormRef = ref<FormInstance>();

const formLabelWidth = "80px";
const topTepartment = ref(false);
const firstId = ref(0);

const props = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf",
};

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const form = ref<DeptInfo>({
  id: 0,
  parent_id: 0,
  status: "",
  name: "",
  order: 0,
});

function change(value: any) {
  topTepartment.value = value;
  if (!value) {
    form.value.parent_id = 0;
  } else {
    form.value.parent_id = firstId.value;
  }
}

function create() {
  emit("submit", form.value);
}

const load = (node, resolve) => {
  if (node.level === 0) {
    getData(dept_findChild, { id: 0 }, (data) => {
      let list = data.list;
      list.map((child) => {
        if (child.has_child == undefined) {
          child.isLeaf = true;
        }
      });
      if (list.length > 0) {
        firstId.value = list[0].id;
      }
      resolve(list);
    });
    return;
  }

  getData(dept_findChild, { id: node.data.id }, (data) => {
    let list = data.list;
    list.map((child) => {
      if (child.has_child == undefined) {
        child.isLeaf = true;
      }
    });
    if (list == null) {
      resolve([]);
    } else {
      resolve(list);
    }
  });
};
</script>
