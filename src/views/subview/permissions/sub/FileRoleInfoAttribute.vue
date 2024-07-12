<template>
  <el-dialog
    v-model="visible"
    title="编辑权限"
    width="40%"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @open="open"
    @close="close"
  >
    <el-form>
      <el-form-item
        v-for="(value, key) in actionsData"
        :key="key"
        :label="value.label"
      >
        <el-select
          v-model="value.ids"
          multiple
          placeholder="Select"
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
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="create()"> 更新 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { get, getData } from "@/utils/axios";
import { ElMessageBox } from "element-plus";
import { file_action_tree, get_file_role_actions } from "@/utils/urlset";

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

const actionsData = ref();
const fileActionIds: any = ref([]);

const emit = defineEmits(["submit", "update:visible"]);

function create() {
  let ids: any = [];

  for (let item in actionsData.value) {
    let tmpids = actionsData.value[item].ids;
    for (let id in tmpids) ids.push(tmpids[id]);
  }
  // console.log(ids);
  emit("submit", props.data.id, ids);
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

async function getFileActionTree() {
  let res: any = await get(file_action_tree, {});
  actionsData.value = res.data;
  updateHaveActions();
}

async function getFileRoleActions(id) {
  let res: any = await get(get_file_role_actions, {
    file_role_id: id
  });
  let { fileAction_ids } = res.data;
  if (fileAction_ids) {
    fileActionIds.value = fileAction_ids;
  } else {
    fileActionIds.value = [];
  }
  getFileActionTree();
}

function open() {
  getFileRoleActions(props.data.id);
}

function close() {
  actionsData.value = [];
  fileActionIds.value = [];
}
</script>
