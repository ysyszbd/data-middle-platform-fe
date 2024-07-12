<template>
  <div class="mark-root">
    <div ref="myRef" class="mark-slider">
      <el-popover
        v-for="(item, index) in datas.data"
        :key="index"
        ref="popover"
        :title="eventTagStore.tagId2NameMap.get(item.tag_id)"
        trigger="contextmenu"
      >
        <template #reference>
          <div
            class="mark"
            :style="{
              left: getLeftPosition(item, datas.details) + '%',
              width: getPercent(item, datas.details) + '%',
              top: (index % 2) * 10 + 'px',
            }"
          >
            <div
              class="point-div"
              :class="{
                pointdivdragging: dragging,
              }"
              :style="{
                backgroundColor: randomRgb(index),
              }"
              @mousedown="mouseLeftDown($event, index)"
            ></div>
            <div
              class="center-div"
              :class="{
                dragging: dragging,
                hover: !dragging,
                centerdivdragging: index == currentDragIndex,
              }"
              :style="{
                backgroundColor: randomRgb(index),
              }"
              @mousedown="mouseDown($event, index)"
            >
              <span
                style="
                  position: absolute;
                  display: inline-block;
                  margin-top: -3px;
                "
                >{{ eventTagStore.tagId2NameMap.get(item.tag_id) }}</span
              >
            </div>
            <div
              class="point-div"
              :class="{
                pointdivdragging: dragging,
              }"
              :style="{
                backgroundColor: randomRgb(index),
              }"
              @mousedown="mouseRightDown($event, index)"
            ></div>
          </div>
        </template>
        <el-button type="danger" @click="deleteSelect(item.id, index)"
          >删除</el-button
        >
      </el-popover>
    </div>
    <div class="mark-type">
      {{ datas.type }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { deleteRow } from "@/utils/axios";
import { eventTagStore } from "@/stores/store";
import { updateIdParameter } from "@/utils/axios";
import { randomRgb } from "@/utils/util";
import dayjs from "dayjs";
import { timelinetag_delete, timelinetag_update } from "@/utils/urlset";
const dragging = ref(false);
const myRef = ref<HTMLElement>();

//点击元素X坐标
const currentclientX = ref(0);
//移动元素的ID
const currentMveId = ref("0");

const currentDragIndex = ref(-1);

let max = 0;

const props = defineProps<{
  datas: any;
}>();

function mouseDown(event, index) {
  if (event.button != 0) {
    return;
  }

  dragging.value = true;
  currentDragIndex.value = index;
  currentMveId.value = index;
  currentclientX.value = event.x;
  // console.log("mouseDown", index);

  document.onmousemove = (event) => {
    if (dragging.value) {
      let moveOffset = event.x - currentclientX.value;
      currentclientX.value = event.x;

      let moveTime = (moveOffset * max) / myRef.value!.clientWidth;

      let itemData = props.datas.data[currentMveId.value];

      if (
        itemData.a_time - props.datas.details.start_time + moveTime >= 0 &&
        itemData.b_time - props.datas.details.end_time + moveTime <= 0
      ) {
        itemData.a_time = setItemTime(
          props.datas.data[currentMveId.value].a_time,
          moveTime
        );
        itemData.b_time = setItemTime(
          props.datas.data[currentMveId.value].b_time,
          moveTime
        );
      }

      event.preventDefault();
    }
  };
  document.onmouseup = () => {
    dragging.value = false;
    currentDragIndex.value = -1;
    // console.log("mouseUp");
    document.onmousemove = null;
    document.onmouseup = null;
    updateTagInfo(props.datas.data[currentMveId.value]);
  };
}

function mouseLeftDown(event, index) {
  if (event.button != 0) {
    return;
  }

  dragging.value = true;
  currentMveId.value = index;
  currentclientX.value = event.x;
  // console.log("mouseDown", index);

  document.onmousemove = (event) => {
    if (dragging.value) {
      let moveOffset = event.x - currentclientX.value;
      currentclientX.value = event.x;

      let moveTime = (moveOffset * max) / myRef.value!.clientWidth;

      let itemData = props.datas.data[currentMveId.value];

      if (
        itemData.a_time - props.datas.details.start_time + moveTime >= 0 &&
        itemData.a_time - itemData.b_time + moveTime <= 0
      ) {
        itemData.a_time = setItemTime(
          props.datas.data[currentMveId.value].a_time,
          moveTime
        );
      }

      event.preventDefault();
    }
  };
  document.onmouseup = () => {
    dragging.value = false;
    // console.log("mouseUp");
    document.onmousemove = null;
    document.onmouseup = null;
    updateTagInfo(props.datas.data[currentMveId.value]);
  };
}

function mouseRightDown(event, index) {
  if (event.button != 0) {
    return;
  }

  dragging.value = true;
  currentMveId.value = index;
  currentclientX.value = event.x;
  // console.log("mouseDown", index);

  document.onmousemove = (event) => {
    if (dragging.value) {
      let moveOffset = event.x - currentclientX.value;
      currentclientX.value = event.x;

      let moveTime = (moveOffset * max) / myRef.value!.clientWidth;

      let itemData = props.datas.data[currentMveId.value];

      if (
        itemData.b_time - props.datas.details.end_time + moveTime <= 0 &&
        itemData.b_time - itemData.a_time + moveTime >= 0
      ) {
        itemData.b_time = setItemTime(
          props.datas.data[currentMveId.value].b_time,
          moveTime
        );
      }

      event.preventDefault();
    }
  };
  document.onmouseup = () => {
    dragging.value = false;
    // console.log("mouseUp");
    document.onmousemove = null;
    document.onmouseup = null;
    updateTagInfo(props.datas.data[currentMveId.value]);
  };
}

function updateTagInfo(data) {
  data.a_time = Math.floor(data.a_time);
  data.b_time = Math.floor(data.b_time);
  updateIdParameter(timelinetag_update, data, () => {
    // ElMessage.success("更新成功.");
  });
}

function setItemTime(time, duration) {
  let date = time + duration;
  // console.log(time, date);

  return date;
}

function getLeftPosition(item, videoData) {
  let parentDuration = videoData.end_time - videoData.start_time;

  max = parentDuration;

  let letfPercent = item.a_time - videoData.start_time;
  // console.log(item.id, (letfPercent * 100) / parentDuration);

  return (letfPercent * 100) / parentDuration;
}

function getPercent(item, videoData) {
  let parentDuration = videoData.end_time - videoData.start_time;

  let percent = item.b_time - item.a_time;
  // console.log(item.id, (percent * 100) / parentDuration);
  return (percent * 100) / parentDuration;
}

function deleteSelect(id, index) {
  deleteRow(timelinetag_delete, { id: id }, () => {
    let itemDatas = props.datas.data;
    itemDatas.splice(index, 1);
  });
}
</script>

<style scoped>
.mark-root {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 22px;
}
.mark-slider {
  position: relative;
  width: calc(100% - 112px);
  height: 18px;
  display: flex;
  align-items: center;
  background-color: #e4e7ed;
}
.mark-type {
  width: 112px;
}
.mark {
  position: absolute;
  height: 8px;
  display: flex;
  align-items: center;
}
.hover {
  cursor: grab;
}
.dragging {
  cursor: grabbing;
}
.point-div {
  width: 6px;
  height: 6px;
  border-radius: 3px;
}
.point-div:hover {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  cursor: ew-resize;
}
.center-div {
  width: calc(100% - 12px);
  height: 4px;
  font-size: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.centerdivdragging {
  width: calc(100% - 6px);
  margin-left: -3px;
  margin-right: -3px;
  height: 6px !important;
}
.pointdivdragging {
  cursor: ew-resize !important;
}
</style>
