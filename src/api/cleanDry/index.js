import request from '@/utils/req'

export function listByPage(params) {
  return request({
    url: '/crucibleClean/listByPage',
    method: 'get',
    params
  })
}
export function getDetail(id) {
  return request({
    url: `/crucibleClean/${id}`,
    method: 'get'
  })
}
export function warehouseListAll(params) {
  return request({
    url: 'CrucibleMaterialWarehouse/listAll',
    method: 'get',
    params
  })
}
export function listAll(params) {
  return request({
    url: '/crucibleClean/listAll',
    method: 'get',
    params
  })
}

// 根据清洗批次查询装料详情数据
export function getByCleanNo(params) {
  return request({
    url: '/CrucibleChargeDetail/getByCleanNo',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: '/crucibleClean/create',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/crucibleClean/update',
    method: 'post',
    data
  })
}
