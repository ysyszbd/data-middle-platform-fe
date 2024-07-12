<!--
 * @LastEditTime: 2023-08-01 11:17:33
 * @Description: Box3d按钮
 * 
-->
<template>
  <div class="mark_3D_box">
    <div class="mark_3D_box_text">方向:</div>
    <el-select
      v-model="direction"
      placeholder="Select"
      @change="changeDirection"
      @visible-change="selectType"
      ref="directionSelect"
      :disabled="status"
    >
      <el-option
        v-for="(item, index) in directionList"
        :key="item"
        :label="item"
        :value="index"
      />
    </el-select>
    <el-button type="primary" size="small" @click="copyPoints">
      2D填充3D
    </el-button>
    <el-button type="success" size="small" @click="handleAlign">
      对齐
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, reactive, watch, defineEmits } from "vue";
import { ObserverInstance } from "@/components/draw/event/observer";
import { useStateStore } from "@/stores/state";
import { dataEvents, drawEvents } from "@/components/draw/event/events";
import { deepClone, getTypeIndex } from "@/utils/util";

const store = useStateStore();
const props = defineProps(["index", "direction", "shapes", "Box3dIndex"]);
const emits = defineEmits(["getShapeType"]);
let directionList = reactive([
    "左",
    "左后",
    "后",
    "后右",
    "右",
    "右前",
    "前",
    "前左",
  ]),
  status = ref(false),
  direction = ref(0);
watch(
  [() => props.direction],
  ([directionVal]) => {
    direction.value = directionVal;
  },
  { immediate: true }
);
// 对齐操作
function handleAlign() {
  ObserverInstance.emit(drawEvents.POLYGON_3D_ALIGNMENT);
}
function selectType() {
  emits("getShapeType", "Box3d", true, props.index, "select");
}
// 2d填充3d
function copyPoints() {
  let shapes = deepClone(props.shapes),
    shapes2D = getTypeIndex(shapes, "Box2d"),
    shapes3D = getTypeIndex(shapes, "Box3d");
  if (shapes[shapes2D].points.length <= 0) return;
  shapes[shapes3D].points = new Array(4).fill([]);
  shapes[shapes3D].points[0] = shapes[shapes2D].points[0];
  shapes[shapes3D].points[3] = shapes[shapes2D].points[1];
  shapes[shapes3D].points[1] = [
    shapes[shapes2D].points[0][0],
    shapes[shapes2D].points[1][1],
  ];
  shapes[shapes3D].points[2] = [
    shapes[shapes2D].points[1][0],
    shapes[shapes2D].points[0][1],
  ];
  // 判断3d方向是1个还是2个，如果是2个自动将方向修改为1个
  let direction = props.direction,
    obj: any = {
      shapes: shapes,
    };
  if (direction % 2 != 0) {
    direction = direction - 1;
    obj = {
      ...obj,
      direction: direction,
    };
  }
  ObserverInstance.emit(dataEvents.EDIT_CHANGE_DATA, {
    data: obj,
    objectIndex: props.index,
    sign: "Box3d",
  });
  store.setDrawDomRefresh(1);
}
// 修改方向
function changeDirection(val) {
  let oldDirection = props.direction % 2,
    newDirection = val % 2;

  if (oldDirection === newDirection) {
    ObserverInstance.emit(dataEvents.EDIT_CHANGE_DATA, {
      data: {
        direction: val,
      },
      objectIndex: props.index,
      sign: "Box3d",
    });
    store.setDrawDomRefresh(1);
  } else {
    ObserverInstance.emit(drawEvents.POLYGON_3D_CHANGR_DIRECTION, val);
  }
}
</script>

<style lang="scss" scoped>
.mark_3D_box {
  display: flex;
  align-items: center;
  .mark_3D_box_text {
    margin-left: 15px;
  }
  :deep(.el-button) {
    margin-left: 10px;
  }
  :deep(.el-select) {
    width: 80px;
    margin-left: 10px;
  }
}
</style>
