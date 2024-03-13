import request from '@/utils/req'
//出站接口
export function outStation(data) {
  return request({
    url: '/wipStorage/outStation',
    method: 'post',
    data
  })
}
//进站接口
export function inStation(data) {
  return request({
    url: '/wipStorage/inStation',
    method: 'post',
    data
  })
}
//进出站操作-关联业务
export function inOrOutStation(data) {
  return request({
    url: '/wipStorage/inOrOutStation',
    method: 'post',
    data
  })
}
