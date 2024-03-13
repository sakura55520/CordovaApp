import req from '@/utils/req'

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
