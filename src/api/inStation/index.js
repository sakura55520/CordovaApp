import request from "@/utils/req";
import store from "@/store";
import { resetStationStore } from "@/utils/overStation";

//进出站操作-关联业务
export function inOrOutStation(data, noCallback) {
  return request({
    url: "/wipStorage/inOrOutStation",
    method: "post",
    data,
  })
    .then((res) => {
      store.state.station.stationCallback && !noCallback &&
        store.state.station.stationCallback();
      !noCallback && resetStationStore();
      return res;
    })
    .catch((err) => {
      if (err && err.code === 201) {
        store.dispatch("SetStationPostData", data);
        store.dispatch("SetFlowLineList", err.data);
      }
      return Promise.reject(err);
    });
}
//查找暂存信息
export function fetchBuffer(params) {
  return request({
    url: "wipStorage/stationBuffer",
    method: "get",
    params,
  });
}
//保存暂存信息
export function upldateBuffer(params, data) {
  return request({
    url: "wipStorage/stationBuffer",
    method: "post",
    params,
    data,
  });
}
//获取分段编号
export function segmentedInstructionGenerateNo(data) {
  return request({
    url: "wip/segmentedInstruction/generateNo",
    method: "post",
    data,
  });
}
//删除暂存信息
export function deleteBuffer(params) {
  return request({
    url: "wipStorage/stationBuffer",
    method: "delete",
    params,
  });
}
//长晶 保存暂存信息
export function updateGrowthBuffer(data) {
  return request({
    url: "/wipCrystalGrowthOut/stageSave",
    method: "post",
    data,
  });
}

export function check(data) {
  return request({
    url: "/wipDelivery/check",
    method: "post",
    data,
  });
}

export function getIssueWorkOrder(params) {
  return request({
    url: "/workOrder/getIssueWorkOrder",
    method: "get",
    params,
  });
}

export function getBranchRoutes(params) {
  return request({
    url: "/wip/segmentedInstruction/getBranchRoutes",
    method: "get",
    params,
  });
}

export function fetchDetail(params) {
  return request({
    url: `${params.url}/listByPage`,
    method: "get",
    params,
  });
}

export function getSeed(params) {
  return request({
    url: "/wipChargeOut/getSeed",
    method: "get",
    params,
  });
}

export function findByCode(params) {
  return request({
    url: "/warehouse/warehouseMaterialUnpackRecord/findByCode",
    method: "get",
    params,
  });
}

export function getSampleCode(params) {
  return request({
    url: `/wipcrystalcheck/sample-code/${params.sampleType}/${params.crystalNo}/${params.sampleIdentification}/${params.index}`,
    method: "get",
  });
}

export function getCutBackSampleCode(params) {
  return request({
    url: `/wipcrystalcheck/sample-code/cutback/${params.sampleType}/${params.crystalNo}/${params.sampleIdentification}/${params.index}`,
    method: "get",
  });
}

export function getBackCuttingSampleRecord(params) {
  return request({
    url: `/wipBackCuttingSampleRecord/listByPage`,
    method: "get",
    params,
  });
}

export function createBackCuttingSampleRecord(data) {
  return request({
    url: `/wipBackCuttingSampleRecord/createRecord`,
    method: "post",
    data,
  });
}

export function updateBackCuttingSampleRecord(data) {
  return request({
    url: `/wipBackCuttingSampleRecord/updateRecord`,
    method: "post",
    data,
  });
}

export function deleteBackCuttingSampleRecord(params) {
  return request({
    url: `/wipBackCuttingSampleRecord/deleteRecord`,
    method: "delete",
    params,
  });
}

// 更新晶锭检验
export function updateIngotDetectionStatus(data) {
  return request({
    url: `/wipBackCuttingSampleRecord/updateDoneStatus`,
    method: "post",
    data,
  });
}
