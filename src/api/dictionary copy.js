import req from '@/utils/req'

export function getDictionaryItem(params) {
  return req({
    // url: '/dictionaryItem/listAll',
    url: '/dictionaryItem/findByThemeValue',
    method: 'get',
    params
  })
}
