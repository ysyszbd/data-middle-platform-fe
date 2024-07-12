<!--
 * @LastEditTime: 2023-08-21 17:48:16
 * @Description: 
-->
<template>
  <div class="my_page" id="task_detail">
    <iframe
      id="iframe_cube_detail"
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
import { updatePipelineApi } from "@/axios/trainTemplateAPIs";
import { ElMessage, ElLoading } from "element-plus";

const route = useRoute();
const router = useRouter();

const src = ref(""),
  pagePath = ref(route.query.page || ""),
  // needLogin = ref(false),
  id = ref(Number(route.query.id)),
  handleSign = ref(false),
  path = ref(
    process.env.NODE_ENV === "development" || !process.env.NODE_ENV
      ? `http://localhost:3001`
      : `http://192.168.1.111`
      // : `http://192.168.1.40:31749`
  ),
  Loading: any = ref(null),
  iframeDom: any = ref();

onMounted(() => {
  // 拿到 iframe 中的 window 对象
  iframeDom.value = document.getElementById("iframe_cube_detail");
  src.value =
    process.env.NODE_ENV === "development" || !process.env.NODE_ENV
      ? `${path.value}/static/appbuilder/vison/index.html?pipeline_id=${id.value}#/`
      : `${path.value}/workflow/?pipeline_id=${id.value}#/`;
  // src.value = `${path.value}/static/appbuilder/vison/index.html?pipeline_id=${id.value}`;
  window.addEventListener("message", detailMessage);
});
onUnmounted(() => {
  window.removeEventListener("message", detailMessage);
});
const detailMessage = async (e) => {
  // console.log(e, "eeee----");
  try {
    if (
      e.origin === path.value &&
      e.data.value === "save_dag_json" &&
      !handleSign.value
    ) {
      handleLoading(true, `${e.data.type} 中，请稍等...`);
      const res: any = await updatePipelineApi({
        id: Number(e.data.id),
        ...e.data.data,
      });
      if (res.code === 200) {
        handleLoading(false, "");
      } else {
        handleLoading(false, "");
        ElMessage({
          message: "保存失败",
          type: "error",
        });
      }
    }
    if (e.origin === path.value && e.data.value === "登录完毕") {
      // console.log(e.data, "ppppppppppppppppppp");
      location.reload();
    }
  } catch (err) {
    handleLoading(false, "");
    ElMessage({
      message: "保存失败",
      type: "error",
    });
    console.log(err, "err---");
  }
};
function handleLoading(sign = false, str) {
  if (sign) {
    Loading.value = ElLoading.service({
      lock: true,
      text: str,
      background: "rgba(0, 0, 0, 0.7)",
    });
  } else {
    Loading.value.close();
  }
}
</script>

<style lang="scss" scoped>
.my_page {
  width: 100%;
  height: 100%;
}
</style>
