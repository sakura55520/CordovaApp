import request from '@/utils/req'

// 主页列表
export function listByPage(params) {
  return request({
    url: '/communal/processingOrderListByPage',
    method: 'get',
    params
  })
}

// 工艺配方列表
export function processlistAll(params) {
  return request({
    url: '/processParam/listAll',
    method: 'get',
    params
  })
}

// 退料列表
export function materiaReturnlistAll(params) {
  return request({
    url: '/materiaReturn/listAll',
    method: 'get',
    params
  })
}

// BOM信息列表
export function getBomInfoByMaterialCode(params) {
  return request({
    url: '/productBom/getByMaterialCode',
    method: 'get',
    params
  })
}

// 扫描物料信息
export function scan(params) {
  return request({
    url: '/warehouse/inventory/scan',
    method: 'get',
    params
  })
}

// 库存
export function getList(params) {
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
/* 打印接口 */
export function print(data) {
  return request({
    url: '/documentPrint/print',
    method: 'post',
    data
  })
}
