<!--
 * @LastEditTime: 2023-07-18 14:38:50
 * @Description: 环境标签列表
-->
<template>
  <div class="tags_main">
    <div class="tags_list_box">
      <div
        class="tag_item"
        v-for="(item, index) in tagsList"
        :key="index + uuidv4()"
      >
        <div class="type">{{ item.type }}</div>
        <div class="tags">
          <el-button
            :class="[
              'tag',
              selectTags[item.type][j].sign ? 'tag_btn_active' : '',
            ]"
            size="small"
            @click="showInput(ele, item.type, item.color, j)"
            v-for="(ele, j) in item.tags"
            :key="j"
            :color="selectTags[item.type][j].color"
            plain
          >
            {{ ele.names }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, inject, defineProps } from "vue";
import { v4 as uuidv4 } from "uuid";
import { ObserverInstance } from "@/components/draw/event/observer";
import { tagsEvents } from "@/components/draw/event/events";
const TAGS: any = inject("TAGS");
const props = defineProps(["nowContentType"]);
let observerListenerList = [
    { eventName: tagsEvents.DEL_TAGS_OVER, fn: delTag.bind(this) },
  ],
  tagsList: any = ref([
    {
      color: "",
      tags: [] as any[],
      type: "",
    },
  ]),
  selectTags: { [key: string]: any } = ref({});

watch(
  () => props.nowContentType,
  (val) => {
    if (val != "envLabel") return;
    tagsList.value = TAGS.tagsList.value;
    selectTags.value = TAGS.selectTags.value;
  }
);
// watch(
//   [() => TAGS.tagsList.value, () => TAGS.selectTags.value],
//   ([val0, val1]) => {
//     console.log(val0, val1, "val0, val1-------------tagslist");
//     tagsList.value = val0;
//     selectTags.value = val1;
//   }
// );
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_mark");

// 删除tag--tag改变颜色
function delTag(obj: { type: string; delIndex: number; tagId: number }) {
  let tagsIndex = selectTags.value[obj.type].findIndex((item: any) => {
    return item.id === obj.tagId;
  });
  selectTags.value[obj.type][tagsIndex].sign = false;
}
// 点击选择tag--tag改变颜色
function showInput(ele, type, color, j) {
  if (selectTags.value[type][j].sign) return;
  if (ele.group) {
    selectTags.value[type].forEach((item, index) => {
      if (index === j) {
        item.sign = true;
      } else {
        item.sign = false;
      }
    });
  } else {
    selectTags.value[type][j].sign = true;
  }
  TAGS.handleTags(
    {
      type: type,
      tags: [{ ...ele }],
    },
    "add"
  );
}
</script>

<style lang="scss" scoped>
.tags_main {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f1f3f4;
}
.tags_list_box {
  padding: 0 10px;
  .tag_item {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 14px;
    box-sizing: border-box;
    // border-bottom: 1px solid #dadce0;
    padding: 5px 0;
    border-radius: 4px;
    background: hsla(0, 0%, 89%, 0.9);
    margin: 5px 0;
    .type {
      flex-shrink: 0;
      width: 100px;
      height: 100%;
      padding-left: 5px;
      box-sizing: border-box;
    }
    .tags {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-right: 5px;
      box-sizing: border-box;
      .tag {
        margin: 0 5px 5px 0;
      }
      .tag_btn_active {
        background: #000;
      }
      :deep(.el-button) {
        // margin: 0;
        padding: 2px 5px;
      }
    }
  }
}
</style>
