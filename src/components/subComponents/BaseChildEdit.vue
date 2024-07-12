<template>
  <el-dialog
    v-model="dialogUpdateRadioVisible"
    :title="props.title"
    width="30%"
    :before-close="handleClose"
    draggable
  >
    <slot />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogUpdateRadioVisible = false">取消</el-button>
        <el-button type="primary" @click="submit()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { ElMessageBox } from "element-plus";

const dialogUpdateRadioVisible = inject("dialogUpdateRadioVisible", ref(false));

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
