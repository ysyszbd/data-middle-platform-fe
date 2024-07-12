<!--
 * @LastEditTime: 2023-07-18 17:46:07
 * @Description: 控制面板的开关列表
-->
<template>
  <div
    class="label_list"
    title="已固定了的控制面板，一次只能显示一个，未固定的则不影响"
  >
    <div
      v-show="props.nowContentType !== 'envLabel'"
      :class="['label_item', props.facePlate.workSign ? 'item_active' : '']"
      @click="handleSign('workSign', props.facePlate.workSign)"
    >
      <img class="icon work_icon" src="@/assets/image/work_icon.svg" alt="" />
      工作流
    </div>
    <div
      v-show="
        props.nowContentType === 'laneline' || props.nowContentType === 'tool2'
      "
      :class="['label_item', props.facePlate.groupSign ? 'item_active' : '']"
      @click="handleSign('groupSign', props.facePlate.groupSign)"
    >
      <img
        v-if="props.nowContentType === 'laneline'"
        class="icon road_icon"
        src="@/assets/image/task_road.svg"
        alt=""
      />
      <img
        v-else
        class="icon road_icon"
        src="@/assets/image/task_stopcar_icon.svg"
        alt=""
      />
      {{ props.nowContentType === "laneline" ? "道路列表" : "车位列表" }}
    </div>
    <div
      :class="['label_item', props.facePlate.objectSign ? 'item_active' : '']"
      @click="handleSign('objectSign', props.facePlate.objectSign)"
    >
      <img
        class="icon object_icon"
        src="@/assets/image/task_object_icon.svg"
        alt=""
      />
      对象列表
    </div>
    <div
      v-show="
        props.nowContentType !== 'laneline' &&
        props.nowContentType !== 'typeLine'
      "
      :class="[
        'label_item',
        props.facePlate.attributeSign ? 'item_active' : '',
      ]"
      @click="handleSign('attributeSign', props.facePlate.attributeSign)"
    >
      <img
        class="icon object_icon"
        src="@/assets/image/label_icon.svg"
        alt=""
      />
      属性列表
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps } from "vue";
const props = defineProps(["facePlate", "nowContentType"]);
const emits = defineEmits(["handleFacePlate"]);

function handleSign(sign, value) {
  emits("handleFacePlate", sign, !value);
}
</script>

<style lang="scss" scoped>
.label_list {
  height: 100%;
  width: 72px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 40;
  background: #18191b;
  .label_item {
    width: 100%;
    height: 72px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.6);
    box-sizing: border-box;
    white-space: nowrap;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    outline-offset: -2px;
    -webkit-tap-highlight-color: transparent;
    .icon {
      margin-bottom: 4px;
    }
    .road_icon {
      width: 24px;
    }
    .object_icon {
      width: 24px;
    }
    .work_icon {
      width: 28px;
    }
  }
  .label_item:hover {
    background: hsla(0, 0%, 100%, 0.1);
    color: #fff;
  }
  .item_active {
    color: #fff;
    background: rgba(37, 38, 39);
  }
}
</style>
