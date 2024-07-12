<template>
  <BaseInfoEdit title="创建采集任务" @submit="create">
    <el-form ref="ruleFormRef" :model="form">
      <el-form-item label="parent_id:" :label-width="formLabelWidth">
        <el-input v-model="form.parent_id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="名称:" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="车牌:" :label-width="formLabelWidth">
        <el-select
          v-model="form.car_plate"
          filterable
          allow-create
          default-first-option
          placeholder="Select"
          style="width: 100%"
        >
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.plate"
            :value="item.plate"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="place:" :label-width="formLabelWidth">
        <el-input v-model="form.place" autocomplete="off" />
      </el-form-item>
      <el-form-item label="handler:" :label-width="formLabelWidth">
        <el-input v-model.number="form.handler" autocomplete="off" />
      </el-form-item>
      <el-form-item label="时间:" :label-width="formLabelWidth">
        <el-col :span="11">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="开始时间"
            value-format="YYYYMMDDhhmmss"
            :default-time="defaultTime"
            style="width: 100%"
          />
        </el-col>
        <el-col :span="2" class="text-center">
          <span>-</span>
        </el-col>
        <el-col :span="11">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="结束时间"
            value-format="YYYYMMDDhhmmss"
            :default-time="defaultTime"
            style="width: 100%"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="里程:" :label-width="formLabelWidth">
        <el-col :span="11">
          <el-input v-model="form.start_mile" autocomplete="off" />
        </el-col>
        <el-col :span="2" class="text-center">
          <span>-</span>
        </el-col>
        <el-col :span="11">
          <el-input v-model="form.end_mile" autocomplete="off" />
        </el-col>
      </el-form-item>
      <el-form-item label="状态:" :label-width="formLabelWidth">
        <el-input v-model="form.status" autocomplete="off" />
      </el-form-item>
      <el-form-item label="备注:" :label-width="formLabelWidth">
        <el-input v-model="form.remarks" autocomplete="off" />
      </el-form-item>
    </el-form>
  </BaseInfoEdit>
</template>

<script setup lang="ts">
import BaseInfoEdit from "./BaseInfoEdit.vue";
import { ref, watch, inject } from "vue";
import type { FormInstance } from "element-plus";
import type { CollectTask, VehicleInfo } from "@/utils/data";
import { getData } from "@/utils/axios";
import { car_list } from "@/utils/urlset";

const ruleFormRef = ref<FormInstance>();
const defaultTime = new Date(2000, 1, 1, 12, 0, 0);
const formLabelWidth = "80px";

const tableData = ref<VehicleInfo[]>([]);
const total = ref();

const emit = defineEmits<{
  (e: "submit", value: any): void;
}>();

const dialogVisible = inject("dialogVisible", ref(false));

watch(dialogVisible, (newDialogUpdateVisible) => {
  if (newDialogUpdateVisible === true) {
    getData(
      car_list,
      {
        page: 1,
        page_size: 9999,
      },
      (data: any) => {
        tableData.value = data.list;
        total.value = data.total_count;
      }
    );
  }
});

const form = ref<CollectTask>({
  parent_id: 0,
  name: "",
  remarks: "",
  car_plate: "",
  place: "",
  handler: 0,
  start_time: "",
  end_time: "",
  start_mile: "",
  end_mile: "",
  status: "",
});

function create() {
  emit("submit", form.value);
}
</script>
<style scoped src="@/assets/css/base.css"></style>
