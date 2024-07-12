<template>
  <el-dialog
    v-model="visible"
    :title="titleName"
    width="30%"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @open="open"
    @close="close"
  >
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="顶级权限" v-show="type == 'create'">
        <el-radio-group v-model="topMenu" @change="change">
          <el-radio :label="false">是</el-radio>
          <el-radio :label="true">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-show="topMenu">
        <el-form-item label="父级权限:" :label-width="formLabelWidth">
          <el-tree-select
            v-model="form.parent_id"
            value-key="id"
            node-key="id"
            lazy
            check-strictly
            :load="load"
            :props="treeProps"
            style="width: 100%"
          />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="create()">
          {{ type == "create" ? "创建" : "更新" }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getData } from "@/utils/axios";
import { file_role_findChild } from "@/utils/urlset";
import { ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import type { FileRoleInfo } from "@/utils/data";

const treeProps = { label: "name" };

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  data: Object
});

const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  }
});

const ruleFormRef = ref<FormInstance>();
const formLabelWidth = "80px";
const topMenu = ref(false);
const firstId = ref(0);
const titleName = ref("创建");

function change(value: any) {
  topMenu.value = value;
  if (props.type != "create") {
    return;
  }
  if (!value) {
    form.value.parent_id = 0;
  } else {
    form.value.parent_id = firstId.value;
  }
}

const emit = defineEmits(["submit", "update:visible"]);

const form = ref<FileRoleInfo>({
  id: 0,
  parent_id: 0,
  name: ""
});

function create() {
  emit("submit", form.value);
}

function open() {
  if ("update" == props.type) {
    form.value = { ...form.value, ...props.data };
    titleName.value = "更新";
  } else {
    titleName.value = "创建";
  }
}

function close() {
  form.value = {
    id: 0,
    parent_id: 0,
    name: ""
  };
}

const load = (node, resolve) => {
  if (node.level === 0) {
    getData(file_role_findChild, { id: 0 }, (data) => {
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

  getData(file_role_findChild, { id: node.data.id }, (data) => {
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
