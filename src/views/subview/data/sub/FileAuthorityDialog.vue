<template>
  <el-dialog
    v-model="visible"
    title="权限分配"
    width="40%"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @open="open"
    @close="close"
  >
    <el-form ref="ruleFormRef" :model="data">
      <el-form-item label="权限:">
        <el-scrollbar height="400px" style="width: 100%">
          <el-tree
            ref="treeRef"
            :data="tableData"
            :props="tableProps"
            :default-checked-keys="checkList"
            :expand-on-click-node="false"
            :load="loadNode"
            @check="handleCheckChange"
            node-key="id"
            lazy
            show-checkbox
            check-strictly
            default-expand-all
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-popover
                    placement="top-end"
                    title="详情"
                    :width="400"
                    trigger="click"
                    :content="contentDetails"
                  >
                    <template #reference>
                      <a @click="details(data)"> 详情 </a>
                    </template>
                    <el-form>
                      <el-form-item
                        v-for="(value, key) in actionsData"
                        :key="key"
                        :label="value.label"
                      >
                        <el-select
                          v-model="value.ids"
                          multiple
                          disabled
                          placeholder="无"
                          style="width: 100%"
                        >
                          <el-option
                            v-for="item in value.children"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </el-popover>
                </span>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { get, getData } from "@/utils/axios";
import { ElTree } from "element-plus";
import {
  file_role_findChild,
  get_file_role_actions,
  file_action_tree
} from "@/utils/urlset";
import type { FormInstance } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";

const emit = defineEmits(["submit", "update:visible"]);

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  data: {
    type: Object,
    required: true
  }
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
const tableData = ref([]);
const treeRef = ref<InstanceType<typeof ElTree>>();
const checkList = ref([]);
const tableProps = {
  label: "name",
  children: "zones"
};

const contentDetails = ref("");
const actionsData = ref();
const fileActionIds: any = ref([]);

const handleCheckChange = (node, checkedNodes) => {
  console.log(node, checkedNodes);

  const checked = checkedNodes.checkedNodes.some((item) => item.id == node.id);
  const checkedKeys = checkedNodes.checkedKeys;
  emit("submit", props.data, checked, [node.id], checkedKeys);
};

function getFileRole() {
  getData(file_role_findChild, { id: 0 }, (data) => {
    tableData.value = data.list;
  });
}

function getUserFileRoles() {
  checkList.value = props.data.role.file_role_ids;
}

interface Tree {
  name: string;
  leaf?: boolean;
  id: number;
}

const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
  if (node.level === 0) {
    return resolve(tableData.value);
  }
  if (!node.data.has_child) return resolve([]);

  getData(file_role_findChild, { id: node.data.id }, (data) => {
    resolve(data.list);
  });
};

function open() {
  getFileRole();
  getUserFileRoles();
}

function close() {
  checkList.value = [];
}

function details(data) {
  getFileRoleActions(data.id);
}

async function getFileActionTree() {
  let res: any = await get(file_action_tree, {});
  actionsData.value = res.data;
  updateHaveActions();
}

async function getFileRoleActions(id) {
  let res: any = await get(get_file_role_actions, { file_role_id: id });
  let { fileAction_ids } = res.data;
  if (fileAction_ids) {
    fileActionIds.value = fileAction_ids;
  } else {
    fileActionIds.value = [];
  }
  getFileActionTree();
}

function updateHaveActions() {
  for (let key in actionsData.value) {
    let { ids, children } = actionsData.value[key];
    if (!ids) {
      actionsData.value[key].ids = [];
      for (let i = 0; i < children.length; i++) {
        if (fileActionIds.value.includes(children[i].id)) {
          actionsData.value[key].ids.push(children[i].id);
        }
      }
    }
  }
  console.log(actionsData.value);
}
</script>
<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 18px;
}
a {
  font-weight: 500;
  text-decoration: inherit;
  color: var(--el-color-primary);
}
</style>
