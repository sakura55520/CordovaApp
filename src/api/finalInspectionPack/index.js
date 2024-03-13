import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/CruciblePackageInspection/listByPage',
    method: 'get',
    params
  })
}