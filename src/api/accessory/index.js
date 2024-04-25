import request from '@/utils/req'

// 查询设备辅材列表
export function fetchData(params) {
  return request({
    url: '/accessory/listByPage',
    method: 'get',
    params
  })
}

// 查询辅料申请记录列表
export function fetchApply(params) {
  return request({
    url: '/applyRecord/listByPage',
    method: 'get',
    params
  })
}

// 申请退库
export function stockReturn(data) {
  return request({
    url: `/equipmentAccessory/stockReturn`,
    method: 'post',
    data
  })
}

// 取消退库
export function cancelStockReturn(id) {
  return request({
    url: `/equipmentAccessory/cancelStockReturn/${id}`,
    method: 'post',
  })
}

// 申请辅材
export function applyAccessory(data) {
  return request({
    url: `/equipmentAccessory/applyAccessory`,
    method: 'post',
    data
  })
}

// 取消申请辅材
export function cancelApplyAccessory(id) {
  return request({
    url: `/equipmentAccessory/cancelApplyAccessory/${id}`,
    method: 'post',
  })
}

export function downComputer(id) {
  return request({
    url: `/equipmentAccessory/down/${id}`,
    method: 'post',
  })
}

export function downAndUpdate(data) {
  return request({
    url: '/equipmentAccessory/downAndUpdate',
    method: 'post',
    data
  })
}

export function upComputer(id) {
  return request({
    url: `/equipmentAccessory/upper/${id}`,
    method: 'post',
  })
}

// 查询辅料
export function fetchAccessory(params) {
  return request({
    url: '/accessory/listAll',
    method: 'get',
    params
  })
}
