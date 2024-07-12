<template>
  <div class="operation card-header">
    <DataSetImport v-model:visible="importDataSetDialogVisible" />
    <div></div>
    <div style="margin-right: 20px; display: flex">
      <el-checkbox
        v-model="isFilter"
        label="是否筛选"
        size="large"
        @change="filter"
        style="margin: 0px 10px"
      />
      <el-radio-group
        v-if="type == 'dr'"
        v-model="searchUse"
        @change="typeChange"
        style="margin-right: 10px"
      >
        <el-radio-button label="total">全部</el-radio-button>
        <el-radio-button label="labeltrain">标注</el-radio-button>
        <el-radio-button label="testdata">测试</el-radio-button>
        <el-radio-button label="customerdata">客户</el-radio-button>
      </el-radio-group>
      <div class="card-header">
        <el-dropdown
          trigger="click"
          @command="handleCommand"
          style="margin-left: 10px"
          v-if="type == 'ds' && createDataSetVisible()"
        >
          <el-button type="primary">
            数据集<el-icon><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item command="importdataset">
                数据集导入
              </el-dropdown-item> -->
              <el-dropdown-item command="creatdataset">
                创建数据集
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-radio-group
        v-model="dataShowType"
        style="margin-left: 10px"
        @change="switchShowType"
      >
        <el-radio-button :label="true">
          <el-icon> <List /> </el-icon>
        </el-radio-button>
        <el-radio-button :label="false">
          <el-icon> <Picture /> </el-icon>
        </el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataSetImport from "./DataSetImport.vue";
import { ref } from "vue";
import { ArrowDown, Picture, List } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useStateStore } from "@/stores/state";

const importDataSetDialogVisible = ref(false);
const isFilter = ref(false);
const searchType = ref("path");
const props = defineProps(["type", "auth"]);
const emits = defineEmits([
  "switchShowType",
  "creatAlbum",
  "updateAlbum",
  "pickImage",
  "creatAlbum",
  "filter",
  "searchTypeChange"
]);
const dataShowType = ref(true);
const searchUse = ref("total");

function typeChange(val) {
  emits("searchTypeChange", val);
}

function filter() {
  emits("filter", isFilter.value);
}

function switchShowType() {
  emits("switchShowType", dataShowType.value);
}

function createDataSetVisible() {
  const store = useStateStore();
  let roleIds = store.getUserRoleIds;
  let roles = roleIds.split(",");
  if (roles.includes("1") || roles.includes("4")) {
    return true;
  } else {
    return false;
  }
}

function handleCommand(command) {
  switch (command) {
    case "creatdataset":
      emits("creatAlbum", "");
      break;
    case "importdataset":
      importDataSetDialogVisible.value = true;
      break;
    default:
      ElMessage({
        message: "该功能暂未开放.",
        type: "warning"
      });
      break;
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
