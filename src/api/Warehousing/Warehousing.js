import request from '@/utils/req'

// 主页列表
export function listByPage(params) {
  return request({
    url: '/packageInfo/listByPage',
    method: 'get',
    params
  })
}
// 入库
export function warehousing(data) {
  return request({
    url: '/packageInfo/warehousing',
    method: 'post',
    data
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

// 原料合成工-合批任务
export function orderBlending(data) {
  return request({
    url: '/planProcessingOrder/orderBlending',
    method: 'post',
    data
  })
}

// 查询在制品站点
export function getCurrentWipStorageData(params) {
  return request({
    url: '/wipStorage/getCurrentWipStorageData',
    method: 'get',
    params
  })
}

