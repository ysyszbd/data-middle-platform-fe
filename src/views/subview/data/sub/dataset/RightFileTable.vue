<!--
 * @LastEditTime: 2023-06-28 16:13:09
 * @Description: 数据集--标注训练--文件列表
-->
<template>
  <div class="root-div">
    <div v-if="showtype" class="data-div">
      <el-table
        :data="allFileData"
        height="100%"
        stripe
        highlight-current-row
        @row-click="tableRowClicked"
        @select="selectFun"
        @select-all="selectFun"
      >
        <el-table-column prop="basic.name" label="文件名" width="230" />
        <el-table-column prop="basic.type" label="类型" >
          <template #default="scope">
            <el-tag
              disable-transitions
              :type="getStyleByFileType(scope.row.basic.type)"
              >{{ scope.row.basic.type }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else ref="itemDataRoot" style="height: calc(100% - 32px)">
      <ItemList
        :data="allFileData"
        @item-click="tableRowClicked"
        @select="selectFun"
      />
    </div>
    <TablePagination
      :pageSize="pageSize"
      :total="total"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import ItemList from "../ItemList.vue";
import TablePagination from "@/components/TablePagination.vue";
import { ref, watch } from "vue";
import { getData } from "@/utils/axios";
import { file_list } from "@/utils/urlset";
import {
  getStyleByFileType,
  statusToType,
  keyToName,
  getFileFilter
} from "@/utils/util";

const props = defineProps(["showtype", "searchData"]);
const emits = defineEmits(["tableRowClicked"]);

let parentData;
const allFileData: any = ref([]);
const previewData: any = ref(undefined);

const total = ref(0);
const pageSize = ref(24);
const currentPage = ref(1);

watch(
  () => props.searchData,
  (val) => {
    console.log(val, "val-watch-props.searchData");
    
    getTableData(parentData);
  }
);

function tableRowClicked(row) {
  if (undefined == previewData.value) {
    emits("tableRowClicked", row);
  } else if (previewData.value.basic.url != row.basic.url) {
    emits("tableRowClicked", row);
  }
  previewData.value = row;
}

function selectFun(val) {}

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  getTableData(parentData);
};

function getTableData(data) {
  console.log(data, "data----")
  parentData = data;
  if (undefined == parentData) {
    return;
  }
  const params = {
    page: currentPage.value,
    page_size: pageSize.value,
    not_must: JSON.stringify({
      "basic.type.keyword": {
        type: "string",
        operation: "term",
        value: ["album"]
      }
    })
  };
  const filter = {};
  filter["liners.liner_id.keyword"] = {
    type: "string",
    operation: "term",
    value: [parentData.id]
  };
  const filterstr = getFileFilter(props.searchData, filter);
  params["filter"] = filterstr;
  getData(file_list, params, (data) => {
    allFileData.value = data.list;
    total.value = data.total_count;
  });
}
defineExpose({ getTableData });
</script>
<style scoped>
.root-div {
  position: relative;
  background-color: white;
  height: 100%;
  border: 1px solid #ebeef5;
  box-sizing: border-box;
}

.data-div {
  position: relative;
  height: calc(100% - 34px);
  width: 100%;
  box-sizing: border-box;
}
.pagination {
  position: absolute;
  right: 30px;
  bottom: 1px;
}
</style>
