import request from "@/utils/req";

// 待出站列表
export function fetchWaitOutStationPage(params) {
  return request({
    url: "/overStationExecution/waitOutStationPage",
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
