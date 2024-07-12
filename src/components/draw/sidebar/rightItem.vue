<template>
  <div
    :class="[
      'right_item_box',
      props.nowObjectIndex === props.index ? 'right_item_box_active' : '',
    ]"
  >
    <div class="list_item_show">
      <span class="type_line_list_item_index">{{ props.index + ". " }}</span>
      <el-select
        class="category_box"
        v-model="props.item.category"
        v-if="props.contentType !== 'laneline'"
        placeholder="Select"
        @change="changeCategory($event, props.item, index)"
        @visible-change="selectItem(props.index)"
        :disabled="props.currentStep == 7"
      >
        <el-option
          v-for="item in setData[props.contentType].objects"
          :key="item.category"
          :label="item.category"
          :value="item.category"
        />
      </el-select>
      <el-input
        class="category_box"
        v-model="lanelineType"
        v-else
        disabled
        placeholder=""
      />
      <!-- 展示该实例对象下有哪些形状可操作 -->
      <div class="set_shapes_types_box">
        <div
          v-for="(ele, i) in props.item?.shapes ||
          setData[props.contentType].objects[0]?.shape_types"
          :key="i + '_' + ele.type || ele"
          class="list_item_box"
        >
          {{ ele.type || ele }}
          <CircleClose
            class="shape_icon"
            v-if="handleIcon(props.item, ele.type || ele)"
          />
          <CircleCheckFilled v-else class="shape_icon" />
        </div>
      </div>
      <el-dropdown class="handle_btn" v-if="props.currentStep != 7">
        <el-button type="primary" round size="small">
          操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @mousedown.stop="refreshObject(index)">
              <Refresh color="#E6A23C" width="1em" class="dropdown_icon" />重绘
            </el-dropdown-item>
            <el-dropdown-item @mousedown.stop="delObject(index)">
              <Delete color="#F56C6C" width="1em" class="dropdown_icon" />删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div
      :class="['list_item_handle_box']"
      v-show="props.nowObjectIndex === props.index"
    >
      <div
        class="list_item_handle"
        v-if="
          props.contentType === 'typeLine' || props.contentType === 'laneline'
        "
      >
        <el-radio
          :label="item.objectType"
          v-model="chooseShapeTypes"
          @click.stop="getShapeType(item.objectType)"
          class="list_item_handle_radio"
        >
          {{ item.objectType }}
          <typeLine
            v-if="item.objectType === 'typeLine'"
            :pointsIndex="props.pointIndex"
            :nowObjectData="props.nowObjectData"
            :points="props.item?.points || []"
            :index="index"
          />
          <Curve
            v-if="item.objectType === 'Curve'"
            :curvePointIndex="props.curvePointData?.pointsIndex"
            :index="index"
            :points="props.item?.points || []"
          />
        </el-radio>
      </div>
      <div
        class="list_item_handle"
        v-if="
          props.contentType !== 'typeLine' && props.contentType !== 'laneline'
        "
      >
        <el-radio
          :label="e.type"
          v-model="chooseShapeTypes"
          @click.stop="getShapeType(e.type)"
          v-for="(e, j) in props.item.shapes"
          :key="j"
          class="list_item_handle_radio"
        >
          {{ e.type }}
          <el-button
            type="primary"
            class="mark_2D"
            v-if="!props.item.shapes[j].points.length"
            size="small"
            @click.stop="add(index, e.type)"
          >
            新建
          </el-button>
          <Box3d
            v-if="e.type === 'Box3d'"
            :direction="props.item?.direction"
            :shapes="props.item?.shapes"
            :index="props.index"
            :Box3dIndex="j"
            @getShapeType="getShapeType"
          />
        </el-radio>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  typeLine,
  Box3d,
  Box2d,
  Curve,
} from "@/components/draw/drawComponents";
import {
  defineProps,
  ref,
  defineEmits,
  watch,
  inject,
  defineExpose,
} from "vue";
import { useStateStore } from "@/stores/state";
import {
  Delete,
  Refresh,
  ArrowDown,
  CircleClose,
  CircleCheckFilled,
} from "@element-plus/icons-vue";
import setData from "@/components/draw/setting.json";
import { ObserverInstance } from "@/components/draw/event/observer";
import { drawEvents, dataEvents } from "@/components/draw/event/events";
import { handleShapeTypes, getTypeIndex, deepClone } from "@/utils/util";
const store = useStateStore();
const props = defineProps([
  "item",
  "index",
  "nowObjectIndex",
  "pointIndex",
  "nowObjectData",
  "curvePointData",
  "contentType",
  "currentStep",
]);
const emits = defineEmits(["handleCurrentChange"]);
const HANDLE_DIALOG = inject("HANDLE_DIALOG") as {
  openRefreshDialog: any;
  handleDelDialog: any;
};
let chooseShapeTypes = ref(),
  lanelineType = ref(""),
  observerListenerList = [
    {
      eventName: drawEvents.SHORTCUT_KEYS_NEXT_SHAPE,
      fn: nextShape.bind(this),
    },
  ];
defineExpose({
  chooseShapeTypes,
  getShapeType,
});
// 判断是否切换了当前选择的实例对象，如果切换了，则默认选择实例对象第一个图形类型
watch(
  () => props.nowObjectIndex,
  (val) => {
    if (val < 0 || val != props.index) return;
    console.log(val, "val----nowObjectIndex", store.getTaskItemIndex);
    if (val !== store.getTaskItemIndex) {
      offListener();
      store.setTaskItemIndex(val);
      if (props.item?.shapes) {
        const index = props.item?.shapes.findIndex((item) => {
          return item.type === store.getOperationShape;
        });
        chooseShapeTypes.value =
          index < 0 ? props.item?.shapes[0]?.type : store.getOperationShape;
      } else {
        chooseShapeTypes.value = props.item?.objectType;
      }
      sendType();
      addListener();
    }
  },
  { immediate: true }
);
watch(
  () => props.item,
  (val) => {
    if (
      props.contentType !== "laneline" ||
      val.shapes ||
      val?.category != "车道线"
    )
      return;
    let type;
    if (val?.properties?.length > 3) {
      type = val.properties[2][0];
    } else if (val?.properties?.length === 0) {
      type = -1;
    } else {
      type = val?.properties[val?.properties?.length - 1][0];
    }
    if (type >= 0) {
      lanelineType.value = setData["laneline"].objects[0].type[type].name;
    } else {
      lanelineType.value = "";
    }
  },
  { immediate: true }
);
function addListener() {
  ObserverInstance.selfAddListenerList(
    observerListenerList,
    `yh_object_item${props.index}`
  );
}
function offListener() {
  ObserverInstance.selfOffListenerList(
    observerListenerList,
    `yh_object_item${props.index}`
  );
}
// 快捷键选择下一个图像
function nextShape() {
  if (
    props.nowObjectIndex < 0 ||
    handleShapeTypes(props.item.category, setData[props.contentType].objects)
      .shape_types.length <= 1 ||
    props.item?.shapes?.length === 0
  )
    return;
  let shapesIndex = getTypeIndex(props.item.shapes, chooseShapeTypes.value);
  if (shapesIndex < props.item.shapes.length - 1) {
    chooseShapeTypes.value = props.item.shapes[shapesIndex + 1].type;
  } else {
    chooseShapeTypes.value = props.item.shapes[0].type;
  }
  sendType();
}
function add(index: number, type: string) {
  console.log(type, index, "type, index,type, index,type, index,");

  if (chooseShapeTypes.value !== type) {
    getShapeType(type);
  }
  ObserverInstance.emit(drawEvents.NOW_TYPE, type, index, "add");
  ObserverInstance.emit(drawEvents.ADD_NEW_SIGN, type, index);
}
function selectItem(index) {
  emits("handleCurrentChange", index, null);
}
async function handleObject(objectIndex) {
  return new Promise((resolve, reject) => {
    if (objectIndex === props.nowObjectIndex) {
      resolve("完成");
    } else {
      emits("handleCurrentChange", objectIndex, null);
      resolve("重现选定对象完成");
    }
  });
}
// 重绘---清空形状坐标数据
async function refreshObject(objectIndex: number) {
  await handleObject(objectIndex);
  if (!props.item?.shapes && props.item?.points.length === 0) return;
  if (props.item?.shapes) {
    const shapesIndex = getTypeIndex(props.item.shapes, chooseShapeTypes.value);
    if (props.item.shapes[shapesIndex]?.points.length === 0) return;
  }

  if (objectIndex !== props.nowObjectIndex)
    chooseShapeTypes.value = props.item?.shapes
      ? props.item.shapes[0].type
      : props.item.objectType;
  HANDLE_DIALOG.openRefreshDialog({
    type: chooseShapeTypes.value,
    operationSign: "edit",
  });
}
// 删除对象--需弹窗确定
function delObject(objectIndex: number) {
  HANDLE_DIALOG.handleDelDialog(true, {
    type: "typeLine",
    operationSign: "edit",
    objectIndex: objectIndex,
  });
}
function getShapeType(val) {
  console.log(val, "valllllllllllllllllll", props.index);

  if (props.nowObjectIndex !== props.index) return;
  chooseShapeTypes.value = val;
  sendType();
}
function sendType() {
  ObserverInstance.emit(
    drawEvents.NOW_TYPE,
    chooseShapeTypes.value,
    props.nowObjectIndex,
    "getShapeType---sendType"
  );
}
// 对象名称选择事件
function changeCategory(e, item, index) {
  try {
    // if (e === props.item?.category) return;
    let data = deepClone(item),
      delId: string[] = [],
      addId: string[] = [],
      directionObj = {},
      settingData = handleShapeTypes(e, setData[props.contentType].objects);

    // 删掉当前对象中没有的形状数据
    data.shapes.forEach((item, index) => {
      const res = settingData.shape_types.find((ele) => {
        return ele === item.type;
      });
      if (!res) {
        delId.push(item.type);
        data.shapes.splice(index, 1);
      }
    });
    // 新增没有的形状数据
    settingData.shape_types.forEach((item) => {
      const res = data.shapes.find((ele) => {
        return ele.type === item;
      });
      if (!res) {
        addId.push(item);
        data.shapes.push({
          points: [],
          type: item,
        });
      }
    });
    if (addId.length > 0 || delId.length > 0) {
      const Box3d = addId.find((item) => {
        return item === "Box3d";
      });
      store.setDrawDomRefresh(1);
      if (Box3d) {
        directionObj = {
          direction: 0,
        };
      }
    }
    getShapeType(data.shapes[0].type);
    ObserverInstance.emit(
      dataEvents.CHANGE_OBJECT_SETTING_DATA,
      handleShapeTypes(data.category, setData[props.contentType].objects),
      item,
      props.contentType === "typeLine" || props.contentType === "laneline"
        ? false
        : true
    );
    ObserverInstance.emit(dataEvents.EDIT_CHANGE_DATA, {
      data: {
        category: e,
        shapes: data.shapes,
        tags: [],
        ...directionObj,
      },
      objectIndex: index,
      sign: "none",
    });
  } catch (err) {
    console.log(err, "err----对象名称选择事件");
  }
}
function handleIcon(item, type) {
  if (item?.category === "Curve" || item?.category === "车道线") {
    if (item?.points.length > 0) {
      return false;
    } else {
      return true;
    }
  }
  if (item?.objectType === "typeLine") {
    if (item?.points.length > 0) {
      return false;
    } else {
      return true;
    }
  } else {
    if (item?.shapes[getTypeIndex(item.shapes, type)]?.points.length === 0) {
      return true;
    } else {
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
.right_item_box {
  width: 95%;
  padding: 10px 5px;
  box-sizing: border-box;
  // border-bottom: 1px solid #dadce0;
  position: relative;
  margin: 4px 0;
  border-radius: 4px;
  color: rgb(112, 112, 112);
  background: rgb(228, 228, 228);
}
.right_item_box_active {
  background: rgb(228, 228, 228);
  position: relative;
}
.right_item_box_active::after {
  position: absolute;
  content: "";
  width: 2px;
  height: 100%;
  background: #f56c6c;
  left: 0;
  top: 0;
  border-radius: 100px 0 0 100px;
}
.list_item_show {
  width: 100%;
  display: flex;
  align-items: center;
  .type_line_list_item_index {
    display: inline-block;
    text-align: center;
    flex-shrink: 0;
    font-size: 14px;
    margin-right: 8px;
    max-width: 13px;
    font-weight: 500;
  }

  .type_line_list_item_title {
    flex-shrink: 0;
    padding-right: 5px;
    font-size: 14px;
    width: 70px;
    margin-right: 8px;
  }
  .category_box {
    width: 150px;
    flex-shrink: 0;
  }
  .set_shapes_types_box {
    display: flex;
    align-items: center;
    // flex-direction: column;
    padding: 0 5px;
    // width: 100%;
    justify-content: space-between;
    .list_item_box {
      // width: 80px;
      flex-shrink: 0;
      box-sizing: border-box;
      font-size: 10px;
      // color: #666;
      display: flex;
      align-items: center;
      margin-right: 5px;
      .shape_icon {
        width: 18px;
        padding-left: 2px;
      }
    }
  }
  .handle_btn {
    width: 60px;
    position: absolute;
    right: 10px;
  }
}
.list_item_handle_box {
  border-top: 1px solid rgb(218, 220, 224, 0.9);
  margin-top: 10px;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
  width: 100%;
  .list_item_handle {
    width: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    .list_item_handle_radio {
      width: 100%;
      .mark_2D {
        padding: 0 10px;
        box-sizing: border-box;
        margin: 0 10px;
      }
      :deep(.el-radio-group) {
        width: 100%;
        display: flex;
        flex-direction: column;
        .el-radio {
          width: 100%;
          display: block;
        }
      }
      :deep(.el-radio__label) {
        width: 100%;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
