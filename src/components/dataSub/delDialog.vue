<!--
 * @LastEditTime: 2023-10-24 17:58:04
 * @Description: 
-->
<template>
  <el-dialog
    v-model="props.showSign"
    :title="props.showType"
    :width="props.showKey !== 'list' ? 500 : 900"
    :close-on-click-modal="false"
  >
    <div class="del_dialog_text" v-show="props.showKey !== 'list'">
      <Warning color="#faad14" width="20px" class="del_icon" />{{
        `确定${props.showType}？`
      }}
    </div>
    <!-- 定时任务弹窗 -->
    <el-form
      v-if="props.showKey === 'cron'"
      :rules="rules"
      :inline="true"
      :model="taskData"
      class="cron_css"
      ref="formRef"
    >
      <el-form-item label="请输入要执行的时间" prop="cron">
        <el-input
          v-model="taskData.cron"
          placeholder="请输入要执行的时间 cron表达式"
          clearable
        />
        <div class="from_tip">
          {{ `输入5位cron表达式：分 时 日 月 年` }}
        </div>
      </el-form-item>
    </el-form>
    <div v-show="props.showKey === 'list'" class="tasking_list">
      <el-table :data="props.taskingList.list" style="width: 100%">
        <el-table-column prop="create_at" label="创建时间" width="180" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="status" label="状态" width="180" />
        <el-table-column prop="" label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" @click="goPage(scope.row.name)">
              进入
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="tasking_list_item"
        v-for="item in props.taskingList"
        :key="item.name"
      ></div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFun">取消</el-button>
        <el-button type="primary" @click="submitFun">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Warning } from "@element-plus/icons-vue";
import { ref, watch, reactive, defineProps } from "vue";
import type { FormRules } from "element-plus";
import { isValidCronFormat } from "@/utils/checkerCron/checkers";

const props = defineProps({
    showSign: {
      type: Boolean,
      required: true,
    },
    showType: {
      type: String,
    },
    showKey: {
      type: String,
    },
    taskingList: {
      type: Object,
      default(rawProps) {
        return { name: "", list: [] };
      },
    },
  }),
  emits = defineEmits(["submit", "handleDialog"]);
const taskData = reactive({
    cron: "",
  }),
  formRef = ref();
const validatePass = (rule: any, value: any, callback: any) => {
  if (value) {
    if (isValidCronFormat(value)) {
      callback();
    } else {
      callback(new Error("请输入正确的5位cron表达式！"));
    }
  }
};
const rules = reactive<FormRules>({
  cron: [{ validator: validatePass, trigger: "blur" }],
});

function dialogFun() {
  emits("handleDialog", false);
}
function goPage(name) {
  const src = `http://192.168.1.111:30829/workflows/pipeline/${name}?tab=workflow&nodeId=${name}`;
  window.open(src, "_blank") as Window;
}
function submitFun() {
  if (props.showKey === "cron") {
    formRef.value.validate((valid) => {
      if (valid) {
        console.log("submit!", taskData.cron);
        emits("submit", { cron: taskData.cron });
      } else {
        console.log("error submit!");
        return false;
      }
    });
  } else {
    emits("submit");
  }
}
</script>

<style lang="scss" scoped>
.del_dialog_text {
  display: flex;
  align-items: center;
  .del_icon {
    margin-right: 6px;
  }
}
.cron_css {
  margin-top: 20px;
  // font-weight: 600;
  .from_tip {
    color: rgba(153, 153, 153, 0.8);
  }
}
.tasking_list {
  width: 100%;
  .tasking_list_item {
    width: 100%;
    padding: 10px 0;
  }
}
</style>
