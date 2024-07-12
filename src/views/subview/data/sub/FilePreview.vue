<!--
 * @LastEditTime: 2023-06-29 11:03:52
 * @Description: 
-->
<template>
  <div class="base">
    <div class="title">
      <el-tag :type="getStyleByFileType(previewData.basic.type)">
        {{ previewData.basic.name }}
      </el-tag>
    </div>
    <div class="scroll-bar">
      <el-scrollbar>
        <el-space direction="vertical" style="width: 100%" :fill="true">
          <div
            v-if="
              previewData.basic.type != 'album' &&
              previewData.basic.type != 'unknown'
            "
            class="h-v-center"
          >
            <el-card class="box-card" shadow="hover">
              <BaseSourceImage
                v-if="previewData.basic.type == 'image'"
                :url="previewData.basic.url"
              >
              </BaseSourceImage>
              <div v-else-if="previewData.basic.type == 'video'">
                <vue3VideoPlay
                  width="100%"
                  height="100%"
                  :title="previewData.basic.name"
                  :src="options.src"
                  :type="options.type"
                  :autoPlay="false"
                />
              </div>
              <iframe
                v-else-if="previewData.basic.type == 'txt'"
                src="/1.txt"
                name="iframe_a"
              ></iframe>
            </el-card>
          </div>
          <div class="info">
            <el-card class="box-card" shadow="hover">
              <div class="custom-tree-container">
                <el-tree
                  :data="treeData"
                  :expand-on-click-node="false"
                  default-expand-all
                >
                  <template #default="{ node, data }">
                    <div class="custom-tree-node">
                      <el-input
                        v-if="data.edit && data.showEdit"
                        v-model="data.label"
                        placeholder="Please input"
                        size="small"
                        @keydown.stop=""
                      />
                      <span v-else>{{ data.label }}</span>
                      <span>
                        <div v-if="data.value instanceof Array">
                          <div
                            v-for="item in data.value"
                            :key="item"
                            style="margin-right: 5px"
                          >
                            {{ keyToName(item) }}
                          </div>
                        </div>
                        <span v-else>{{ keyToName(data.value) }}</span>
                        <span v-show="modifyTagBtnVisible">
                          <el-button
                            style="margin-left: 8px; width: 28px"
                            v-if="data.add"
                            type="success"
                            size="small"
                            @click="append(data)"
                            >+
                          </el-button>
                          <el-button
                            style="margin-left: 8px; width: 28px"
                            type="primary"
                            v-if="data.edit"
                            size="small"
                            :icon="getIcons(data.showEdit)"
                            @click="edit(data)"
                          />
                          <el-button
                            style="margin-left: 8px"
                            v-if="data.delete"
                            type="danger"
                            size="small"
                            @click="remove(node, data)"
                            >-
                          </el-button>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-tree>
                <el-tree :data="fileAuth" :props="fileProps" default-expand-all>
                  <template #default="{ node, data }">
                    <span v-if="1 == node.level">
                      {{ node.label }}
                    </span>
                    <span
                      v-else
                      :style="{ color: data.is_active ? '#409eff' : '#f56c6c' }"
                    >
                      {{ node.label }}
                    </span>
                  </template>
                </el-tree>
              </div>
            </el-card>
          </div>
          <div class="control">
            <el-card class="box-card" shadow="hover">
              <!-- <el-popconfirm
                title="确定要删除这个吗?"
                @confirm="deleteData(previewData.id.$oid)"
              >
                <template #reference>
                  <el-button link type="danger" class="btn-fixed"
                    >删除</el-button
                  >
                </template>
              </el-popconfirm> -->
              <el-button
                v-if="exportBtnVisible"
                link
                type="primary"
                class="btn-fixed"
                @click="filterExport"
              >
                导出
              </el-button>
              <el-button
                v-if="shareLinkBtnVisible"
                link
                type="primary"
                class="btn-fixed"
                @click="copy"
                >分享链接
              </el-button>
              <el-button
                v-if="loadBtnVisible"
                link
                type="primary"
                class="btn-fixed"
                @click="handleCommand('loaded')"
                >加载
              </el-button>
              <el-button
                v-if="unloadBtnVisible"
                link
                type="danger"
                class="btn-fixed"
                @click="handleCommand('unloaded')"
                >卸载
              </el-button>
              <!-- <el-button v-show="previewData.basic.type != 'dir'" type="primary"
                >转图片
              </el-button>
              <el-button v-show="previewData.basic.type != 'dir'" type="primary"
                >转MAT
              </el-button> -->
              <el-button
                v-if="linkBtnVisible"
                link
                type="primary"
                class="btn-fixed"
                @click="handleCommand('link')"
              >
                导入数据集
              </el-button>
              <el-button
                v-if="trusteeshipBtnVisible"
                link
                type="primary"
                class="btn-fixed"
                @click="handleCommand('trusteeship')"
              >
                托管
              </el-button>

              <el-button
                v-if="authorityBtnVisible"
                link
                type="primary"
                class="btn-fixed"
                @click="handleCommand('authority')"
              >
                权限分配
              </el-button>
            </el-card>
          </div>
          <div v-if="type == 'ds'" class="control">
            <el-card class="box-card" shadow="hover">
              <el-dropdown
                v-if="type == 'ds'"
                trigger="click"
                @command="handleCommand"
              >
                <el-button link type="primary" class="btn-fixed">
                  创建任务
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      command="mark"
                      :disabled="!auth?.creatTask"
                      >标注任务</el-dropdown-item
                    >
                    <!-- <el-dropdown-item command="pickup"
                      >挑图任务</el-dropdown-item
                    >
                    <el-dropdown-item command="train"
                      >训练任务</el-dropdown-item
                    > -->
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-dropdown
                trigger="click"
                @command="handleCommand"
                style="margin-left: 10px"
              >
                <el-button link type="primary" class="btn-fixed">
                  批量导出
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      command="filterexport"
                      :disabled="!auth?.export"
                    >
                      筛选导出
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-card>
          </div>
        </el-space>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import useClipboard from "vue-clipboard3";
import PinyinMatch from "pinyin-match";
import BaseSourceImage from "./BaseSourceImage.vue";
import { computed, ref, watch } from "vue";
import { updateIdParameter } from "@/utils/axios";
import { file_update } from "@/utils/urlset";
import { ElMessage } from "element-plus";
import { useStateStore } from "@/stores/state";
import { EditPen, Check } from "@element-plus/icons-vue";
import { getStyleByFileType, initTreeData, keyToName } from "@/utils/util";

const props = defineProps<{
  previewData: any;
  auth: any;
  type: string;
}>();
const emit = defineEmits<{
  (e: "update"): void;
  (e: "filterExport", value: boolean): void;
  (e: "command", value: string): void;
}>();

const store = useStateStore();
const { toClipboard } = useClipboard();
const previewInfo = ref({
  info: {
    car: "",
    vin: "",
    date: "",
    location: "",
    platform: "",
    use: "",
    function: " ",
    software: ""
  },
  label: {
    tags: [],
    custom_tag: [],
    self_tag: {
      id: store.getUserId,
      data: ""
    },
    data_tag: [],
    event_tag: []
  }
});

const options = ref({
  src: "", //视频源
  type: "m3u8" //视频类型
});
const restaurants = ref([{ value: "ACC" }, { value: "AEB" }]);

const treeData = ref([] as any[]);
const fileAuth = ref();
const fileProps = {
  children: "children",
  label: "name"
};

//权限分配
const authorityBtnVisible = ref(false);
//修改标签
const modifyTagBtnVisible = ref(false);
//托管
const trusteeshipBtnVisible = computed(() => {
  return (
    props.type == "dr" &&
    props.previewData.basic.type == "album" &&
    props.previewData.basic.status_description == "mount"
  );
});
//分享链接
const shareLinkBtnVisible = computed(() => {
  return props.type != "ds" && props.previewData.basic.status !== "no_role";
});
//加载
const loadBtnVisible = ref(false);
//卸载
const unloadBtnVisible = ref(false);
//导入数据集
const linkBtnVisible = ref(false);
//导出
const exportBtnVisible = ref(false);

function setAuthority() {
  fileAuth.value = [{ name: "权限信息", is_active: true, children: [] }];
  let roleIds = store.getUserRoleIds;
  let roles = roleIds.split(",");
  if (roles.includes("1") || roles.includes("4")) {
    authorityBtnVisible.value = true;
  } else {
    authorityBtnVisible.value = false;
  }
  let actions = props.previewData.action;
  for (let action in actions) {
    let actionProto = actions[action];
    fileAuth.value[0].children.push(actionProto);
    switch (actionProto.name) {
      case "权限分配":
        break;
      case "读取":
        break;
      case "修改标签":
        modifyTagBtnVisible.value = actionProto.is_active;
        break;
      case "托管":
        break;
      case "分享链接":
        break;
      case "批量导出":
        break;
      case "加载":
        if (
          props.previewData.basic.status_description == "unloaded" &&
          actionProto.is_active
        ) {
          loadBtnVisible.value = true;
        } else {
          loadBtnVisible.value = false;
        }
        break;
      case "卸载":
        if (
          props.previewData.basic.status_description == "loaded" &&
          actionProto.is_active
        ) {
          unloadBtnVisible.value = true;
        } else {
          unloadBtnVisible.value = false;
        }
        break;
      case "导入数据集":
        if (
          (props.type == "ds" ||
            (props.type == "dr" &&
              props.previewData.basic.status_description == "entrusted")) &&
          actionProto.is_active
        ) {
          linkBtnVisible.value = true;
        } else {
          linkBtnVisible.value = false;
        }
        break;
      case "删除数据集":
        break;
      case "创建数据集":
        break;
      case "创建任务":
        break;
      case "导出":
        if (props.previewData.basic.type === "dir" && actionProto.is_active) {
          exportBtnVisible.value = true;
        } else {
          exportBtnVisible.value = false;
        }
        break;
      default:
        break;
    }
  }
}

function filterExport() {
  emit("filterExport", false);
}

const append = (data) => {
  const newChild = { label: "New", edit: true, showEdit: true, delete: true };
  if (!data.children) {
    data.children = [];
  }
  data.children.push(newChild);
  treeData.value = [...treeData.value];
  console.log(treeData.value);
  updateLabel();
};

function getIcons(showEdit) {
  return showEdit ? Check : EditPen;
}

const remove = (node, data) => {
  const parent = node.parent;
  const children = parent.data.children || parent.data;
  const index = children.findIndex((d) => d.id === data.id);
  children.splice(index, 1);
  treeData.value = [...treeData.value];
  updateLabel();
};

function getArrayByName(name) {
  let label = treeData.value.find((o) => o.key === "label");
  let tag: any = label.children.find((o) => o.key === name);
  let array = [] as any[];
  for (let i = 0; i < tag.children.length; i++) {
    array.push(tag.children[i].label);
  }
  return array;
}

function updateLabel() {
  let label = {};
  label["custom_tag"] = getArrayByName("custom_tag");
  label["data_tag"] = getArrayByName("data_tag");
  label["event_tag"] = getArrayByName("event_tag");
  // eslint-disable-next-line vue/no-mutating-props
  props.previewData.label = { ...props.previewData.label, ...label };
  let self_array = getArrayByName("self_tag");
  if (self_array.length > 0) {
    previewInfo.value.label.self_tag.data = self_array[0];
    setSelfTag();
  }
  updateIdParameter(file_update, props.previewData, () => {});
}

function edit(data) {
  data.showEdit = !data.showEdit;

  if (data.showEdit) {
    return;
  }
  updateLabel();
}

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  cb(results);
};

const createFilter = (queryString: string) => {
  return (currentValue) => {
    return PinyinMatch.match(
      currentValue.value.toLowerCase(),
      queryString.toLowerCase()
    );
  };
};

watch(
  () => props.previewData,
  (newPreviewData) => {
    initValue();
    previewInfo.value.info = {
      ...previewInfo.value.info,
      ...newPreviewData.info
    };
    if ("label" in newPreviewData) {
      for (const i in newPreviewData.label) {
        if (i == "self_tag") {
          getSelfTag();
        } else {
          previewInfo.value.label[i] = newPreviewData.label[i];
        }
      }
    }
    treeData.value = initTreeData(previewInfo.value);
    // console.log("treeData", treeData.value);
  },
  { immediate: true }
);

function setSelfTag() {
  // eslint-disable-next-line no-prototype-builtins
  if (props.previewData.label.hasOwnProperty("self_tag")) {
    props.previewData.label.self_tag.filter((i) => {
      if (i.id == store.getUserId) {
        i["data"] = previewInfo.value.label.self_tag.data;
      }
    });
  } else {
    // eslint-disable-next-line vue/no-mutating-props
    props.previewData.label.self_tag = [previewInfo.value.label.self_tag];
  }
}

function getSelfTag() {
  let obj = props.previewData.label.self_tag.filter(
    (i) => i.id == store.getUserId
  );
  if (obj.length > 0) {
    previewInfo.value.label.self_tag.data = obj[0].data;
  }
}

const copy = async () => {
  try {
    let url = "smb//" + props.previewData.basic.url;
    await toClipboard(url);
    ElMessage({
      message: "已复制",
      type: "success",
      grouping: true,
      center: true
    });
  } catch (e) {
    console.error(e);
  }
};

function initValue() {
  previewInfo.value.label = {
    tags: [],
    custom_tag: [],
    self_tag: {
      id: store.getUserId,
      data: ""
    },
    data_tag: [],
    event_tag: []
  };
  previewInfo.value.info = {
    car: "",
    vin: "",
    date: "",
    location: "",
    platform: "",
    use: "",
    function: " ",
    software: ""
  };
  setAuthority();
}

function handleCommand(command) {
  switch (command) {
    case "link":
    case "mark":
    case "loaded":
    case "unloaded":
    case "trusteeship":
    case "authority":
      emit("command", command);
      break;
    case "filterexport":
      emit("filterExport", true);
      break;
    default:
      ElMessage({
        message: "该功能暂未开放.",
        type: "warning"
      });
      break;
  }
}
</script>

<style scoped src="@/assets/css/base.css"></style>
<style scoped>
.base {
  height: calc(100% - 20px);
  padding: 10px;
}
.title {
  width: calc(100% - 6px);
  margin-bottom: 10px;
}
.info {
  width: calc(100% - 6px);
}
.control {
  width: calc(100% - 6px);
}
.box-card {
  width: calc(100% - 6px);
}
.scroll-bar {
  height: calc(100% - 40px);
}
:deep(.el-card__body) {
  padding: 10px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-button + .el-button {
  margin-left: 0 !important;
}
.el-button {
  margin-right: 10px;
}
.el-button:last-child {
  margin-right: 0;
}
.btn-fixed {
  width: 76px !important;
}
:deep(.el-tree-node__content) {
  height: auto;
}
</style>
