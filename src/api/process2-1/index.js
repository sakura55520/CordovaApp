import request from '@/utils/req'

export function listByPage(params) {
  return request({
    url: '/seed/process-2-1/listByPage',
    method: 'get',
    params
  })
}
export function submit(data) {
  return request({
    url: '/seed/process-2-1/create',
    method: 'post',
    data
  })
}
export function getByScan(params) {
  return request({
    url: '/seed/process-2-1/getByScan',
    method: 'get',
    params
  })
}
