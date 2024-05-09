import request from '@/utils/req'

/*
* 获取设备数据
*/
export function getSeriesDevices(params) {
  return request({
    url: '/init/equipment/getSeriesDevices',
    method: 'get',
    params
  })
}
