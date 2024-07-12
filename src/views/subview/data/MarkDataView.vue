<template>
  <div class="root position-r">
    <EventPanel
      @update-select-tags="updateSelectTags"
      @update-datas="updateDatas"
    />
    <div class="table-base">
      <el-table
        ref="mainTable"
        :data="tableData"
        height="100%"
        row-key="id"
        lazy
        :header-cell-style="tableHeaderStyle"
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'has_child' }"
      >
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="tags">
          <template #header>
            <el-button-group>
              <el-button
                v-for="item in tags"
                :key="item.type"
                type="primary"
                size="small"
                class="tag"
                :color="item.color"
                @click="currentHighlighted = item.type"
                >{{ item.type }}</el-button
              >
            </el-button-group>
          </template>
          <template #default="scope">
            <div style="padding: 0, 10px">
              <TimeLineTags
                v-for="(value, key) in scope.row.tags"
                :key="key"
                :type="value[0]"
                :data="value[1]"
                :color="colorMap"
                :highlighted="currentHighlighted"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getData } from "@/utils/axios";
import { tableHeaderStyle } from "@/utils/style";
import { ElTable } from "element-plus";
import { eventTagStore } from "@/stores/store";
import TimeLineTags from "@/components/TimeLineTags.vue";
import EventPanel from "./sub/EventPanel.vue";
import { album_findChild, get_albums_timeLineTag } from "@/utils/urlset";

const tableData = ref([
  {
    id: 0,
    has_child: true,
  },
]);

const mainTable = ref<InstanceType<typeof ElTable>>();
const loadMap = new Map();
const selectTags = ref();
const tags = ref<any[]>([]);
const colorMap = ref();
const currentHighlighted = ref();

function updateSelectTags(value) {
  selectTags.value = value;
  loadEnvents();
}

function updateDatas(datas, color) {
  tags.value = datas;
  colorMap.value = color;
  getTableData();
}

function fmtTimeLineTag(data) {
  let tagsMap = new Map();
  data.forEach((ele) => {
    let typeName = eventTagStore.tag2TypeMap.get(ele.tag_id);
    if (undefined == tagsMap.get(typeName)) {
      let videoMap = new Map();
      let datas: any[] = [];
      datas.push(ele);
      videoMap.set(ele.video_id, datas);
      tagsMap.set(typeName, videoMap);
    } else {
      let value = tagsMap.get(typeName);
      if (undefined == value.get(ele.video_id)) {
        let datas: any[] = [];
        datas.push(ele);
        value.set(ele.video_id, datas);
      } else {
        value.get(ele.video_id).push(ele);
      }
    }
  });

  var arrayObj = Array.from(tagsMap);
  arrayObj.sort(compare);
  tagsMap = new Map(arrayObj);
  return tagsMap;
}

const load = (row, treeNode, resolve) => {
  getData(album_findChild, { id: row.id }, (data) => {
    let length = data.list.length;
    data.list.forEach((item) => {
      getData(
        get_albums_timeLineTag,
        {
          ids: JSON.stringify([item.id]),
          tag_ids: JSON.stringify(selectTags.value),
        },
        (tag) => {
          if (tag.list.data != undefined) {
            item.tags = fmtTimeLineTag(tag.list.data);
          } else {
            item.tags = [];
          }
          length--;
          if (0 == length) {
            resolve(data.list);
          }
        }
      );
    });
  });
  loadMap.set(row.id, { row, treeNode, resolve });
};

const reloadTree = (parentId: any) => {
  parentId = parentId ? parseInt(parentId) : 0;
  const { row, treeNode, resolve } = loadMap.get(parentId);

  if (
    mainTable.value!.store.states.lazyTreeNodeMap.value[parentId].length == 1
  ) {
    mainTable.value!.store.states.lazyTreeNodeMap.value[parentId] = [];
  }

  load(row, treeNode, resolve);
};

function loadEnvents() {
  tableData.value.forEach((item: any) => {
    if (item.id != 0) {
      getData(
        get_albums_timeLineTag,
        {
          ids: JSON.stringify([item.id]),
          tag_ids: JSON.stringify(selectTags.value),
        },
        (data) => {
          if (data.list.data != undefined) {
            item.tags = fmtTimeLineTag(data.list.data);
          } else {
            item.tags = [];
          }
        }
      );
    }
  });
  for (let [key, value] of loadMap) {
    reloadTree(key);
  }
}

function updateValue(data) {
  tableData.value = data.list;
  loadEnvents();
}

function getTableData() {
  getData(album_findChild, { id: 0 }, updateValue);
}

const compare = function (obj1, obj2) {
  const val1 = obj1;
  const val2 = obj2;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
};

const compare3 = function (obj1, obj2) {
  let val1 = obj1.type_name;
  let val2 = obj2.type_name;
  if (val1 < val2) {
    return -1;
  } else if (val1 > val2) {
    return 1;
  } else {
    return 0;
  }
};
</script>

<style scoped src="@/assets/css/base.css"></style>

<style scoped>
:deep(.el-collapse-item__arrow) {
  margin-left: 20px;
  order: -1;
}
.table-base {
  position: absolute;
  top: 52px;
  height: calc(100% - 52px);
  width: 100%;
}
.pagination {
  margin-bottom: 0px;
}

.position-r {
  position: relative;
}
</style>
