<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.title"
    width="30%"
    :before-close="handleClose"
    draggable
    destroy-on-close
  >
    <slot />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit()"> 创建 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { ElMessageBox } from "element-plus";

const dialogVisible = inject("dialogVisible", ref(false));

const props = defineProps({
  title: { type: String, required: true },
});

const emit = defineEmits<{
  (e: "submit"): void;
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

function submit() {
  emit("submit");
}
</script>

<style scoped></style>
