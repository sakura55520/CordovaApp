import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/CrucibleSeedCrystalAssemble/listByPage',
    method: 'get',
    params
  })
}
export function listByCrucibleCode(params) {
  return request({
    url: '/CrucibleCharge/listByCrucibleCode',
    method: 'get',
    params
  })
}
// 坩埚拆装模块-根据炉次号获取坩埚组装详情
export function listByLotNo(lotNo) {
  return request({
    url: '/CrucibleSeedCrystalAssemble/lotNo/' + lotNo,
    method: 'get'
  })
}
export function create(data) {
  return request({
    url: '/CrucibleSeedCrystalAssemble/create',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/CrucibleSeedCrystalAssemble/update',
    method: 'post',
    data
  })
}

// 查询坩埚拆装模块-清洗工序-工序信息子表列表
export function CrucibleCleanDryProcessDetail(params) {
  return request({
    url: '/crucibleCleanProcess/listByPage',
    method: 'get',
    params
  })
}

// 根据批次号获取已开炉次数
export function fetchCount(params) {
  return request({
    url: '/CrucibleChargeZjBlowOn/count',
    method: 'get',
    params
  })
}

// 根据炉次号查询历史炉次信息
export function getHistoryLotInfo(params) {
  return request({
    url: '/CrucibleSeedCrystalAssemble/getHistoryLotInfo',
    method: 'get',
    params
  })
}
