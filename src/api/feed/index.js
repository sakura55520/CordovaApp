import request from '@/utils/req'

//分页查询
export function listByPage(params) {
  return request({
    url: '/FurnaceFeedingTask/listByPage',
    method: 'get',
    params
  })
}
//产品编号，工序代码，获取工艺参数信息
export function getProductSop(params) {
  return request({
    url: '/productSop/getProductSop',
    method: 'get',
    params
  })
}
export function update(data) {
  return request({
    url: '/FurnaceFeedingTask/update',
    method: 'post',
    data
  })
}