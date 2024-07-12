<template>
  <div class="cube_login">
    <iframe
      id="iframe_cube"
      title="Inline Frame Example"
      width="100%"
      height="100%"
      :src="src"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, watch, nextTick } from "vue";
import cookies from "js-cookie";
import { useStateStore } from "@/stores/state";
import { decodeUtf8 } from "@/utils/util";

const store = useStateStore();
const props = defineProps(["needLogin"]),
  emits = defineEmits(["startFun"]);
const iframeDom: any = ref(),
  iframeLoadSign = ref(false),
  path = ref(
    process.env.NODE_ENV === "development" || !process.env.NODE_ENV
      ? "http://localhost:4000"
      : "http://192.168.1.40:30990"
  ),
  src = ref("");
watch(
  () => props.needLogin,
  (val) => {
    console.log(val, "val==================");

    if (!val) return;
    noticeLogin();
  }
);
onMounted(() => {
  // 拿到 iframe 中的 window 对象
  iframeDom.value = document.getElementById("iframe_cube");
  console.log(process.env.NODE_ENV, "NODE_ENV");

  noticeLogin();
  window.addEventListener("message", (e) => {
    if (
      e.origin === path.value &&
      (e.data.value === "登录完毕" || e.data.value === "已登录")
    ) {
      console.log(e, "eeee");
      setTimeout(() => {
        emits("startFun");
        console.log(e, "vue");
      }, 500);
    }
  });
});
// cube会将cookie中的myapp_username中文先url编码，然后再将url编码中的%换为\，将16进制转为8进制
// 该方法先判断是否为编码后的数据？
// 编码数据：将8进制转为16进制，然后加上%，再将url编码转为中文
function handleUserName(val) {
  const arr_8 = val.split("\\");
  if (arr_8.length > 1) {
    let str = "";
    arr_8.forEach((item) => {
      if (item.length > 0) {
        const num_10 = parseInt(item, 8);
        const num_16 = num_10.toString(16);
        str = str + "%" + num_16;
      }
    });
    return decodeURIComponent(str);
  } else {
    return arr_8[0];
  }
}
function noticeLogin() {
  const myapp_username = cookies.get("myapp_username");

  if (!myapp_username || myapp_username == "undefined") {
    cookies.set("myapp_username", store.getUser);
  }
  if (myapp_username && handleUserName(myapp_username) === store.getUser) {
    emits("startFun");
    return;
  }
  src.value = path.value + "/frontend/ysy/auto_login?username=" + store.getUser;
  
  if (!iframeLoadSign.value) {
    // postMessage 参数: 1.要发送的数据, 2.目标域名
    iframeDom.value.onload = function () {
      console.log("cube自动登录");
      iframeLoadSign.value = true;
      iframeDom.value.contentWindow.postMessage(
        {
          userName: store.getUser,
          tip: "cube自动登录",
        },
        path.value
      );
    };
  } else {
    console.log("cube自动登录========");
    iframeDom.value.contentWindow.postMessage(
      {
        userName: store.getUser,
        tip: "自动登录",
      },
      path.value
    );
  }
}
</script>

<style lang="scss" scoped>
.cube_login {
  width: 0;
  height: 0;
}
</style>
