<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.title"
    :width="width"
    :before-close="handleClose"
    draggable
    align-center
    destroy-on-close
  >
    <slot />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="$emit('submit')"> 创建 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ElMessageBox } from "element-plus";

const props = defineProps({
  title: { type: String, required: true },
  width: { type: String, required: true },
  dialogVisible: { type: Boolean, required: true },
});

const emit = defineEmits(["update:dialogVisible", "submit"]);

const dialogVisible = computed({
  get() {
    return props.dialogVisible;
  },
  set(value) {
    emit("update:dialogVisible", value);
  },
});

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("确定关闭此对话框吗?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style scoped></style>
