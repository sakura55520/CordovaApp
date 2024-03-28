import req from '@/utils/req'
import store from '@/store'

// 获取当前用户有权限的线边仓模型树状图
export function getPermissionWarehouseTree(params){
  return req({
    url: '/warehouse/model/permission/tree',
    method: 'get',
    params: {
      userId: store.getters.userId
    }
  })
}
