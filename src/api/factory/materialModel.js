import request from "@/utils/req";

const RequestURL = "/workOrder/";

export function getMateralModelExtras(params) {
  return request({
    url: RequestURL + "findPlanWorkOrderExtraVos",
    method: "get",
    params,
  });
}