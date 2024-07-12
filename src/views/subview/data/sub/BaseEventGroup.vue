<template>
  <span style="display: inline-block; text-align: right; width: 112px"
    >{{ item.type }}：
  </span>
  <el-checkbox
    v-model="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
    style="margin-right: 10px"
    >全选</el-checkbox
  >
  <el-button
    style="margin-right: 10px"
    type="primary"
    size="small"
    @click="invertCheckedChange"
  >
    反选
  </el-button>
  <el-checkbox-group v-model="checked" @change="handleCheckedChange">
    <el-checkbox
      v-for="childItem in item.tags"
      :key="childItem.id"
      :label="childItem.id"
      size="small"
    >
      {{ childItem.names }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  item: any;
}>();

const checkAll = ref(false);
const isIndeterminate = ref(false);
const groupTags = () => {
  const array: any = [];
  props.item.tags.forEach((item: any) => {
    array.push(item.id);
  });
  return array;
};

const checked = ref();

const emit = defineEmits<{
  (e: "tagsChanged", type, value): void;
}>();

function invertCheckedChange() {
  const array: any = [];
  groupTags().forEach((item: any) => {
    if (!checked.value.includes(item)) {
      array.push(item);
    }
  });
  checked.value = array;
  const checkedCount = array.length;
  checkAll.value = checkedCount === groupTags().length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < groupTags().length;
  emit("tagsChanged", props.item.type, checked.value);
}

function handleCheckedChange(value) {
  // console.log(value);

  const checkedCount = value.length;
  checkAll.value = checkedCount === groupTags().length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < groupTags().length;
  emit("tagsChanged", props.item.type, checked.value);
}

const handleCheckAllChange = (val) => {
  checked.value = val ? groupTags() : [];
  isIndeterminate.value = false;
  emit("tagsChanged", props.item.type, checked.value);
};
</script>

<style scoped>
.el-checkbox {
  margin-right: 10px;
}
</style>
