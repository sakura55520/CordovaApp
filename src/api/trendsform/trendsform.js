import request from '@/utils/req'

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

// 获取表单结构数据
export function getFormData(params) {
  console.log(params,'params');
  return request({
    url: '/wipStorage/getCurrentWipStorageData',
    method: 'get',
    params
  })
}


