import request from '@/utils/req'

// 发料列表
export function getCurrentWipStorageData(processingOrderCode) {
  return request({
    url: '/wipStorage/getCurrentWipStorageData?processingOrderCode='+processingOrderCode,
    method: 'get'
  })
}
// 进站
export function inStation(data) {
  return request({
    url: '/wipStorage/inStation',
    method: 'post',
    data
  })
}
// 出站
export function outStation(data) {
  return request({
    url: '/wipStorage/outStation',
    method: 'post',
    data
  })
}
