import { ElMessage } from "element-plus";
import axios_instance from "@/axios";
import type { ResponseType } from "axios";

export function getData(url, data, update) {
  const config = {
    method: "get",
    url: url,
    params: data,
  };

  axios_instance(config)
    .then(function (response) {
      update(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function getFileData(url, data, update) {
  const config = {
    method: "get",
    url: url,
    params: data,
    responseType: <ResponseType>"arraybuffer",
  };

  axios_instance(config)
    .then(function (response) {
      update(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function create(url: string, data: any, update: any) {
  const config = {
    method: "post",
    url: url,
    data: data,
  };

  axios_instance(config)
    .then(function (response) {
      update(response.data.data.id);
      ElMessage.success("创建成功.");
    })
    .catch(function (error) {
      console.log(error);
      ElMessage.error("创建失败.");
    });
}

export function deleteRow(url: string, data, update: any) {
  const config = {
    method: "delete",
    url: url,
    data: data,
  };

  axios_instance(config)
    .then(function () {
      update();
      ElMessage.success("删除成功.");
    })
    .catch(function (error) {
      console.log(error);
      ElMessage.error("删除失败.");
    });
}

export function updateIdParameter(url: string, data: any, update: any) {
  const config = {
    method: "put",
    url: url,
    data: data,
  };

  axios_instance(config)
    .then(function () {
      update();
      ElMessage.success("更新成功.");
    })
    .catch(function (error) {
      console.log(error);
      ElMessage.error("更新失败.");
    });
}

export function postData(url: string, data: any, update: any) {
  const config = {
    method: "post",
    url: url,
    data: data,
  };

  axios_instance(config)
    .then(function (response) {
      update(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export function getAllUserData(url, data, update) {
  getData(url, data, (data: any) => {
    getData(
      url,
      {
        page: 1,
        page_size: data.total_count,
      },
      (response: any) => {
        update(response.list);
      }
    );
  });
}

export function get(url, params, config: any = {}) {
  return new Promise((resolve, reject) => {
    axios_instance({
      method: "get",
      url: url,
      params: params,
      ...config,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function post(url, params, config: any = {}) {
  return new Promise((resolve, reject) => {
    axios_instance
      .post(url, params, {
        ...config,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function put(url, params, config: any = {}) {
  return new Promise((resolve, reject) => {
    axios_instance
      .put(url, params, { ...config })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function del(url, params, config: any = {}) {
  return new Promise((resolve, reject) => {
    axios_instance({
      method: "delete",
      url: url,
      params: params,
      ...config,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function delBody(url, params, config: any = {}) {
  return new Promise((resolve, reject) => {
    axios_instance({
      method: "delete",
      url: url,
      data: params,
      ...config,
    })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
