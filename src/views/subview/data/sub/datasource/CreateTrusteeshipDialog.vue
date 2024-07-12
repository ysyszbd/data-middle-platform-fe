<template>
  <el-dialog
    v-model="visible"
    title="托管数据源"
    width="30%"
    top="30vh"
    @open="dialogOpen"
    destroy-on-close
  >
    <el-form-item label="路径" v-if="parentType == 'dso'">
      <el-tree-select
        v-model="createForm.detail.source_url"
        value-key="path"
        node-key="path"
        lazy
        check-strictly
        :load="load"
        :props="treeProps"
        style="width: 100%"
      >
        <template #default="{ data: { path, basic } }">
          {{ path }}
          <el-tag size="small" :type="statusToType(basic.status_description)">
            {{ keyToName(basic.status_description) }}
          </el-tag>
        </template>
      </el-tree-select>
    </el-form-item>
    <el-form-item label="分类">
      <el-checkbox-group v-model="source_info.use">
        <el-checkbox label="labeltrain">标注训练</el-checkbox>
        <el-checkbox label="testdata">测试数据</el-checkbox>
        <el-checkbox label="customerdata">客户数据</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="createForm.remark" />
    </el-form-item>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="create"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useStateStore } from "@/stores/state";
import { get } from "@/utils/axios";
import { file_list } from "@/utils/urlset";
import { keyToName, statusToType } from "@/utils/util";

const props = defineProps(["visible", "source", "parentType", "previewData"]);
const emits = defineEmits(["update:visible", "create"]);

const createForm = ref({
  work_flow_id: "source_entrusting",
  creator: 0,
  detail: {
    creator: 0,
    source_id: 0,
    source_url: "",
    source_type: "",
    source_status: "",
    source_info: ""
  },
  remark: ""
});

const treeProps = {
  label: "path"
};

const source_info = ref({ use: ["labeltrain", "testdata"] });

const visible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emits("update:visible", value);
  }
});

async function load(node, resolve) {
  // console.log(node);
  if (node.level === 0) {
    let parentUrl = String(props.source.url);
    let last = parentUrl.lastIndexOf("/");
    let searchUrl = parentUrl.slice(0, last);
    let data: any = await get(file_list, { path: searchUrl });
    let list = data.list;
    let searchData = list.filter((item) => {
      return item.basic.url == parentUrl;
    });
    searchData.forEach((e) => {
      e.path = e.basic.url;
      if ("mount" != e.basic.status_description) {
        e.disabled = true;
      }
    });

    resolve(searchData);
  } else {
    const params = {
      path: createForm.value.detail.source_url
    };
    params.path = node.data.path;
    let data: any = await get(file_list, params);
    let list = data.list;
    list.forEach((e) => {
      e.path = e.basic.url;
      if ("mount" != e.basic.status_description) {
        e.disabled = true;
      }
    });

    resolve(list);
  }
}

function dialogOpen() {
  createForm.value.remark = "";
}

function create() {
  if ("dr" == props.parentType) {
    createForm.value.detail.source_url = props.previewData.basic.url;
  }
  const store = useStateStore();
  createForm.value.creator = store.getUserId;
  createForm.value.detail.creator = store.getUserId;
  createForm.value.detail.source_id = props.source.id;
  createForm.value.detail.source_type = props.source.type;
  createForm.value.detail.source_status = props.source.status;
  createForm.value.detail.source_info = JSON.stringify(source_info.value);
  emits("create", createForm.value);
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
