<template>
  <el-dialog
    v-model="dialogUpdateMenuVisible"
    title="编辑角色菜单"
    width="30%"
    :before-close="handleClose"
    draggable
  >
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="菜单:" :label-width="formLabelWidth">
        <el-scrollbar height="400px" style="width: 100%">
          <el-tree
            ref="treeRef"
            :data="tableData"
            :props="props"
            node-key="id"
            :load="loadNode"
            :default-checked-keys="checkList"
            lazy
            show-checkbox
            check-strictly
            default-expand-all
          />
        </el-scrollbar>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogUpdateMenuVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { ref, inject, watch } from "vue";
import { ElMessageBox, ElTree } from "element-plus";
import { getData } from "@/utils/axios";
import type Node from "element-plus/es/components/tree/src/model/node";
import { get_role_menus, menu_findChild } from "@/utils/urlset";

const formLabelWidth = "80px";
const ruleFormRef = ref<FormInstance>();

const dialogUpdateMenuVisible = inject("dialogUpdateMenuVisible", ref(false));

const form = inject("updateTableData", ref());

const checkList = ref([]);

const tableData = ref([]);

const treeRef = ref<InstanceType<typeof ElTree>>();

watch(dialogUpdateMenuVisible, (newDialogUpdateVisible) => {
  if (newDialogUpdateVisible === true) {
    checkList.value = [];
    getData(get_role_menus, { role_id: form.value.id }, updateValue);
    getData(menu_findChild, { id: 0 }, (data: any) => {
      tableData.value = data.list;
    });
  } else {
    checkList.value = [];
  }
});

function updateValue(data) {
  checkList.value = data.data.menu_ids;
}

const emit = defineEmits<{
  (e: "update", value: any, data: any): void;
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

function submitForm(formRef: FormInstance | undefined) {
  if (!formRef) return;

  let array = treeRef.value?.getCheckedKeys(false);
  let halfArray = treeRef.value?.getHalfCheckedKeys();

  if (array != undefined && halfArray != undefined) {
    for (let index = 0; index < halfArray.length; index++) {
      const element = halfArray[index];
      if (!array?.includes(element)) {
        array.push(element);
      }
    }
  }

  emit("update", form.value.id, array);
  // console.log(array);
}

interface Tree {
  name: string;
  leaf?: boolean;
}

const props = {
  label: "name",
  children: "zones"
  // isLeaf: !"has_child",
};

const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    return resolve(tableData.value);
  }
  if (!node.data.has_child) return resolve([]);

  getData(menu_findChild, { id: node.data.id }, (data) => {
    resolve(data.list);
  });
};
</script>

<style scoped></style>
