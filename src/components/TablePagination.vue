<template>
  <el-pagination
    background
    hide-on-single-page
    :page-size="pageSize"
    layout="prev, pager, next, jumper"
    :total="total"
    :current-page="currentPage"
    @current-change="onCurrentChange"
    class="pagination"
  />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const currentPage = ref(1);

watch(currentPage, function (nval, oval) {
  emit("currentChange", nval);
});

defineProps({
  pageSize: Number,
  total: Number,
});

const emit = defineEmits<{
  (e: "currentChange", val): void;
}>();

function onCurrentChange(val) {
  // emit("currentChange", val);
  currentPage.value = val;
}

function setCurrent(flag) {
  if (flag) {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  } else {
    currentPage.value++;
  }
}

defineExpose({ setCurrent });
</script>

<style scoped></style>
