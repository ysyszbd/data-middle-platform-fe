<template>
  <div class="taskMenuBox">
    <el-menu
      :default-active="props.activeIndex"
      class="el_menu_task"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item
        :index="String(index + 1)"
        v-for="(item, index) in menu_data[props.type].menu"
        :key="index"
      >
        {{ item }}
      </el-menu-item>
    </el-menu>
    <el-button
      type="primary"
      class="add_btn_task"
      :icon="Plus"
      @click="addTask"
      v-show="menu_data[props.type].add_btn[~~props.activeIndex - 1]"
      >{{ menu_data[props.type].add_btn[~~props.activeIndex - 1] }}</el-button
    >
    <!-- v-show="props.activeIndex === '1'" -->
    <el-dropdown class="batch_btns">
      <el-button>
        批量操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in menu_data[props.type].menu_btn[
              props.activeIndex - 1
            ]"
            :key="item"
            @click="handleBatch(item)"
            >{{ "批量" + item }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { Plus } from "@element-plus/icons-vue";
import { ref, defineProps, defineEmits } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { menu_data } from "@/components/dataSub/config/configData";

const emits = defineEmits([
    "callback",
    "handleBatch",
    "openDetail",
    "tableFun",
  ]),
  props = defineProps(["activeIndex", "type"]);
async function addTask() {
  try {
    emits("tableFun", "add", null);
    // emits("openDetail", null, "新增");
  } catch (err) {
    console.log("addTask-err", err);
  }
}
// 批量按钮点击事件
function handleBatch(val) {
  const btnText = {
    Del: { text: "删除", key: "del" },
    Stop: { text: "Stop", key: "stop" },
    Copy: { text: "Copy", key: "copy" },
  };
  emits("handleBatch", btnText[val]);
}
// 菜单选择事件
function handleSelect(e) {
  emits("callback", e);
}
</script>

<style lang="scss" scoped>
.taskMenuBox {
  width: 100%;
  min-width: 1200px;
  display: flex;
  align-items: center;
  .el_menu_task {
    width: 100%;
  }
  .add_btn_task {
    min-width: 100px;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.batch_btns {
  margin-left: 10px;
}
</style>
