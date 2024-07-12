<!--
 * @LastEditTime: 2023-08-14 17:19:52
 * @Description: 
-->
<template>
  <div class="yh_input_array">
    <div :class="['yh_input_array_item']">
      <!-- <div class="input_item">
        <el-input
          v-model="argsKey"
          type="text"
          :placeholder="`请输入${props.yhConfigData.label}`"
          @input="handleInput($event, 'key')"
        />
        <div class="item_tip">##参数名</div>
      </div> -->
      <div class="input_item">
        <el-input
          v-model="argsValue"
          type="text"
          :placeholder="`请输入${props.yhConfigData.label}`"
          @input="handleInput($event, 'value')"
        />
        <div class="item_tip">##default 空格分割启动参数</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, defineEmits, toRaw } from "vue";

const props = defineProps(["yhConfigData", "dataValue"]);
const emits = defineEmits(["inputFun"]);
watch(
  () => props.dataValue,
  (val) => {
    const obj = JSON.parse(val);
    data.value = toRaw(obj.args);
    argsValue.value = data.value.args.args.default;
    console.log("data.value", toRaw(obj), argsKey.value);
  }
);
const data: any = ref(props.yhConfigData.yh_template),
  argsValue = ref(""),
  argsKey = ref("");
let timeoutId: any = null;
// let timeout: any = ref(null);
const handleInput = (val, key) => {
  // 清除之前的定时器
  clearTimeout(timeoutId);
  // 创建一个新的定时器，在延迟后执行操作
  let obj: any = {};
  timeoutId = setTimeout(() => {
    // if (key === "key") {
    //   argsKey.value = val;
    //   obj[val] = props.yhConfigData.yh_template.args.tempalte;
    // } else {
    argsValue.value = val;
    data.value.args.args.default = val;
      // obj[argsKey.value] = props.yhConfigData.yh_template.args.tempalte;
      // obj[argsKey.value].default = val;
    // }
    console.log("Input value:", obj);
    emits(
      "inputFun",
      JSON.stringify({
        args: data.value,
        // args: obj,
      }),
      props.yhConfigData.name
    );
  }, 300);
};
</script>

<style lang="scss" scoped>
.yh_input_array {
  // width: 100%;
  .yh_input_array_item {
    width: 100%;
    .input_item {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 4px;
      .el-input {
        width: 400px;
      }
      .item_tip {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
