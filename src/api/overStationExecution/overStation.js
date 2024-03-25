import request from "@/utils/req";

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
    url: "/overStationExecution/historicalOverStationRecordsPage",
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
