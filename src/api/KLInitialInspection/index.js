import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/CrucibleChargeYlBlowOn/listByPage',
    method: 'get',
    params
  })
}
//分页查询
export function getWeight(lotNo) {
  return request({
    url: '/FurnaceFeedingTask/lotNo/' + lotNo,
    method: 'get'
  })
}