<template>
  <div class="task_form_box">
    <el-form
      ref="ruleFormRef"
      :model="form_data"
      :rules="props.form_rules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
      v-loading="props.loading"
    >
      <el-form-item
        v-for="(item, index) in props.form_columns"
        :key="index"
        :label="item.label"
        :prop="item.name"
      >
        <!-- 目前是argo--任务模板使用--start -->
        <yh-input
          v-if="item['ui-type'] === 'yh_input'"
          :yhConfigData="item"
          :inputValue="form_data[item.name]"
          @inputFun="handleFormData"
        />
        <yh_volume_mount
          v-if="item['ui-type'] === 'yh_volume_mount'"
          :yhConfigData="item"
          :dataValue="form_data[item.name]"
          @inputFun="handleFormData"
        />
        <yh_input_array
          v-if="item['ui-type'] === 'arr_string'"
          :yhConfigData="item"
          :dataValue="form_data[item.name]"
          @inputFun="handleFormData"
        />
        <yh_select_obj
          v-if="item['ui-type'] === 'yh_select_obj'"
          :yhConfigData="item"
          :dataValue="form_data[item.name]"
          :operationType="props.type"
          @inputFun="handleFormData"
        />
        <!-- 目前是argo--任务模板使用--end -->
        <el-select
          v-if="item['ui-type'] === 'select'"
          v-model="form_data[item.name]"
          :placeholder="`请选择${item.label}`"
        >
          <el-option
            v-for="ele in item.values"
            :key="ele.id"
            :label="ele.value"
            :value="ele.id"
          />
        </el-select>
        <el-input
          v-if="
            item['ui-type'] === 'input' ||
            item['ui-type'] === 'textArea' ||
            !item['ui-type']
          "
          v-model="form_data[item.name]"
          :type="handleInput(item['ui-type'], item.type)"
          :placeholder="`请输入${item.label}`"
          :minlength="handleLength(item?.validators).min"
          :maxlength="handleLength(item?.validators).max"
          :disabled="item?.disabled ? item?.disabled : false"
          @input="handleInputValue($event, item.name, item.type)"
        />
        <div v-if="item['ui-type'] === 'json_input'" class="json_input_box">
          <!-- <div class="json_check_btns">
            <el-button type="primary">输入框</el-button>
            <el-button type="primary">文本</el-button>
          </div> -->
          <div class="json_input_css">
            <el-input
              v-for="(e, i) in json_data[item.name]"
              :key="`${item.name}${i}`"
              v-model="e[1]"
              placeholder="请输入value"
            >
              <template #prepend>
                <el-input v-model="e[0]" placeholder="请输入key"></el-input>
              </template>
              <template #append>
                <el-button
                  type="primary"
                  :icon="Plus"
                  @click="handleJSONdata(i, item.name, 'add')"
                ></el-button>
                <el-button
                  type="danger"
                  :icon="Minus"
                  @click="handleJSONdata(i, item.name, 'del')"
                ></el-button>
              </template>
            </el-input>
          </div>
        </div>
        <el-radio-group
          v-model="form_data[item.name]"
          v-if="item['ui-type'] === 'radio'"
        >
          <el-radio :label="ele.id" v-for="ele in item.values" :key="ele.value">
            {{ ele.value }}
          </el-radio>
        </el-radio-group>
        <el-select
          v-if="item['ui-type'] === 'select2'"
          v-model="form_data[item.name]"
          multiple
          :placeholder="`请选择${item.label}`"
          :style="`width: 100%;`"
        >
          <el-option
            v-for="ele in item.values"
            :key="ele.id"
            :label="ele.value"
            :value="ele.id"
          />
        </el-select>
        <div class="detail_item_tip">{{ item.description }}</div>
      </el-form-item>
      <el-form-item v-if="props.showData?.type === 'tab'">
        <el-button
          type="primary"
          @click="updateDetail(ruleFormRef, 2)"
          class="btn"
        >
          保存当前表单数据
        </el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="form_btns">
      <el-button type="primary" @click="updateDetail(ruleFormRef)" class="btn">
        {{
          props.step_active_index < props.form_step.length - 1
            ? "下一步"
            : "确定"
        }}
      </el-button>
      <el-button
        type="success"
        @click="back"
        class="btn"
        v-show="step_active_index > 0"
      >
        {{ "上一步" }}
      </el-button>
      <el-button @click="closeDialog" class="btn">取消</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, inject } from "vue";
import yhInput from "./argo/yhInput.vue";
import yh_volume_mount from "./argo/yhVolumeMount.vue";
import yh_input_array from "./argo/yhInput_array.vue";
import yh_select_obj from "./argo/yhSelectObj.vue";
import type { FormInstance } from "element-plus";
import { handleLength } from "@/utils/taskUtil";
import { deepClone, isJSON } from "@/utils/util";
import { Plus, Minus } from "@element-plus/icons-vue";
const props = defineProps([
  "form_data",
  "form_rules",
  "form_columns",
  "form_step",
  "step_active_index",
  "type",
  "addSign",
  "form_data_all",
  "showData",
  "loading",
  "tipSign",
]);
const emits = defineEmits(["back", "changeData", "handleLoading", "changeTip"]);
const TASK_PROVIDE: any = inject("TASK_PROVIDE");
const ruleFormRef = ref<FormInstance>(),
  json_data: any = ref({}), // 用来存放某个变量的json数据
  form_data: any = ref({});

watch(
  () => props.form_data,
  (valData) => {
    form_data.value = deepClone(valData);
    props.form_columns.forEach((ele) => {
      if (ele["ui-type"] == "json_input") {
        handleJSON(form_data.value[ele.name], ele.name);
      }
    });
  },
  { immediate: true }
);
function handleJSON(data, type) {
  if (!data || !isJSON(data) || data == "{}") {
    form_data.value[type] = {};
    json_data.value[type] = [[null, null]];
    console.log(json_data.value, "不是json格式");
  } else {
    const json_obj = getJSONData(data);
    json_data.value[type] = [];
    Object.keys(json_obj).forEach((ele) => {
      json_data.value[type].push([ele, json_obj[ele]]);
    });
  }
}
function getJSONData(jsonString) {
  // 将字符串转换为JavaScript对象
  const jsonData = eval(`(${jsonString})`);
  return jsonData;
}
function handleJSONdata(index, type, sign) {
  if (sign === "add") {
    json_data.value[type].splice(index + 1, 0, [null, null]);
  }
  if (sign === "del") {
    if (json_data.value[type].length == 1) {
      json_data.value[type][index] = [null, null];
    } else {
      json_data.value[type].splice(index, 1);
    }
  }
}
// 将json处理放入form表单数据中
function handleJsonToForm() {
  Object.keys(json_data.value).forEach((ele) => {
    form_data.value[ele] = JSON.stringify(arrayToObj(json_data.value[ele]));
  });
}
function arrayToObj(arr) {
  const obj = {};
  arr.forEach((e) => {
    if (e[0] == null && e[1] == null) {
      return;
    } else {
      obj[e[0]] = e[1];
    }
  });
  return obj;
}
function handleFormData(val, key) {
  form_data.value[key] = val;
}
/**
 * @description: 表单创建和更新
 * @param {*} formEl
 * @param {*} type 0：当前页--关闭弹窗；1：切换下一页；2: 当前页--不关闭弹窗
 * @return {*}
 */
async function updateDetail(formEl: FormInstance | undefined, type = 0) {
  if (!formEl) return;
  try {
    formEl.validate(async (valid) => {
      if (valid) {
        handleJsonToForm();
        emits("changeData", form_data.value);
        emits("handleLoading", true);
        const params = { ...form_data.value };
        if (type !== 2) {
          if (props.step_active_index < props.form_step.length - 1) {
            type = 1;
          } else {
            if (
              TASK_PROVIDE.Keyword.value === "offline" ||
              TASK_PROVIDE.Keyword.value === "cron"
            ) {
              type = 3;
            } else {
              type = 0;
            }
          }
        } else {
          params.dag_id = props.showData.tabActive;
        }
        if (type === 3) {
          TASK_PROVIDE.getTaskList(true);
          closeDialog();
          return;
        }
        params.volume_mount = handleVolumeMount(params.volume_mount);
        if (
          props.step_active_index !== 0 &&
          (TASK_PROVIDE.Keyword.value === "offline" ||
            TASK_PROVIDE.Keyword.value === "cron")
        ) {
          const template_id_text = [0, "template_id", 0];
          if (template_id_text[props.step_active_index])
            params[template_id_text[props.step_active_index]] =
              props.form_data_all[0].template_id;
          if (params?.updated_at) delete params.updated_at;
          if (params?.created_at) delete params.created_at;
          if (params?.id && props.type === "add") delete params.id;
        }
        if (props.type === "add") {
          if (!props.addSign[props.step_active_index]) {
            TASK_PROVIDE.addFun(params, props.step_active_index, type);
          } else {
            TASK_PROVIDE.updateFun(params, props.step_active_index, type);
          }
        } else {
          // 这里是由于该任务没有绑定instance,所以走的是创建
          if (
            (TASK_PROVIDE.Keyword.value === "offline" ||
              TASK_PROVIDE.Keyword.value === "cron") &&
            props.step_active_index === 2 &&
            props.tipSign
          ) {
            TASK_PROVIDE.addFun(params, props.step_active_index, type);
            emits("changeTip", false);
          } else {
            TASK_PROVIDE.updateFun(params, props.step_active_index, type);
          }
        }
      } else {
        console.log("error submit!");
        return false;
      }
    });
  } catch (err) {
    console.log(err, "err---updateDetail");
  }
}
// 提交前处理挂载目录数据
function handleVolumeMount(val) {
  console.log(val, "val-handleVolumeMount");
  if (!val) return "[]";
  let arr = JSON.parse(val),
    res: any = [];
  arr.forEach((ele, index) => {
    if (
      ele.type === "pipeline-pvc" &&
      ele?.name.length != 0 &&
      ele.source.length != 0 &&
      ele.target.length != 0
    )
      res.push(ele);

    if (
      ele.type === "album-pvc" &&
      ele.source.length != 0 &&
      ele.target.length != 0
    )
      res.push(ele);
  });
  if (res.length === 0) {
    return "[]";
  } else {
    return JSON.stringify(res);
  }
}
function handleInput(ui_type, type) {
  if (ui_type === "textArea") {
    return "textarea";
  } else {
    if (type === "Int") {
      return "number";
    } else {
      return "text";
    }
  }
}
function handleInputValue(val, key, type) {
  if (type !== "Int") return;
  val = val.replace(/\D/gm, "");
  handleFormData(Number(val), key);
}
function closeDialog() {
  TASK_PROVIDE.handleDialog(false);
}
function back() {
  emits("back");
}
</script>

<style lang="scss" scoped>
.task_form_box {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.form_btns {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  .btn {
    margin-left: 10px;
  }
}
.task_form_box {
  // width: 70%;
  flex-grow: 1;
  overflow: hidden;
}
.detail_item_tip {
  width: 100%;
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 1.5715;
  white-space: pre-wrap;
  word-wrap: break-word;
}
.json_input_box {
  width: 100%;
  .json_input_css {
    width: 100%;
  }
  .json_check_btns {
    width: 100%;
  }
}
:deep(.el-input-group__append) {
  width: 100px;
  padding: 0;
  .el-button {
    width: 50px;
    position: absolute;
  }
  .el-button--primary {
    left: 20px;
  }
  .el-button--danger {
    right: 20px;
  }
}
</style>
