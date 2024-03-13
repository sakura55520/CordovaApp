import req from '../utils/req'
import querystring from 'querystring'

export function login(params) {
  return req({
    url: '/auth/login',
    method: 'post',
    params
  })
}

/* 获取用户信息 */
export function getCurrentUserInfo() {
  return req.get('/user/getCurrentUserInfo')
}

/* 修改密码 */
export function updatePassword(params, options = {}) {
  return req.request({
    ...options,
    url: '/auth/updatePassword',
    method: 'post',
    params
  })
}

/*获取班次列表*/
export function getClassNo(){
  return req({
    url: '/mes/getClassNo',
    method: 'get',
    myHideLoading: true
  })
}

/*获取班组列表*/
export function getClassName(){
  return req({
    url: '/mes/getClassName',
    method: 'get',
    myHideLoading: true
  })
}


/* 获取权限菜单 */
export function getPermission(id) {
  return req.get('/permission/getByUserId?userId=' + id)
}
