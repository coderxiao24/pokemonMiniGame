import axios from "axios";

import NProgress from "nprogress";
import { baseUrl } from "@/config/index";
const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000 * 10,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    NProgress.start();
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {
    NProgress.done();
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    NProgress.done();
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    const { authorization } = response.headers;
    authorization && localStorage.setItem("token", authorization);
    return response;
  },
  function (error) {
    console.log(error);
    NProgress.done();
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const { status } = error.response;
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default instance;
