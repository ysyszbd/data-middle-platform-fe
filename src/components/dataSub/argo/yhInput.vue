<!--
 * @LastEditTime: 2023-10-19 10:04:16
 * @Description: 
-->
<template>
  <div class="yh_input">
    <el-input
      v-model="inputValue"
      :type="props.yhConfigData.yh_in_type"
      :placeholder="`请输入${props.yhConfigData.label}`"
      :minlength="handleLength(props.yhConfigData?.validators).min"
      :maxlength="handleLength(props.yhConfigData?.validators).max"
      :disabled="
        props.yhConfigData?.disabled ? props.yhConfigData?.disabled : false
      "
      @input="
        handleInput(
          $event,
          props.yhConfigData.name,
          props.yhConfigData.yh_out_type
        )
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, defineEmits } from "vue";
import { handleLength } from "@/utils/taskUtil";

const props = defineProps(["yhConfigData", "inputValue"]);
const emits = defineEmits(["inputFun"]);
watch(
  () => props.inputValue,
  (val) => {
    console.log(val, "valpppppppppp");
    
    inputValue.value = handleValue(val, props.yhConfigData.yh_input);
  }
);
const inputValue = ref(props.yhConfigData.default);
function handleInput(val, key, type) {
  emits("inputFun", handleValue(val, type), key);
}
function handleValue(val, type) {
  try {
    if (type === "number") {
      return Number(val);
    } else if (type === "string") {
      return String(val);
    } else {
      return val;
    }
  } catch (err) {
    console.log(err, "err");
  }
}
</script>

<style lang="scss" scoped></style>
