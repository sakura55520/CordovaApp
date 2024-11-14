import request from '@/utils/req'

// 在制品查询站点
export function getCurrentWipStorageData(processingOrderCode) {
  return request({
    url: '/wipStorage/getCurrentWipStorageData?processingOrderCode=' + processingOrderCode,
    method: 'get'
  })
}

export function getCurrentWipStorageClearData(processingOrderCode) {
  return request({
    url: `/wipStorage/getCurrentWipStorageData?processingOrderCode=${processingOrderCode}&extParam=clearDefaultData`,
    method: 'get'
  })
}
