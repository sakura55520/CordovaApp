import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/CrucibleProductStorage/listByPage',
    method: 'get',
    params
  })
}
//入库
export function create(data) {
  return request({
    url: '/CrucibleProductStorage/create',
    method: 'post',
    data
  })
}

//查询物料信息
export function getMaterialModel(params) {
  return request({
    url: '/CruciblePackageInspection/getMaterialModel',
    method: 'get',
    params
  })
}
//重新判定-更新成品入库信息
export function updateFinishedProductInfo(data) {
  return request({
    url: '/CruciblePackageInspection/updateCrystalGrade',
    method: 'post',
    data
  })
}
