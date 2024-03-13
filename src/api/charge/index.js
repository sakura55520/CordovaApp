import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/CrucibleChargeSchedule/listByPage',
    method: 'get',
    params
  })
}
//获取详情
export function getDetail(id) {
  return request({
    url: `/CrucibleCharge/${id}`,
    method: 'get'
  })
}
//获取所有产品BOM
export function listAll(params) {
  return request({
    url: '/productBom/listAll',
    method: 'get',
    params
  })
}
//获取所有物料寿命信息
export function listAllLife(params) {
  return request({
    url: '/accessory/listAll',
    method: 'get',
    params
  })
}
//扫码获取炉次号
export function scan(params) {
  return request({
    url: '/CrucibleChargeSchedule/equipmentCode',
    method: 'get',
    params
  })
}
//根据bomid获取bom信息
export function findByProductBom(productBom) {
  return request({
    url: '/CrucibleCharge/findByProductBom/'+productBom,
    method: 'get'
  })
}
export function create(data) {
  return request({
    url: '/CrucibleChargeSchedule/create',
    method: 'post',
    data
  })
}
export function chargeDelete(params) {
  return request({
    url: '/CrucibleChargeSchedule/delete',
    method: 'post',
    params
  })
}
