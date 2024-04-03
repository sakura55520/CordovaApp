import request from "@/utils/req";
import store from "@/store";

// 待出站列表
export function fetchWaitOutStationPage(params) {
  return request({
    url: "/planProcessingOrder/processingOrderListByPage",
    method: "get",
    params,
  });
}
// 历史过站记录
export function fetchHistoricalOverStationRecords(params) {
  return request({
    url: "/wipStorage/listByPage",
    method: "get",
    params,
  });
}
// 退站
export function exitStation(params) {
  return request({
    url: "/wipStorage/exitStation",
    method: "get",
    params,
  });
}

// 获取当前用户有权限的工厂模型树状图
export function getfactoryModelTree() {
  return request({
    url: '/factoryModel/permission/tree',
    method: 'get',
    params: {
      userId: store.getters.userId
    }
  })
}
