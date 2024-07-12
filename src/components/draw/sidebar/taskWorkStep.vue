<!--
 * @LastEditTime: 2023-06-30 10:58:12
 * @Description: 工作流节点控制组件
-->
<template>
  <div class="task_work_step">
    <el-steps
      class="step_box"
      direction="vertical"
      :active="currentStepIndex + 1"
      :title="`当前所处工作节点为 ${workInfo[currentStepIndex]?.name}`"
    >
      <el-step
        :class="[
          item.order <= workInfo[currentStepIndex]?.order
            ? 'step_success'
            : 'step_fail',
        ]"
        :title="item.name"
        v-for="(item, index) in workInfo"
        :key="uuidv4() + index"
        v-show="item.visible"
        :icon="stepIcon[item.name]?.i"
      />
    </el-steps>
    <div
      class="work_step_btn_box"
      v-if="workInfo[currentStepIndex]?.operation_action"
    >
      <div
        class="work_step_btn_item"
        v-for="(ele, index) in workInfo[currentStepIndex]?.operation_action"
        :key="uuidv4() + index"
      >
        <progressBall
          v-if="ele === 'approve'"
          :num="stepIcon[workInfo[currentStepIndex]?.name]?.n"
          :tip="stepIcon[workInfo[currentStepIndex]?.name]?.tip"
          :disabled="props.disabled"
          @click="updataTask(ele)"
        />
        <div
          v-else
          :class="[
            'work_step_btn_reject',
            'work_step_btn',
            'reject_text',
            props.disabled ? 'work_step_btn_reject_disabled' : '',
          ]"
          @click="updataTask(ele)"
        >
          拒绝通过
        </div>
      </div>
    </div>
    <div
      class="work_step_btn_box"
      v-if="workInfo[currentStepIndex]?.name === '完成'"
    >
      <progressBall :num="100" :tip="`完成`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, inject, defineEmits } from "vue";
import { v4 as uuidv4 } from "uuid";
import { useStateStore } from "@/stores/state";
import { Edit, CircleCheck, View, Aim } from "@element-plus/icons-vue";
import { updataTaskApi } from "@/axios/markResultsView";
import { progressBall } from "@/components/draw/drawComponents";

const store = useStateStore();
const WORK: any = inject("WORK");
const props = defineProps([
  "workFlowInfo",
  "currentStep",
  "activeIndex",
  "sign",
  "work_order_id",
  "disabled",
  "seat",
]);
const emits = defineEmits(["callback"]);

let stepIcon = {
    标注: { i: Edit, n: 25, tip: "提交审核" },
    审核: { i: Aim, n: 50, tip: "提交验收" },
    验收: { i: View, n: 75, tip: "提交完成" },
    完成: { i: CircleCheck, n: 100, tip: "已完成" },
  },
  workInfo: any = ref([]),
  currentStepIndex = ref(-1);
watch(
  [() => props.currentStep, () => props.activeIndex, () => props.workFlowInfo],
  ([val, activeIndexVal, workFlowInfoVal]) => {
    if (activeIndexVal == props.sign) {
      workInfo.value = getTaskWorkInfo(workFlowInfoVal);
      getCurrent(val);
    }
  },
  { immediate: true }
);
// 过滤出要显示出来的工作节点
function getTaskWorkInfo(workFlowInfo) {
  let arr: any = [];
  workFlowInfo.forEach((item) => {
    if (item.visible) {
      arr.push(item);
    }
  });
  return arr;
}
async function updataTask(operation) {
  try {
    if (props.disabled) return;
    const res = (await updataTaskApi({
      work_order_id: props.work_order_id,
      operation: operation,
      comment: `${workInfo.value[currentStepIndex.value].name}员 ${
        operation === "approve" ? "提交" : "拒绝"
      }`,
    })) as { code: number };
    if (res.code === 200) {
      let index = 0;
      if (operation === "approve") {
        index = currentStepIndex.value + 1;
      } else {
        if (workInfo.value[currentStepIndex.value].name === "验收") {
          index = 0;
        } else {
          index = currentStepIndex.value - 1;
        }
      }
      if (props.seat === "list") {
        emits("callback", workInfo.value[index].order, operation);
      } else {
        WORK.updateTaskEnd({ ...workInfo.value[index], operation: operation });
      }
    }
  } catch (err) {
    console.log(err, "updataTask--err");
  }
}
function getCurrent(currentStep) {
  const res = workInfo.value.findIndex((item) => {
    return item.order === currentStep;
  });
  currentStepIndex.value = res;
}
</script>

<style lang="scss" scoped>
.task_work_step {
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  .step_box {
    height: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    :deep(.el-step) {
      width: 66px;
    }
    .step_success {
      :deep(.el-step__title) {
        color: #409eff;
      }
      :deep(.el-step__icon) {
        svg {
          color: #409eff;
        }
      }
    }
    .step_fail {
      :deep(.el-step__title) {
        color: rgb(112, 112, 112);
      }
      :deep(.el-step__icon) {
        svg {
          color: rgb(112, 112, 112);
        }
      }
    }
    :deep(.el-step__icon) {
      border-radius: 50%;
      .el-icon {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        svg {
          width: 20px;
        }
      }
    }
  }
  .work_step_btn_box {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin-top: 50px;
    .work_step_btn_item {
      width: 104px;
      height: 104px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 20px;
    }
    .work_step_btn {
      width: 100px;
      height: 100px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .work_step_btn_reject {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 2px solid rgba(196, 86, 86, 0.8);
      background-color: rgba(250, 182, 182, 0.6);
      background-origin: border-box;
      background-clip: content-box, border-box;
      overflow: hidden;
    }
    .work_step_btn_reject:hover {
      box-shadow: 0px 2px 7px 0px #f56c6c;
    }
    .work_step_btn_reject_disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .reject_text {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      color: rgba(2, 31, 64, 1);
      z-index: 4;
    }
  }
}
</style>
