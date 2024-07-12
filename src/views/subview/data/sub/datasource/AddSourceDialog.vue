<template>
  <el-dialog
    v-model="visible"
    title="添加数据源"
    width="40%"
    top="30vh"
    @open="dialogOpen"
  >
    <el-form-item label="路径">
      <el-input v-model="createForm.url" />
    </el-form-item>
    <el-form-item label="类型">
      <el-radio-group v-model="createForm.type" class="ml-4">
        <el-radio label="nas">NAS</el-radio>
        <el-radio label="oss" disabled>OSS</el-radio>
      </el-radio-group>
    </el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="create"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps(["visible"]);
const emits = defineEmits(["update:visible", "add"]);

const createForm = ref({
  url: "",
  type: "nas",
});

const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  },
});

function dialogOpen() {
  createForm.value.url = "";
  createForm.value.type = "nas";
}

function create() {
  emits("add", createForm.value);
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
