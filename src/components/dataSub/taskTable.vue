<template>
  <div class="my_page">
    <el-table
      ref="multipleTableRef"
      :data="props.data"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :scrollbar-always-on="true"
      width="100%"
      v-loading="props.loading"
      :fit="true"
      :element-loading-text="props.loadingText || 'Loading...'"
    >
      <el-table-column type="selection" width="25" v-if="true" />
      <el-table-column
        v-for="item in props.listColunms"
        :key="item"
        :property="item"
        :label="labelColumns[item]"
        header-align="center"
        align="center"
        :width="props.colsWidth[item] ? props.colsWidth[item]?.width : null"
      >
        <template
          #default="scope"
          v-if="props.activeIndex === '3' && item === 'log'"
        >
          <el-button type="primary" text>日志</el-button>
        </template>
        <template
          #default="scope"
          v-if="props.activeIndex === '3' && item === 'stop'"
        >
          <el-button type="primary" link @click="taskExampleFun(scope.row)">
            停止
          </el-button>
        </template>
        <template #default="scope">
          <div v-html="scope.row[item]"></div>
        </template>
        <template
          #default="scope"
          v-if="props.activeIndex === '1' && item === 'debug'"
        >
          <el-button
            type="primary"
            link
            class="debug_btn"
            @click="constructFun('debug', scope.row)"
          >
            调试
          </el-button>
          |
          <el-button
            type="primary"
            link
            class="debug_btn"
            @click="constructFun('clear', scope.row)"
          >
            清理
          </el-button>
          |
          <el-tooltip
            class="box-item"
            effect="dark"
            content="请确保点击 调试 完成后再 保存"
            placement="bottom-start"
          >
            <el-button
              type="primary"
              link
              class="debug_btn"
              @click="constructFun('save', scope.row)"
            >
              保存
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        :width="props.tableBtns.length * 70"
      >
        <template #default="scope">
          <el-dropdown
            v-for="ele in props.tableBtns"
            :key="ele.btn_key"
            class="table_handles"
          >
            <el-button
              :style="`${
                handleBtn(scope.row?.status, ele?.btn_value, ele.btn_key)
                  ? 'margin: 0 10px; display: block;'
                  : 'display: none;'
              }`"
              :type="ele.btn_type"
              link
              @click="tableFun(ele.btn_key, scope.row)"
            >
              {{ ele.btn_text }}
              <el-icon
                class="el-icon--right"
                v-if="ele?.show_type === 'dropdown'"
                ><arrow-down />
              </el-icon>
            </el-button>
            <template #dropdown v-if="ele?.show_type === 'dropdown'">
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="e in ele.btn_arr"
                  :key="e.btn_key"
                  @click.native="tableFun(e.btn_key, scope.row)"
                >
                  {{ e.btn_text }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, defineEmits, watch } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";

const props = defineProps([
    "data",
    "listColunms",
    "labelColumns",
    "activeIndex",
    "colsWidth",
    "Keyword",
    "loading",
    "loadingText",
    "tableBtns",
  ]),
  emits = defineEmits([
    "openDetail",
    "handleSelectionChange",
    "handleFun",
    "stopWorkflow",
    "tableFun",
  ]);
watch(
  () => props.listColunms,
  (val) => {
    list_colunms.value = val;
  },
  { deep: true }
);
const list_colunms = ref({});
function handleBtn(status, value, key) {
  if (!value) return true;
  if (props.Keyword === "offline") {
    if (key === "run" && (status === "creating" || status === "stopped")) {
      return true;
    } else if (
      key === "stop" &&
      (status === "waiting" ||
        status === "running" ||
        status === "failed" ||
        status === "unknown")
    ) {
      return true;
    } else {
      return false;
    }
  }
  if (props.Keyword === "cron") {
    if (
      key === "enabled" &&
      (status === "creating" || status === "disabled" || status === "paused")
    ) {
      return true;
    } else if (
      (key === "stopped" || key === "disabled") &&
      (status === "enabled" ||
        status === "running" ||
        status === "waiting" ||
        status === "failed" ||
        status === "success")
    ) {
      return true;
    } else {
      return false;
    }
  }
}
/**
 * @description: table按钮事件
 * @param {*} key 关键字
 * @param {*} item 参数
 * @return {*}
 */
function tableFun(key, item) {
  if (!key) return;
  emits("tableFun", key, item);
}
function handleSelectionChange(val) {
  emits("handleSelectionChange", val);
}
function constructFun(sign, item) {
  emits("handleFun", sign, item.id);
}
// 停止
function taskExampleFun(item) {
  emits("stopWorkflow", item.id);
}
</script>

<style lang="scss" scoped>
.debug_btn {
  margin: 0 10px;
}
.table_handles {
  // margin: 0 10px;
}
</style>
