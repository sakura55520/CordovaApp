import request from "@/utils/req";

const RequestURL = "/factory/materialModel/";

export function getMateralModelExtras(params) {
  return request({
    url: RequestURL + "getMateralModelExtras",
    method: "get",
    params,
  });
}