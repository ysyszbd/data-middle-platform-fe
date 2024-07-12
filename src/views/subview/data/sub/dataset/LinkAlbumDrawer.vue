<template>
  <el-drawer
    v-model="visible"
    @open="open(true)"
    @close="open(false)"
    direction="ltr"
    size="50%"
    destroy-on-close
  >
    <template #header>
      <h4>导入数据集</h4>
    </template>
    <template #default>
      <BaseListView
        showtype="false"
        type="total"
        style="height: calc(100% - 50px)"
        @select-data-change="setSelectData"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">创建</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import BaseListView from "../dataraw/BaseListView.vue";
import { ref, computed } from "vue";

const props = defineProps(["visible"]);
const emits = defineEmits(["update:visible", "submit"]);
const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  }
});

const form = ref({
  source_id: 0,
  url: "",
  source_type: "album"
});

const selectData: any = ref({
  list: [],
  dirArr: []
});

const authObj = ref();

function open(value) {}

function cancelClick() {
  visible.value = false;
}

function confirmClick() {
  if (authObj.value.importDataSet) {
    emits("submit", selectData.value.dirArr);
    visible.value = false;
  } else {
    ElMessage({
      message: "包含没有导入数据集权限的文件",
      type: "warning"
    });
  }
}

function setSelectData(data, auth) {
  selectData.value = data;
  authObj.value = auth;
  if (!authObj.value.importDataSet) {
    ElMessage({
      message: "选择了没有导入数据集权限的文件",
      type: "warning"
    });
  }
}
</script>

<style scoped lang="scss">
:global(.el-drawer) {
  --el-drawer-padding-primary: 10px !important;
}
:global(.el-drawer__header) {
  margin-bottom: 0px !important;
}
.el-card {
  --el-card-padding: 10px;
}
</style>
