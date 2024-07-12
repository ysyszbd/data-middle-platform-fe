<template>
  <el-dialog
    v-model="visible"
    title="审核"
    width="40%"
    top="30vh"
    @open="dialogOpen"
  >
    <el-form-item label="备注">
      <el-input v-model="createForm.comment" />
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
const emits = defineEmits(["update:visible", "review"]);

const createForm = ref({
  comment: "",
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
  createForm.value.comment = "";
}

function create() {
  emits("review", createForm.value);
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
