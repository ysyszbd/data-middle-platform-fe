<!--
 * @LastEditTime: 2023-09-04 14:54:00
 * @Description: 
-->
<template>
  <div class="teak_iframe">
    <iframe
      id="iframe_dom"
      title="Inline Frame Example"
      width="100%"
      height="100%"
      :src="src"
    >
    </iframe>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
const src = ref(
  "http://192.168.1.111:30829/workflows/pipeline/xcfd-s4m67?tab=workflow&nodeId=xcfd-s4m67-1304820454"
);

const route = useRoute();
init();
function init() {
  if (route.query.keyword === "offline") {
    src.value = `http://192.168.1.111:30829/workflows/pipeline/${route.query.name}?tab=workflow&nodeId=${route.query.name}`;
  }
  if (route.query.keyword === "cron") {
    src.value = `http://192.168.1.111:30829/cron-workflows/pipeline/${route.query.name}`;
  }
}
</script>

<style lang="scss" scoped>
.teak_iframe {
  width: 100%;
  height: 100%;
}
:deep(.page--has-toolbar) {
  padding-top: 0px !important;
}
:deep(.page) {
  padding-top: 0px !important;
}
:deep(.page__top-bar) {
  height: 0 !important;
  display: none;
  .top-bar {
    height: 0px;
    .row {
      display: none;
    }
    .top-bar {
      display: none;
    }
  }
}
</style>
