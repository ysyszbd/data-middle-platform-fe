<template>
  <BaseDialog
    v-model:dialog-visible="dialogAnnotationTaskVisible"
    title="创建标注任务"
    width="80%"
    @submit="create(ruleFormRef)"
  >
    <el-form ref="ruleFormRef" :model="form" class="form_box" :rules="rules">
      <el-form-item label="源:" :label-width="formLabelWidth">
        <el-tree-select
          v-model="dirArr"
          :data="files"
          multiple
          value-key="name"
          node-key="id"
          check-strictly
          :props="props"
          lazy
          :load="load"
          style="width: 100%"
          @node-click="handleChange"
          @remove-tag="delTask($event, 'tag')"
          placeholder="请选择文件夹"
        />
      </el-form-item>
      <el-form-item
        label="标注人员:"
        :label-width="formLabelWidth"
        prop="handler"
      >
        <el-select
          v-model="form.handler"
          filterable
          placeholder="请选择标注人员"
          style="width: 100%"
        >
          <el-option
            v-for="item in userListStore.userOptions"
            :key="item.id"
            :label="item.nick_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="审核人员:"
        :label-width="formLabelWidth"
        prop="reviewer"
      >
        <el-select
          v-model="form.reviewer"
          filterable
          placeholder="请选择审核人员"
          style="width: 100%"
        >
          <el-option
            v-for="item in userListStore.userOptions"
            :key="item.id"
            :label="item.nick_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="验收人员:"
        :label-width="formLabelWidth"
        prop="acceptor"
      >
        <el-select
          v-model="form.acceptor"
          filterable
          placeholder="请选择验收人员"
          style="width: 100%"
        >
          <el-option
            v-for="item in userListStore.userOptions"
            :key="item.id"
            :label="item.nick_name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工具集" :label-width="formLabelWidth">
        <el-checkbox-group v-model="toolsList">
          <el-checkbox
            v-for="(ele, index) in workToolList"
            :key="index"
            @change="selectTools($event, ele)"
            :label="ele.key"
            :disabled="ele.key == 'envLabel'"
            >{{ ele.value }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <div class="task_box">
        <div
          class="task_item"
          v-for="(item, index) in form.task_infos"
          :key="index"
        >
          <div class="task_item_title">
            <el-check-tag checked class="task_name" style="margin-right: 8px">
              {{ item.album_name }}
            </el-check-tag>
            <Close
              class="icon_del"
              width="16"
              @click="delTask(item.album_id, 'card')"
            />
          </div>
          <div class="task_detail">
            <el-form-item label="工具集" :label-width="formLabelWidth">
              <el-checkbox-group v-model="item.type" @change="choose">
                <el-checkbox
                  v-for="ele in item.toolsArr"
                  :key="ele.key"
                  :label="ele.key"
                  :disabled="ele.key == 'envLabel' || ele.start === 1"
                >
                  {{ ele.value }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注:" :label-width="formLabelWidth">
              <el-input v-model="item.remarks" autocomplete="off" />
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from "./BaseDialog.vue";
import { ref, watch, inject, reactive, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { workToolList } from "@/utils/data";
import { userListStore } from "@/stores/store";
import { useStateStore } from "@/stores/state";
import { getTaskTools } from "@/axios/taskAPIs";
import { deepClone } from "@/utils/util";

const store = useStateStore();
const ruleFormRef = ref<FormInstance>();
const formLabelWidth = "88px";
const toolsList = ref(["envLabel"]);
const dirArr: any = ref([]);
const form: any = ref({
  source_id: 0,
  album_id: 0,
  handler: store.getUserId,
  creator: store.getUserId,
  reviewer: null,
  acceptor: null,
  task_infos: [],
});
const rules = reactive<FormRules>({
  handler: [
    {
      required: true,
      message: "请选择标注人员！",
      trigger: "change",
    },
  ],
  acceptor: [
    {
      required: true,
      message: "请选择审核人员！",
      trigger: "change",
    },
  ],
});

const SELECT_LIST = inject("SELECT_LIST") as any;
const FILES_LIST = inject("FILES_LIST") as any;
const dialogAnnotationTaskVisible = inject(
  "dialogAnnotationTaskVisible",
  ref(false)
);
const files: any = ref([]);
const props = {
  label: "name",
  children: "children",
  isLeaf: "isLeaf",
};
watch(dialogAnnotationTaskVisible, (newDialogVisible) => {
  console.log(newDialogVisible, "newDialogVisible");
  
  if (newDialogVisible) {
    nextTick(() => {
      form.value.task_infos = deepClone(SELECT_LIST.selectData.value.list);
      dirArr.value = SELECT_LIST.selectData.value.dirArr;
      files.value = FILES_LIST.filesList.value;
      // if (form.value?.task_infos?.length <= 0) return;
      form.value?.task_infos?.forEach(async (item, index) => {
        let obj = await handleTools(item.album_id);
        item.toolsArr = obj?.list;
        item.type = obj?.type;
      });
    });
  } else {
    toolsList.value = ["envLabel"]
  }
});
function choose(val) {
  console.log(val, "val");
}
async function handleTools(album_id) {
  try {
    let toolList = deepClone(workToolList),
      type;
    const res: any = await getTaskTools({
      album_id: album_id,
      handler: form.value.handler,
    });
    console.log(!res.data, "res.data");

    type = res.data?.length > 0 ? [...res.data, "envLabel"] : ["envLabel"];
    if (type.length > 1) {
      res.data?.forEach((ele) => {
        toolList.find((item) => {
          if (item.key === ele) {
            item.start = 1; // 1：之前就已创建过；2：当前创建的；0：未创建
          }
        });
      });
    }
    return { list: toolList, type: type };
  } catch (err) {
    console.log(err, "handleTools--处理当前文件夹所对应的工具集");
  }
}
function delTask(val, sign) {
  try {
    console.log(val, sign, "val, sign");
    
    let index = form.value.task_infos.findIndex((ele) => {
      return ele.album_id === val;
    });
    if (index < 0) return;
    form.value.task_infos.splice(index, 1);
    if (sign === "card") {
      let i = dirArr.value.findIndex((ele) => {
        return ele === val;
      });
      if (i >= 0) {
        dirArr.value.splice(i, 1);
      }
    }
  } catch (err) {
    console.log(err, "err--delSelectData");
  }
}
const load = async (node, resolve) => {
  if (!node.data?.basic) return;
  const arr = await FILES_LIST.getFiles(node.data.basic.url);
  resolve(arr);
};

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

function create(ruleFormRef: FormInstance | undefined) {
  if (!ruleFormRef || form.value.task_infos.length <= 0) return;
  ruleFormRef.validate((valid) => {
    if (valid) {
      form.value.reviewer = form.value.reviewer || form.value.creator;
      emit("submit", form.value);
    } else {
      ElMessage({
        message: `请选择验收人员！`,
        type: "warning",
      });
      return false;
    }
  });
}
function selectTools(sign, item) {
  form.value.task_infos.forEach((ele, j) => {
    let typeIndex = -1,
      toolsIndex = -1;
    toolsIndex = ele.toolsArr.findIndex((e) => {
      return e.key === item.key && e.start == 1;
    });
    if (toolsIndex >= 0) {
      ElMessage({
        message: `${ele.album_name}已创建过${ele.toolsArr[toolsIndex].value}任务`,
        type: "warning",
      });
      return;
    }
    if (sign) {
      ele.type.push(item.key);
      ele.type = [...new Set(ele.type)];
    } else {
      typeIndex = ele.type.findIndex((e) => {
        return e === item.key;
      });
      if (typeIndex >= 0) {
        ele.type.splice(typeIndex, 1);
      }
    }
  });
}
async function handleChange(val) {
  console.log(val, "val----");
  const index = form.value.task_infos.findIndex((ele) => {
    return ele.album_id === val.id;
  })
  if (index >= 0) {
    delTask(val.id, "tag");
    return;
  }
  let obj: any = await handleTools(val.id);
  form.value.task_infos.push({
    album_id: val.id,
    album_name: val.name,
    type: [...obj.type, ...toolsList.value],
    remarks: "",
    toolsArr: obj?.list,
  });
}
</script>
<style lang="scss" scoped>
.task_box {
  width: 100%;
  display: flex;
  max-height: 400px;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: #409eff;
  .task_item {
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid rgb(214, 198, 198);
    border-radius: 8px;
    margin: 5px 0;
    .task_item_title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon_del {
        cursor: pointer;
      }
    }
    .task_detail {
      width: 100%;
    }
  }
}
.form_box {
  :deep(.el-form-item) {
    margin-bottom: 10px;
  }
}
</style>
