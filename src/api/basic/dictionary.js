import req from '@/utils/req'

// 获取枚举值
export function getEnumDict(enumName) {
  return req({
    url: '/coreTool/getEnumDict?enumName=' + enumName,
    method: 'get',
  })
}
