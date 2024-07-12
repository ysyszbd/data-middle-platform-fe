<template>
  <BaseChildEdit title="编辑用户角色" @submit="create">
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in tableData" :key="item.id" :label="item.id">
        {{ item.name }}</el-checkbox
      >
    </el-checkbox-group>
  </BaseChildEdit>
</template>

<script setup lang="ts">
import BaseChildEdit from "./BaseChildEdit.vue";
import type { UserInfo, RoleInfo } from "@/utils/data";
import { ref, inject, watch } from "vue";
import { getData } from "@/utils/axios";
import { get_user_roles, role_list } from "@/utils/urlset";

const totalRole = ref(0);
const form = inject("updateTableData", ref());

const dialogUpdateRadioVisible = inject("dialogUpdateRadioVisible", ref(false));
watch(dialogUpdateRadioVisible, (newDialogUpdateVisible: boolean) => {
  if (newDialogUpdateVisible === true) {
    getData(get_user_roles, { user_id: form.value.id }, updateValue);
    getData(
      role_list,
      {
        page: 1,
        page_size: 9999,
      },
      (data: any) => {
        tableData.value = data.list;
        totalRole.value = data.total_count;
      }
    );
  } else {
    checkList.value = [];
  }
});

const checkList = ref([]);
const tableData = ref<RoleInfo[]>([]);

function updateValue(data) {
  checkList.value = data.data.role_ids;
}

const emit = defineEmits<{
  (e: "update", value: any, data: any): void;
}>();

function create() {
  emit("update", form.value.id, checkList.value);
}
</script>

<style scoped></style>
