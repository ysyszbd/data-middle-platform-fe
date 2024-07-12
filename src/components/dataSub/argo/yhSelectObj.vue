<!--
 * @LastEditTime: 2023-10-23 14:00:41
 * @Description: 
-->
<template>
  <div class="yh_select_obj">
    <div v-for="(val, key) in props.yhConfigData.yh_template" :key="key">
      <el-text>{{ yh_label[key] + " -- " }}</el-text>
      <el-select
        v-model="data[key]"
        :placeholder="`请选择${props.yhConfigData.label}`"
        @change="selectFun($event, key)"
      >
        <el-option
          v-for="ele in selectOptions"
          :key="ele.id"
          :label="ele.value"
          :value="ele.id"
        />
      </el-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, defineEmits } from "vue";
import { getProjectAllApi } from "@/axios/trainTemplateAPIs";

const props = defineProps(["yhConfigData", "dataValue", "operationType"]);
const emits = defineEmits(["inputFun"]);

watch(
  () => props.dataValue,
  (val) => {
    // console.log(val, "data=========");
    data.value = JSON.parse(val);
  }
);
watch(
  () => props.operationType,
  (val) => {
    getProjectSelect();
  }, { immediate: true }
);
const data: any = ref({}),
  yh_label = {
    index: "模板分类",
  },
  selectOptions: any = ref([]);
function selectFun(val, key) {
  data.value[key] = val;
  emits("inputFun", JSON.stringify(data.value), props.yhConfigData.name);
}
async function getProjectSelect() {
  try {
    const res: any = await getProjectAllApi({
      keyword: "job-template",
      types: ["selector"],
      relations: [],
    });
    selectOptions.value = res.list.selector;
  } catch (err) {
    console.log(err, "err---getProjectSelect");
  }
}
</script>

<style lang="scss" scoped></style>
