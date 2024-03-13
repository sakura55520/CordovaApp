import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/seed/finishedProductBill/listByPage',
    method: 'get',
    params
  })
}
//入库
export function inputStorage(data) {
  return request({
    url: '/seed/finishedProductBill/inputStorage',
    method: 'post',
    data
  })
}
//入库-打印预览
export function print(params) {
  return request({
    url: '/seed/finishedProductBill/print',
    method: 'get',
    params
  })
}
//查询物料信息
export function getMaterialModel(params) {
  return request({
    url: '/seed/finishedProductBill/getMaterialModel',
    method: 'get',
    params
  })
}
//重新判定-更新成品入库信息
export function updateFinishedProductInfo(data) {
  return request({
    url: '/seed/finishedProductBill/updateFinishedProductInfo',
    method: 'post',
    data
  })
}
