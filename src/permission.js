import router from './router'
import store from '@/store'
import * as Login from "@/api/login";
import { Message } from 'element-ui'
import {getToken} from "@/utils/auth";


// 不重定向白名单
const whiteList = [
  '/login'
]
router.beforeEach(async(to, from, next) => {
  const token = getToken()
  const realName = store.state.user.realName
  const id = store.state.user.id
  if (token && realName) {
    if (!store.state.permission.hasGetRules) {
      try {
        await store.dispatch('getPermission', id)
        next({ ...to, replace: true })
      } catch (error) {
        await store.dispatch('resetToken')
        next(`/login`)
      }
    } else {
      if (to.name === 'login') {
        next({ name: 'dashboard' })
      } else {
        // 处理动态表单无法初始化页面标题问题
        const toRoute = router.resolve(to).route;
        const fromRoute = router.resolve(from).route;
        if(toRoute.meta.text === '动态表单' && fromRoute.meta.text === '过站操作'){
          toRoute.meta.text = fromRoute.meta.station
          toRoute.meta.params = fromRoute.meta.params
          next()
          return
        }else{
          next()
          return
        }
      }
    }


  } else {
    if (whiteList.indexOf(to.path) !== -1) next()
    else next({ name: 'login' })
  }
})
