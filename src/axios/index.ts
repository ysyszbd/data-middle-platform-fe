/*
 * @LastEditTime: 2023-07-18 11:21:54
 * @Description: 
 */
import axios from "axios";
import router from "@/router";
import { ElNotification } from "element-plus";
import { useStateStore } from "@/stores/state";

const axios_instance = axios.create({
  baseURL: "/server",
});

// 添加请求拦截器
axios_instance.interceptors.request.use(
  function (config: any) {
    const store = useStateStore();
    const header = {
      Authorization: store.getToken,
      "content-type": "application/json; charset=utf-8",
      ...config.headers,
    };
    config.headers = header;
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios_instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // console.log("响应");
    // console.log(response, 'axios');
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    console.log(error.response);
    if (error.response == undefined) {
      ElNotification({
        title: error.code,
        message: error.message,
        type: "error",
      });
    } else {
      const status = error.response.status;
      switch (status) {
        case 401:
          {
            ElNotification({
              title: error.response.status,
              message: "登录时间超时，请重新登录",
              type: "warning",
            });
            const store = useStateStore();
            store.setEmpty();
            router.push("/login");
          }
          break;
        default:
          ElNotification({
            title: status,
            message: error.response.data,
            type: "error",
          });
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default axios_instance;
