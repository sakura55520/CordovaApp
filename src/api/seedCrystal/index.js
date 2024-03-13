import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/CrucibleSeedCrystalInstall/listByPage',
    method: 'get',
    params
  })
}
//获取所有籽晶安装工序信息
export function listAll(params) {
  return request({
    url: '/CrucibleSeedCrystalInstall/listAll',
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
export function create(data) {
  return request({
    url: '/CrucibleSeedCrystalInstall/create',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/CrucibleSeedCrystalInstall/update',
    method: 'post',
    data
  })
}
//获取所有产品BOM
export function listBomAll(params) {
  return request({
    url: '/productBom/listAll',
    method: 'get',
    params
  })
}
//分页查询籽晶数据
export function seedListByPage(params) {
  return request({
    url: '/seed/finishedProductBill/detail',
    method: 'get',
    params
  })
}
//根据炉次号查询籽晶安装工序详细信息
export function fetchCrystalInstall(lotNo) {
  return request({
    url: `/CrucibleSeedCrystalInstall/lotNo/${lotNo}`,
    method: 'get'
  })
}

//坩埚拆装模块-根据炉次号获取坩埚组装详情
export function fetchCrystalAssemble(lotNo) {
  return request({
    url: `/CrucibleSeedCrystalAssemble/lotNo/${lotNo}`,
    method: 'get'
  })
}
