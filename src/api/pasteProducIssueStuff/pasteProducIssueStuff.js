import request from '@/utils/req'

// 发料列表
export function listByPage(params) {
  return request({
    url: '/seed/issueBill/listByPage',
    method: 'get',
    params
  })
}
// 获取详情列表
export function getlist(params) {
  return request({
    url: '/communal/getReworkOrderWarehouseInventory',
    method: 'get',
    params
  })
}
// 详情扫码或输入获取单项数据
export function getItem(params) {
  return request({
    url: '/warehouse/inventory/getByUniqueCode',
    method: 'get',
    params
  })
}
// 原料合成返工-生产发料
export function submit(data) {
  return request({
    url: '/seed/issueBill/submit',
    method: 'post',
    data
  })
}

