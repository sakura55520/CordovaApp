import request from '@/utils/req'

export function listByPage(params) {
  return request({
    url: '/seed/inspectionBill/listByPage',
    method: 'get',
    params
  })
}
export function submit(data) {
  return request({
    url: '/seed/inspectionBillDetail/submit',
    method: 'post',
    data
  })
}
export function getFormData(data) {
  return request({
    url: '/seed/inspectionBill/getFormData',
    method: 'post',
    isJson:true,
    data
  })
}
