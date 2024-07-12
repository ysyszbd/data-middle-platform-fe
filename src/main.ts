import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";

import App from "./App.vue";
import router from "./router";

import "element-plus/dist/index.css";
import piniaPluginPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPluginPersist);

const app = createApp(App);

import vue3videoPlay from "vue3-video-play"; // 引入组件
import "vue3-video-play/dist/style.css"; // 引入css
app.use(vue3videoPlay);

app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
