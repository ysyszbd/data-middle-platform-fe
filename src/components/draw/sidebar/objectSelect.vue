<!--
 * @LastEditTime: 2023-07-18 14:35:05
 * @Description: 控制面板--用于展示实例对象的属性选择；环境标签时用于展示已选择了的环境标签
 * 
-->
<template>
  <facePlateBox
    :class="[
      'object_select_box',
      `object_select_box_${props.nowContentType}`,
      store.getTaskMove.left ? 'box_float' : 'box_fix',
    ]"
    id="selectBox"
    DOMid="selectBox"
    :name="props.nowContentType !== 'envLabel' ? '属性管理' : '标签（已选）'"
    :title="
      props.nowContentType !== 'envLabel' ? '属性管理面板' : '标签管理面板'
    "
    plateSign="left"
    showSign="attributeSign"
  >
    <div class="attribute_box" v-if="props.nowContentType !== 'envLabel'">
      <div class="object_select_box_list">
        <div
          class="object_select_box_list_item"
          v-for="(item, index) in settingObj?.attribute"
          :key="index"
        >
          <div class="object_select_box_list_item_title">{{ item.name }}:</div>
          <el-select
            v-model="nowObject[item.key]"
            placeholder="请选择"
            clearable
            v-show="!item.operation_type || item.operation_type != 'input'"
          >
            <el-option
              v-for="ele in item.options"
              @click="changeAttr(item.key, ele)"
              :key="ele"
              :label="ele"
              :value="ele"
            />
          </el-select>
          <el-input
            v-show="item.operation_type == 'input'"
            v-model="nowObject[item.key]"
            placeholder="请输入"
            clearable
            @input="inputFun"
          />
        </div>
      </div>
      <div
        class="select_line"
        v-show="
          settingObj?.attribute?.length > 0 && settingObj?.tags?.length > 0
        "
      ></div>
      <div class="tags_box" v-show="settingObj?.tags?.length > 0">
        <el-checkbox-group v-model="nowData.tags">
          <el-checkbox
            :label="item"
            v-for="(item, index) in settingObj?.tags"
            :key="index"
          />
        </el-checkbox-group>
      </div>
    </div>
    <div class="tags_list_box" v-if="props.nowContentType === 'envLabel'">
      <div
        class="tags_list_item"
        v-for="item in props.tagsList"
        :key="item.type"
      >
        <div class="tags_list_item_type">{{ item.type }}</div>
        <div class="tags_list_item_tags">
          <el-button
            class="tags_list_item_tags_btn"
            size="small"
            v-for="(tag, j) in item.tags"
            :key="j + tag.id"
            type="primary"
            plain
            @click="delTag(item.type, j, tag.id)"
          >
            {{ tag.names }}
            <CircleCloseFilled class="tags_list_item_tags_icon" width="15" />
          </el-button>
        </div>
      </div>
      <emptyBox v-show="props.tagsList.length <= 0" :text="`暂无已选标签~`" />
    </div>
  </facePlateBox>
</template>

<script lang="ts" setup>
import { CircleCloseFilled } from "@element-plus/icons-vue";
import { ref, defineProps, inject, defineExpose } from "vue";
import { useStateStore } from "@/stores/state";
import { ObserverInstance } from "@/components/draw/event/observer";
import { dataEvents, tagsEvents } from "@/components/draw/event/events";
import {
  yhIcon,
  facePlateBox,
  emptyBox,
} from "@/components/draw/drawComponents";

const store = useStateStore();
const props = defineProps(["tagsList", "nowContentType"]);
const TAGS: any = inject("TAGS");
let observerListenerList = [
    {
      eventName: dataEvents.CHANGE_OBJECT_SETTING_DATA,
      fn: getSettingObj.bind(this),
    },
  ],
  settingObj: any = ref({
    attribute: [],
    tags: [],
  }),
  nowData = ref({
    tags: [],
  }),
  nowObject: any = ref(),
  showSign = ref(false);
defineExpose({
  init,
});
ObserverInstance.selfAddListenerList(observerListenerList, "yh_svg_mark");
function init() {
  settingObj.value = {
    attribute: [],
    tags: [],
  };
  nowData.value = {
    tags: [],
  };
  nowObject.value = {};
  showSign.value = false;
}
function delTag(type, tagsIndex, tagId) {
  let obj = {
    type: type,
    delIndex: tagsIndex,
    tagId: tagId,
  };
  TAGS.handleTags(obj, "del");
  ObserverInstance.emit(tagsEvents.DEL_TAGS_OVER, obj);
}
function getSettingObj(obj, data, sign) {
  if (obj.attribute === undefined && obj?.tags?.length === 0) {
    showSign.value = false;
    // return;
  } else {
    showSign.value = true;
  }
  if (!sign) {
    showSign.value = sign;
    return;
  }
  settingObj.value = obj;
  nowData.value = data;
  nowObject.value = getKey(obj.attribute, data);
}
function getKey(attribute, data) {
  let obj = {};
  attribute?.find((item) => {
    obj[item.key] = "";
  });

  for (let k in obj) {
    obj[k] = data[k] || "";
  }
  return obj;
}
function inputFun(val) {
  console.log(val, "VAL");
  ObserverInstance.emit(dataEvents.EDIT_CHANGE_DATA, {
    data: nowObject.value,
    sign: "none",
  });
}
function changeAttr(attrName: string, str: string) {
  nowObject.value[attrName] = str;
  ObserverInstance.emit(dataEvents.EDIT_CHANGE_DATA, {
    data: nowObject.value,
    sign: "none",
  });
}
</script>

<style lang="scss" scoped>
.object_select_box_envLabel {
  width: 400px !important;
  transform: translate3d(0, 0, 1px);
}
.object_select_box {
  width: 400px;
  // height: calc(100% - 80px);
  position: absolute;
  z-index: 500;
  top: 10px;
  left: 72px;
  transform: translate3d(0, 0, 1px);
  background: #f1f3f4;
  overflow: hidden;
  
  color: rgb(112, 112, 112);
  .attribute_box {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
  }
  .object_select_box_list_item {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .object_select_box_list_item_title {
      font-size: 14px;
      flex-shrink: 0;
      width: 80px;
    }
  }
  .tags_list_box {
    width: 100%;
    padding: 10px 10px 20px 10px;
    box-sizing: border-box;
    .tags_list_item {
      width: 100%;
      padding: 5px 0;
      display: flex;
      align-items: center;
      background: hsla(0, 0%, 89%, 0.9);
      border-radius: 4px;
      margin: 6px 0;
      padding: 5px;
      box-sizing: border-box;
      .tags_list_item_type {
        width: 94px;
        font-size: 14px;
        flex-shrink: 0;
      }
      .tags_list_item_tags {
        .tags_list_item_tags_btn {
          padding: 3px 4px;
          .tags_list_item_tags_icon {
            margin-left: 3px;
          }
        }
      }
    }
    .tags_list_item:last-child {
      border-bottom: none;
    }
  }
}
.box_float {
  border-radius: 8px;
  box-shadow: 0 0 1em rgb(112 112 112);
}
.box_fix {
  height: 100%;
  width: 400px;
  top: 0;
  background: rgba(37, 38, 39);
  border-radius: 0 8px 8px 0 !important;
  color: #fff;
  .tags_list_box {
    .tags_list_item {
      background: hsla(0, 0%, 100%, 0.07);
    }
  }
}
.select_line {
  width: 100%;
  height: 0;
  border-top: 1px solid rgba(153, 153, 153, 0.5);
  margin: 5px 0;
}
</style>
