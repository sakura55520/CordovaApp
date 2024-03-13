import request from '@/utils/req'

export function listByPage(params) {
  return request({
    url: '/crucibleDryProcess/listByPage',
    method: 'get',
    params
  })
}
export function getDetail(id) {
  return request({
    url: `/crucibleDryProcess/${id}`,
    method: 'get'
  })
}
export function listAll(params) {
  return request({
    url: '/crucibleDryProcess/listAll',
    method: 'get',
    params
  })
}
export function create(data) {
  return request({
    url: '/crucibleDryProcess/create',
    method: 'post',
    data
  })
}

// 开始烘干
export function update(data) {
  return request({
    url: '/crucibleDryProcess/update',
    method: 'post',
    data
  })
}

// 结束烘干
export function dryEnd(data) {
  return request({
    url: '/crucibleDryProcess/dryEnd',
    method: 'post',
    data
  })
}

// 创建合批烘干
export function createBatch(data) {
  return request({
    url: '/batchDryProcess/create',
    method: 'post',
    data
  })
}

// 分页查询合批烘干列表
export function fetchBatchList(params) {
  return request({
    url: '/batchDryProcess/listByPage',
    method: 'get',
    params
  })
}

// 开始合批烘干
export function batchUpdate(data) {
  return request({
    url: '/batchDryProcess/update',
    method: 'post',
    data
  })
}

// 结束合批烘干
export function batchEnd(data) {
  return request({
    url: '/batchDryProcess/dryEnd',
    method: 'post',
    data
  })
}
