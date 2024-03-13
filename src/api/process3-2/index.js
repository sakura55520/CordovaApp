import request from '@/utils/req'

// 根据设备分组查询
export function groupByDevice(params) {
  return request({
    url: '/planProcessingOrder/groupByDevice',
    method: 'get',
    params
  })
}

export function listByPage(params) {
  return request({
    url: '/seed/process-3_2/listByPage',
    method: 'get',
    params
  })
}

// 扫码获取工序数据
export function getByScan(params) {
  return request({
    url: '/seed/process-3_2/getByScan',
    method: 'get',
    params
  })
}

export function submit(data) {
  return request({
    url: '/seed/process-3_2/create',
    method: 'post',
    data
  })
}

