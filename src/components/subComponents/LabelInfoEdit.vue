<template>
  <BaseInfoEdit title="创建标签" @submit="create">
    <el-form :model="form">
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-input v-model="form.type" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分组:" :label-width="formLabelWidth">
        <el-input v-model="form.group" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoEdit>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseInfoEdit from "./BaseInfoEdit.vue";

const formLabelWidth = "50px";

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const form = ref({
  id: 0,
  name: "",
  type: "",
  group: "",
});

function create() {
  emit("submit", form.value);
}
</script>
