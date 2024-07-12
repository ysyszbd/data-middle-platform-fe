<!--
 * @LastEditTime: 2023-10-23 14:02:10
 * @Description: 
-->
<template>
  <div class="my_page">
    <el-dialog
      v-model="dialogSign"
      :close-on-click-modal="false"
      :title="`${props.type != 'detail' ? key_text[props.type] : ''} ${
        props.title
      } ${props.type === 'detail' ? '详情' : ''}`"
      width="900"
      draggable
      @close="closeDialog"
    >
      <el-alert
        v-if="step_active_index == 2 && tipData.sign[showData.tabActive]"
        :title="tipData.text"
        type="warning"
        class="alert_tip"
      />
      <!-- 详情 - 仅查看 -->
      <el-form
        v-if="props.type === 'detail'"
        :model="data"
        label-width="140px"
        status-icon
        class="detail_only_read"
      >
        <el-form-item
          v-for="(item, index) in props.infoData[props.activeIndex][
            props.Keyword
          ].show_columns"
          :key="index"
          :label="props.labelColumns[item]"
          :prop="item"
          >{{ props.detailData[item] }}
        </el-form-item>
      </el-form>
      <!-- 修改 \ 新增 --可能分步骤 -->
      <div v-if="props.type === 'update' || props.type === 'add'">
        <el-steps
          v-if="formStep.length > 1"
          class="step_box"
          :active="step_active_index"
          simple
          process-status="process"
          finish-status="success"
        >
          <el-step
            v-for="(item, index) in formStep"
            :key="index"
            :title="`步骤 ${index + 1}`"
          />
        </el-steps>
        <div v-if="!lastFormData" class="no_data_tip">
          <el-alert
            title="该任务绑定的instance模板为空，请重新绑定有数据的instance模板！"
            type="warning"
            :closable="false"
            center
            show-icon
          />
          <div class="tip_link">
            请点击跳转：
            <el-button
              type="success"
              link
              size="large"
              @click="goDetail(data[0]?.template_id)"
              >任务详情</el-button
            >
          </div>
        </div>
        <div class="task_dialog_box" v-if="lastFormData">
          <div class="task_tabs" v-if="showData.type == 'tab'">
            <div
              v-for="item in showData.tabArr"
              :key="item"
              :class="[
                'task_tab_item',
                showData.tabActive === item ? 'task_tab_item_active' : '',
              ]"
              @click="changeTabs(item)"
            >
              {{ item }}
            </div>
          </div>
          <taskForm
            :form_data="
              showData.type === 'tab'
                ? data[step_active_index][showData.tabActive]
                : data[step_active_index]
            "
            :form_data_all="data"
            :form_step="formStep"
            :form_rules="rules[step_active_index]"
            :form_columns="formColumns[step_active_index]"
            :step_active_index="step_active_index"
            :type="props.type"
            :showData="showData"
            :addSign="addSign"
            :loading="loading"
            :tipSign="tipData.sign[showData.tabActive]"
            @back="back"
            @changeData="changeData"
            @handleLoading="handleLoading"
            @changeTip="changeTip"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  defineProps,
  defineEmits,
  watch,
  reactive,
  defineExpose,
} from "vue";
import type { FormRules } from "element-plus";
import { handleType, deepClone } from "@/utils/util";
import {
  handleRules,
  getIndex,
  handleDefault,
  getSelect,
} from "@/utils/taskUtil";
import { mapping_relation_data } from "@/components/dataSub/config/configData";
import taskForm from "./taskForm.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    required: true,
  },
  detailData: {
    type: Object,
    required: true,
  },
  infoData: {
    type: Object,
    required: true,
  },
  activeIndex: {
    type: String,
    required: true,
  },
  changeInfo: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  Keyword: {
    type: String,
    required: true,
  },
  labelColumns: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(["handleDialog"]);
let rules = ref<Array<FormRules>>([]);
const dialogSign = ref(false),
  formColumns: any = ref([]),
  formStep: any = ref([]),
  step_active_index = ref(0),
  addSign = ref<Array<boolean>>([]),
  showData: any = ref({
    type: [], // 表单表现形式  tab：带tab栏
    tabArr: [], // tab要展示的数组
    tabActive: "", // 当前选择的tab数据
  }),
  loading = ref(true),
  data = ref<Array<{ [key: string]: any }>>([{}]),
  tipData = ref({
    sign: {},
    text: "",
  }),
  lastFormData = ref(true), // 最后一步是否有数据，没有数据则提示去cube拖拽页面，有数据则展示
  key_text = {
    add: "新建",
    update: "修改",
  };

watch(
  [() => props.dialogVisible, () => props.detailData, () => props.changeInfo],
  ([dialogVisibleVal, detailDataVal, infoVal]) => {
    try {
      dialogSign.value = dialogVisibleVal;
      if (!dialogSign.value) {
        init();
        return;
      }
      if (props.type !== "update") return;
      if (detailDataVal?.alert_status)
        detailDataVal.alert_status = handleStr(detailDataVal?.alert_status);
      handleData(infoVal?.edit_fieldsets || [[]], infoVal?.edit_columns);
      data.value[0] = detailDataVal;
    } catch (err) {
      console.log(err, "err---dialogVisibleVal, detailDataVal");
    }
  }
);
// 过滤配置信息，生成form验证条件
watch(
  () => props.type,
  (val) => {
    if (val != "add") return;
    handleData(
      props.infoData[props.activeIndex][props.Keyword]?.add_fieldsets || [[]],
      props.infoData[props.activeIndex][props.Keyword]?.add_columns
    );
  }
);
function handleData(fieldsets, columns) {
  try {
    formStep.value = fieldsets;
    let project_i = -1;
    if (mapping_relation_data[props.Keyword]) {
      project_i = getIndex(columns, "name", "type").i;
    }
    if (props.Keyword === "repository") {
      project_i = getIndex(columns, "name", "hubsecret").i;
    }
    if (props.Keyword === "construct") {
      project_i = getIndex(columns, "name", "target_image").i;
    }
    rules.value = new Array(formStep.value.length);
    data.value = new Array(formStep.value.length);
    formColumns.value = new Array(formStep.value.length);
    addSign.value = new Array(formStep.value.length);
    formStep.value.forEach((ele, I) => {
      formColumns.value[I] = [];
      data.value[I] = {};
      rules.value[I] = {};
      addSign.value[I] = false;
      if (ele.fields) {
        ele.fields.forEach((item, i) => {
          const _i = getIndex(columns, "name", item).i;
          columns[_i] = handleAddForm(deepClone(columns[_i]), project_i, _i);
          data.value[I][item] = columns[_i].default;
          formColumns.value[I].push(columns[_i]);
          if (
            (!columns[_i]?.validators || columns[_i]?.validators.length <= 0) &&
            !columns[_i]?.required
          )
            return;
          rules.value[I][item] = handleRules(columns[_i]);
        });
      } else {
        formColumns.value[I] = columns;
        // 如果不分步骤，则直接按照add_columns对要展示的数据进行处理
        columns?.forEach((item, index) => {
          columns[index] = handleAddForm(deepClone(item), project_i, index);
          data.value[I][item.name] = item.default;
          if (mapping_relation_data[props.Keyword] && item.name === "type")
            data.value[I][item.name] = mapping_relation_data[props.Keyword];
          if (
            (!item?.validators || item?.validators.length <= 0) &&
            !item.required
          )
            return;
          rules.value[I][item.name] = handleRules(item);
        });
      }
      if (props.Keyword === "notebook" || props.Keyword === "argo") {
        // 给挂载目录添加限制条件
        rules.value[I].volume_mount = {
          trigger: "change",
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback();
              return;
            }
            let arr = JSON.parse(value),
              set_target = new Set(arr.map((item) => item.target)).size,
              arr_name = arr.filter(item => item.type === "pipeline-pvc"),
              set_name = new Set(arr_name.map((item) => item.name)).size;
            if (set_target != arr.length) {
              callback(new Error("挂载目录中 target 有重复值，请不要重复！"));
            } else if (set_name != arr_name.length) {
              callback(new Error("挂载目录中 name 有重复值，请不要重复！"));
            } else {
              callback();
            }
          },
        };
        // 给扩展--模板分类添加限制条件
        rules.value[I].expand = {
          trigger: "blur",
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            let data = JSON.parse(value);
            if (data.index < 0) {
              callback(new Error("请选择模板分类"));
            } else {
              callback();
            }
          },
        }
      }
      handleLoading(false);
    });
  } catch (err) {
    console.log(err, "er===handleData");
  }
}
function changeData(form) {
  if (showData.value.type === "tab") {
    data.value[step_active_index.value][showData.value.tabActive] = form;
  } else {
    data.value[step_active_index.value] = form;
  }
}
function init() {
  showData.value.type = "";
  showData.value.tabArr = [];
  showData.value.tabActive = "";
  formColumns.value = [];
  formStep.value = [];
  data.value = [];
  step_active_index.value = 0;
  Object.keys(tipData.value.sign).forEach((k) => {
    tipData.value.sign[k] = false;
  });
  tipData.value.text = "";
}
function closeDialog() {
  emits("handleDialog", false);
}
function handleStr(val) {
  if (handleType(val) === "String") {
    val = val.split(",");
  }
  return val;
}
function handleLoading(val) {
  loading.value = val;
}

function back() {
  step_active_index.value--;
  changeTip(false);
  showData.value.type = "";
  showData.value.tabArr = [];
  showData.value.tabActive = "";
}
// 分步骤，拿到返回数据后对data进行填充
function handleStep(form) {
  if (props.type === "add") addSign.value[step_active_index.value] = true;
  step_active_index.value++;
  if (step_active_index.value == 1) {
    Object.entries(data.value[step_active_index.value]).forEach(
      ([key, value]) => {
        const _i = getIndex(
          formColumns.value[step_active_index.value],
          "name",
          key
        ).i;

        data.value[step_active_index.value][key] = form[key]
          ? form[key]
          : formColumns.value[step_active_index.value][_i].default;
      }
    );
    data.value[step_active_index.value] = {
      ...form,
      ...data.value[step_active_index.value],
    };
  } else {
    if (!Object.keys(form).length) {
      lastFormData.value = false;
      return;
    }
    Object.entries(form).forEach(([k, v]) => {
      // 如果是 离线处理 & 定时处理 的最后一步，要特殊处理，展示类型为tab
      if (
        step_active_index.value === formStep.value.length - 1 &&
        (props.Keyword === "offline" || props.Keyword === "cron")
      ) {
        showData.value.type = "tab";
        showData.value.tabArr.push(k);
        showData.value.tabActive = showData.value.tabArr[0];
      }
      // 判断第三步绑定的instance是否存在
      // 如果第三步返回的数据job.XXX中有job_template_id && 没有describe，则instance存在
      // 如果第三步返回的数据job.XXX中没有job_template_id && 有describe， 则instance不存在
      if (!form[k]?.job_template_id && form[k]?.describe) {
        tipData.value.sign[k] = true;
        tipData.value.text =
          "该任务未绑定job_instance，请点击 [保存当前表单数据] 进行分配！";
        form[k].job_template_id = form[k].id;
        delete form[k].id;
      } else {
        tipData.value.sign[k] = false;
      }
    });
    data.value[step_active_index.value] = form;
  }
}
function handleAddForm(item, project_i, index) {
  try {
    if (project_i >= 0 && index === project_i)
      item.default = handleDefault(props.Keyword);
    if (
      item["ui-type"] === "select" &&
      (!item.values || item.values.length <= 0)
    ) {
      // if (item.name === "images") {
      //   getSelectList(item.name, props.Keyword).then((res) => {
      //     item.values = res;
      //   });
      // } else {
      // }
      getSelect(item.name, props.Keyword).then((res) => {
        item.values = res;
      });
    }
    return item;
  } catch (err) {
    console.log(err, "err---handleAddForm");
  }
}
function changeTabs(item) {
  if (item === showData.value.tabActive) return;
  showData.value.tabActive = item;
}
function changeTip(val) {
  tipData.value.sign[showData.value.tabActive] = val;
}
function goDetail(id) {
  router.push({
    path: "/data/data-process/task-detail",
    query: {
      id: id,
      page: route.path,
    },
  });
}
defineExpose({ handleStep, handleLoading, step_active_index });
</script>

<style lang="scss" scoped>
.task_detail_item {
  width: 100%;
  display: flex;
  align-items: center;
  margin: 20px;
  font-size: 16px;
  .task_detail_item_name {
    width: 150px;
    font-weight: 600;
  }
}
.detail_item_tip {
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  line-height: 1.5715;
}
.detail_only_read {
  :deep(.el-form-item__content) {
    font-size: 16px;
    word-wrap: break-word;
    word-break: break-all;
  }
  :deep(.el-form-item__label) {
    font-size: 16px;
    margin-right: 16px;
    font-weight: 600;
  }
}
.step_box {
  margin-bottom: 28px;
}
.task_dialog_box {
  width: 100%;
  display: flex;
  .task_tabs {
    width: 150px;
    flex-shrink: 0;
    box-sizing: border-box;
    .task_tab_item {
      height: 50px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border-right: 4px solid #e4e7ed;
    }
    .task_tab_item_active {
      border-right: 4px solid #409eff;
      background: linear-gradient(to right, #fff, rgba(64, 158, 255, 0.2));
      font-weight: 600;
    }
  }
}
.form_btns {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  .btn {
    margin-left: 10px;
  }
}
.alert_tip {
  margin-bottom: 10px;
}
.no_data_tip {
  width: 100%;
  height: 400px;
  font-size: 20px;
  :deep(.el-alert) {
    padding: 20px 10px;
  }
  :deep(.el-alert__title) {
    font-size: 20px;
  }
  .tip_link {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
