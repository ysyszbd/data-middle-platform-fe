<template>
  <BaseChildEdit title="编辑部门角色" @submit="create">
    <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
      <el-checkbox v-for="item in tableData" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
  </BaseChildEdit>
</template>

<script setup lang="ts">
import BaseChildEdit from "./BaseChildEdit.vue";
import { ref, inject, watch } from "vue";
import { getData } from "@/utils/axios";
import type { DeptInfo, RoleInfo } from "@/utils/data";
import { get_dept_roles, role_list } from "@/utils/urlset";

const totalRole = ref(0);
const checkList = ref<number[]>();
const tableData = ref<RoleInfo[]>([]);
const form = inject(
  "updateTableData",
  ref<DeptInfo>({ id: 0, parent_id: 0, status: "", name: "", order: 0 })
);
const dialogUpdateRadioVisible = inject(
  "dialogUpdateRadioVisible",
  ref<boolean>(false)
);

watch(dialogUpdateRadioVisible, (newDialogUpdateVisible) => {
  if (newDialogUpdateVisible === true) {
    getData(get_dept_roles, { dept_id: form.value.id }, updateValue);
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

function updateValue(data) {
  checkList.value = data.data.role_ids;
}

const handleCheckedChange = (value) => {
  checkList.value = value;
};

const emit = defineEmits<{
  (e: "update", value: any, data: any): void;
}>();

function create() {
  emit("update", form.value.id, checkList.value);
}
</script>

<style scoped></style>
