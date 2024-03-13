import request from '@/utils/req'

export function listByPage(params) {
  return request({
    url: '/seed/process-2-2/listByPage',
    method: 'get',
    params
  })
}

// 扫码获取工序数据
export function getByScan(params) {
  return request({
    url: '/seed/process-2-2/getByScan',
    method: 'get',
    params
  })
}

export function submit(data) {
  return request({
    url: '/seed/process-2-2/create',
    method: 'post',
    data
  })
}

// 分页查询加工工单列表
export function processingOrderListByPage(params) {
  return request({
    url: '/planProcessingOrder/processingOrderListByPage',
    method: 'get',
    params
  })
}

