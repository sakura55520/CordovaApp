import request from '@/utils/req'
//出站接口
export function outStation(data) {
  return request({
    url: '/wipStorage/outStation',
    method: 'post',
    data
  })
}
//进站接口
export function inStation(data) {
  return request({
    url: '/wipStorage/inStation',
    method: 'post',
    data
  })
}
//进出站操作-关联业务
export function inOrOutStation(data) {
  return request({
    url: '/wipStorage/inOrOutStation',
    method: 'post',
    data
  })
}
//查找暂存信息
export function fetchBuffer(params) {
  return request({
    url: '/wipStorage/stationBuffer',
    method: 'get',
    params
  })
}
//保存暂存信息
export function upldateBuffer(params, data) {
  return request({
    url: '/wipStorage/stationBuffer',
    method: 'post',
    params,
    data
  })
}
//删除暂存信息
export function deleteBuffer(params) {
  return request({
    url: '/wipStorage/stationBuffer',
    method: 'delete',
    params
  })
}
//长晶 保存暂存信息
export function updateGrowthBuffer(data) {
  return request({
    url: '/wipCrystalGrowthOut/stageSave',
    method: 'post',
    data
  })
}
