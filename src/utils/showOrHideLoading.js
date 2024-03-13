import Vue from 'vue'
import { Loading } from 'element-ui';

let needLoadingRequestCount = 0; //当前正在请求的数量
let loadingInstance;

export function showLoading() {
  let main = document.querySelector('body')
  if (main) {
    if (needLoadingRequestCount === 0 && !loadingInstance) {
      loadingInstance = Loading.service({ background:"rgba(0, 0, 0, 0.8)",customClass:"Loading",text:"数据加载中..." });
    }
    needLoadingRequestCount++;
  }
}

export function closeLoading() {
  Vue.nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    needLoadingRequestCount--;
    needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); // 保证大于等于0
    if (needLoadingRequestCount === 0) {
      if (loadingInstance) {
        hideLoading()
      }
    }
  });
}

function hideLoading() {
  loadingInstance.close();
  loadingInstance = null;
}
