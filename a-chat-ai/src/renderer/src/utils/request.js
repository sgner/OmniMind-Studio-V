import axios from 'axios';
import { ElLoading } from 'element-plus';
import Message from '../utils/Message';
import Api from '../utils/Api';
import { useTokenStore } from "../stores/token";
import { ref } from "vue";
import message from "../utils/Message";
let loading = null;
const instance = axios.create({
  withCredentials: true,
  baseURL: (import.meta.env.PROD ? Api.prodDomain : "") + "/api",
  timeout: 50 * 1000,
});
const lock = ref(true);

// 请求前拦截器
instance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore();

    if (tokenStore.token !== "") {
      config.headers.Authorization = tokenStore.token;
    }
    if (lock.value) {
      loading = ElLoading.service({
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    }
// 添加 CancelToken
    const source = axios.CancelToken.source();
    config.cancelToken = source.token;
    config.cancelSource = source; // 保存 cancelSource 供后续使用
    return config;
  },
  (err) => {
    Message.error("请求发送失败");
    if (loading) loading.close();
    return Promise.reject("请求发送失败");
  }
);

// 请求后拦截器
instance.interceptors.response.use(
  (response) => {
    const { errorCallback, showError = true, responseType } = response.config;
    if (loading) loading.close();

    const responseData = response.data;
    if (responseType === "arraybuffer" || responseType === "blob") {
      return responseData;
    }

    // 正常请求
    if (responseData.code === 20000 || responseData.code === 40200) {
      return responseData;
    } else if (responseData.code === 90100) {
      // 登录超时
      setTimeout(() => {
        window.ipcRenderer.send('reLogin');
      }, 2000);
      return Promise.reject({ showError: true, msg: "登录超时" });
    } else {
      // 其他错误
      return Promise.reject({ showError: showError, msg: responseData.msg });
    }
  },
  (err) => {
    console.log(err)
    if (loading) loading.close();
    if (err.response.status===401) {
      message.error("登录状态异常")
      return Promise.reject({ showError: true, msg: "登录状态异常" });
    }else if(err.code === "ECONNABORTED"){
      return Promise.reject({ type: 'TIMEOUT', showError: true, msg: "请求超时" });
    }
    message.error("网络异常")
    return Promise.reject();
  }
);

// Function to set lock state
export const requestLock = (isLock) => {
  lock.value = isLock !== undefined ? isLock : true;
  return instance;
};

export default instance;
