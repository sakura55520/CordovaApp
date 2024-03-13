import req from '@/utils/req'

 //获取所有的用户
export function getUserInfoList(params){
    return req({
    url: '/user/listAll',
    method: 'get',
    params
  })
}
