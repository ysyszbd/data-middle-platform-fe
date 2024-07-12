<template>
  <BaseInfoEdit title="创建菜单" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="路径:" :label-width="formLabelWidth">
        <el-input v-model="form.url" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-input v-model.number="form.type" autocomplete="off" />
      </el-form-item>
      <!-- <el-form-item label="图标:" :label-width="formLabelWidth">
        <el-input v-model="form.icon" autocomplete="off" />
      </el-form-item> -->
      <!-- <el-form-item label="排序:" :label-width="formLabelWidth">
        <el-input v-model.number="form.sort" autocomplete="off" />
      </el-form-item> -->
      <el-form-item label="顶级菜单">
        <el-radio-group v-model="topMenu" @change="change">
          <el-radio :label="false">是</el-radio>
          <el-radio :label="true">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-show="topMenu">
        <el-form-item label="父菜单:" :label-width="formLabelWidth">
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
import type { MenuInfo } from "@/utils/data";
import { getData } from "@/utils/axios";
import { menu_findChild } from "@/utils/urlset";

const ruleFormRef = ref<FormInstance>();
const formLabelWidth = "80px";
const topMenu = ref(false);
const firstId = ref(0);

const props = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf",
};

function change(value: any) {
  topMenu.value = value;
  if (!value) {
    form.value.parent_id = 0;
  } else {
    form.value.parent_id = firstId.value;
  }
}

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const form = ref<MenuInfo>({
  id: 0,
  parent_id: 0,
  type: 0,
  name: "",
  icon: "",
  sort: 0,
  url: "",
});

function create() {
  console.log(form.value.parent_id);

  emit("submit", form.value);
}

const load = (node, resolve) => {
  if (node.level === 0) {
    getData(menu_findChild, { id: 0 }, (data) => {
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

  getData(menu_findChild, { id: node.data.id }, (data) => {
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
