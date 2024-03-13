import request from '@/utils/req'

// 查询设备列表
export function equipmentListByPage(params) {
  return request({
    url: '/init/equipment/listByPage',
    method: 'get',
    params
  })
}
