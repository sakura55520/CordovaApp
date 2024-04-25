import request from "@/utils/req";

export function fetchData(params) {
  return request({
    url: "/printerLog/listByPage",
    method: "get",
    params,
  });
}
export function deleteLog(data) {
  return request({
    url: "/printerLog/delete",
    method: "post",
    data,
  });
}
/* 打印接口 */
export function docketPrint(data) {
  return request({
    url: "/documentPrint/print",
    method: "post",
    data,
  });
}
/* 打印预览接口 */
export function docketPrintPreview(data) {
  return request({
    url: "/documentPrint/printShow",
    method: "post",
    data,
  });
}

// 获取所有单据打印配置
export function getAllPrintType(params) {
  return request({
    url: "/documentPrint/getAllPrintType",
    method: "get",
    params,
  });
}

/* 获取打印模板 */
export function fetchDocumentMould(params) {
  return request({
    url: "/documentPrint/listByDocumentMoulde",
    method: "get",
    params,
  });
}
