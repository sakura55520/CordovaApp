import request from '@/utils/req'

// 发料列表
export function listByPage(params) {
  return request({
    url: '/communal/reworkOrder',
    method: 'get',
    params
  })
}
// 库存
export function getlist(params) {
  return request({
    url: '/communal/getReworkOrderWarehouseInventory',
    method: 'get',
    params
  })
}
// 原料合成返工-生产发料
export function submit(data) {
  return request({
    url: '/communal/sendReworkOrderWarehouseInventory',
    method: 'post',
    data
  })
}
// 根据设备号获取炉次号
export function getLotNo(params) {
  return request({
    url: '/communal/getLotNo',
    method: 'get',
    params
  })
}

