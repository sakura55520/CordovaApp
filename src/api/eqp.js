import request from '@/utils/req'

// 查询设备列表
export function fetchEqp(params) {
  return request({
    url: '/init/equipment/listAll',
    method: 'get',
    params
  })
}
