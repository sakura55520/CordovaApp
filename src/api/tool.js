import req from '@/utils/req'
import request from "@/utils/req";

export function getNowServicerDate() {
    return req.get('/mes/getNowServiceDate')
}
export function getUserInfoByUserRole(obj) {
    return req.get('/client/tool/getUserInfoByUserRole',obj)
}

/* 获取工厂模型 */
export function getFactoryModel() {
    return req.get('/factoryModel/tree')
}

/* 获取工艺编号列表 */
export function getProcessNo(params) {
  return request({
    url: '/dataconfig/processNo/listByPage',
    method: 'get',
    params
  })
}

export function getWorkOrderInfo(params) {
  return request({
    url: `/plan/workOrderSchedule/listByPage`,
    method: "get",
    params,
  });
}