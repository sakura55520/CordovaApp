import router from './router'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import querystring from 'querystring'

// 不重定向白名单
const whiteList = [
  '/login'
]
router.beforeEach(async(to, from, next) => {
  const { search } = location
  if (search) {
    const { t, from } = querystring.parse(search.substring(1))
    if (t) setToken(t)
    await store.dispatch('setFromPC', from === 'pc')
  }

  let token = getToken()
  if (!token) {
    if (whiteList.indexOf(to.path) !== -1) next()
    else next({ name: 'login' })
    return
  }

  let userId = store.state.user.id
  if (!userId) {
    await store.dispatch('getCurrentUserInfo')
    userId = store.state.user.id
  }

  if (!store.state.permission.hasGetRules) {
    await store.dispatch('getPermission', userId)
  }

  if (to.name === 'login') {
    next({ name: 'dashboard' })
    return
  }

  // 处理动态表单无法初始化页面标题问题
  const toRoute = router.resolve(to).route;
  const fromRoute = router.resolve(from).route;
  if(toRoute.meta.text === '动态表单' && fromRoute.meta.text === '过站操作'){
    toRoute.meta.text = fromRoute.meta.station
    toRoute.meta.params = fromRoute.meta.params
    next()
  }else{
    next()
  }

})
