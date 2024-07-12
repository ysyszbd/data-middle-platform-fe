<template>
  <div class="root">
    <OperationBar
      creatButton="创建权限"
      deleteButton="删除选中"
      @onCreatButtonHandel="createEvent"
      @onDeleteButtonHandel="deleteSelection"
    />
    <FileRoleInfoEdit
      v-model:visible="dialogVisible"
      :type="editType"
      :data="updateTableData"
      @submit="createData"
    />
    <FileRoleInfoAttribute
      v-model:visible="dialogAttributeVisible"
      :data="updateTableData"
      @submit="updateActions"
    />
    <div class="table-div">
      <el-table
        ref="mainTable"
        :data="tableData"
        row-key="id"
        height="calc(100%)"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
        :header-cell-style="tableHeaderStyle"
        table-layout="auto"
        lazy
        :load="loadChildren"
        :tree-props="{ children: 'children', hasChildren: 'has_child' }"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column type="selection" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button
              link
              type="success"
              size="small"
              @click.prevent="update(scope.row)"
            >
              重命名
            </el-button>
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="editActions(scope.row)"
            >
              编辑权限
            </el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon-color="#626AEF"
              title="确定删除本条数据吗？"
              @confirm="deleteData(scope.row.id)"
            >
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import FileRoleInfoEdit from "./sub/FileRoleInfoEdit.vue";
import FileRoleInfoAttribute from "./sub/FileRoleInfoAttribute.vue";
import OperationBar from "@/components/OperationBar.vue";
import type { FileRoleInfo } from "@/utils/data";
import { ref, onMounted } from "vue";
import { tableHeaderStyle } from "@/utils/style";
import { getData, create, deleteRow, updateIdParameter } from "@/utils/axios";
import {
  file_role_create,
  file_role_update,
  file_role_delete,
  file_role_deleteBatch,
  file_role_findChild,
  set_file_role_actions
} from "@/utils/urlset";

const multipleSelection = ref<FileRoleInfo[]>([]);
const tableData = ref([]);
const mainTable = ref();
const total = ref(0);
const loadMap = new Map();
const editType = ref("create");
const dialogVisible = ref(false);
const dialogAttributeVisible = ref(false);
const updateTableData = ref();

const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

function createEvent() {
  editType.value = "create";
  dialogVisible.value = true;
}

function updateActions(id, ids) {
  updateIdParameter(
    set_file_role_actions,
    { file_role_id: id, file_action_ids: ids },
    () => {
      dialogAttributeVisible.value = false;
    }
  );
}

function createData(form: any) {
  if ("create" == editType.value) {
    delete form.id;
    create(file_role_create, form, getTableData);
  } else updateIdParameter(file_role_update, form, getTableData);
}

function deleteData(index: number) {
  deleteRow(file_role_delete, { id: index }, getTableData);
}

function deleteSelection() {
  let data = new Array<number>();
  for (let index = 0; index < multipleSelection.value.length; index++) {
    const element = multipleSelection.value[index];
    data.push(element.id);
  }
  deleteRow(file_role_deleteBatch, { ids: data }, getTableData);
}

function update(index: any) {
  editType.value = "update";
  dialogVisible.value = true;
  updateTableData.value = index;
}

function updateValue(data) {
  tableData.value = data.list;
  if (Object.hasOwn(data, "totalCount")) {
    total.value = data.totalCount;
  } else if (Object.hasOwn(data, "total_count")) {
    total.value = data.total_count;
  }
}

function editActions(data) {
  dialogAttributeVisible.value = true;
  updateTableData.value = data;
}

function getTableData() {
  dialogVisible.value = false;
  getData(file_role_findChild, { id: 0 }, updateValue);
  for (let [key] of loadMap) {
    reloadTree(key);
  }
}

function loadChildren(
  row: FileRoleInfo,
  treeNode: unknown,
  resolve: (data: FileRoleInfo[]) => void
) {
  getData(file_role_findChild, { id: row.id }, (data) => {
    resolve(data.list);
  });
  loadMap.set(row.id, { row, treeNode, resolve });
}

const reloadTree = (parentId: any) => {
  parentId = parentId ? parseInt(parentId) : 0;
  const { row, treeNode, resolve } = loadMap.get(parentId);
  if (
    mainTable.value.store.states.lazyTreeNodeMap.value[parentId].length == 1
  ) {
    mainTable.value.store.states.lazyTreeNodeMap.value[parentId] = [];
  }
  loadChildren(row, treeNode, resolve);
};

onMounted(() => {
  getTableData();
});
</script>

<style scoped src="@/assets/css/base.css"></style>
