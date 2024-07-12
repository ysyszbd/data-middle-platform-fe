<template>
  <el-dialog
    v-model="dialogUpdateAPIVisible"
    title="编辑角色API"
    width="30%"
    :before-close="handleClose"
    draggable
  >
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
      >全选</el-checkbox
    >
    <el-scrollbar height="400px" style="width: 100%">
      <el-checkbox-group v-model="checkList" @change="handleCheckedChange">
        <el-checkbox
          style="display: block"
          v-for="item in tableData"
          :key="item.id"
          :label="item.id"
        >
          {{ item.path }}
        </el-checkbox>
      </el-checkbox-group>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogUpdateAPIVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm()"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from "element-plus";
import type { RoleInfo, ApiInfo } from "@/utils/data";
import { ref, inject, watch } from "vue";
import { ElMessageBox } from "element-plus";
import { getData } from "@/utils/axios";
import { api_list, get_role_apis } from "@/utils/urlset";

const dialogUpdateAPIVisible = inject("dialogUpdateAPIVisible", ref(false));

const form = inject("updateTableData", ref());

const checkList = ref<number[]>([]);

const tableData = ref<ApiInfo[]>([]);

const checkAll = ref(false);
const isIndeterminate = ref(true);

watch(dialogUpdateAPIVisible, (newDialogUpdateVisible) => {
  if (newDialogUpdateVisible === true) {
    checkList.value = [];
    getData(get_role_apis, { role_id: form.value.id }, updateValue);
    getData(
      api_list,
      {
        page: 1,
        page_size: 9999,
      },
      (data: any) => {
        tableData.value = data.list;
      }
    );
  } else {
    checkList.value = [];
  }
});

function updateValue(data) {
  checkList.value = data.data.api_ids;
}

const handleCheckAllChange = (val) => {
  if (val) {
    checkList.value = [];
    for (let index = 0; index < tableData.value.length; index++) {
      const element = tableData.value[index];
      checkList.value.push(element.id);
    }
  } else {
    checkList.value = [];
  }

  isIndeterminate.value = false;
};

const handleCheckedChange = (value) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === tableData.value.length;
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < tableData.value.length;
};

const emit = defineEmits<{
  (e: "update", value: any, data): void;
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

function submitForm() {
  emit("update", form.value.id, checkList.value);
}
</script>

<style scoped></style>
