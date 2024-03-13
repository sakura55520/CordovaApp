import request from '@/utils/req'

export function listByPage(params) {
  return request({
    url: '/seed/finalInspection/listByPage',
    method: 'get',
    params
  })
}
export function submit(data) {
  return request({
    url: '/seed/finalInspection/create',
    method: 'post',
    data
  })
}
export function getByScan(params) {
  return request({
    url: '/seed/finalInspection/getByScan',
    method: 'get',
    params
  })
}

// 打印
export function print(params) {
  return request({
    url: '/seed/finalInspection/print',
    method: 'get',
    params
  })
}
