import {getCurrentUserInfo, login} from '@/api/login'
import {getToken, removeToken, setToken} from '@/utils/auth'
import window from "@/store/modules/window";

const user = {
  state: {
    token: getToken(),
    realName: sessionStorage.getItem('realName') || '',
    id: sessionStorage.getItem('userId') || '',
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REALNAME: (state, realName) => {
      state.realName = realName
    },
    SET_ID: (state, id) => {
      state.id = id
    },
  },
  actions: {
    // 登录
    Login({commit}, data) {
      return login(data).then(res => {
        setToken(res.data)
        commit('SET_TOKEN', res.data)
      })
    },
    getCurrentUserInfo({commit}) {
      return getCurrentUserInfo().then(res => {
        sessionStorage.setItem('realName', res.data.realName)
        sessionStorage.setItem('userId', res.data.id)
        sessionStorage.setItem('userWorkNo', res.data.workNo)
        commit('SET_REALNAME', res.data.realName)
        commit('SET_ID', res.data.id)
      })
    },
    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        commit('SET_REALNAME', '')
        removeToken()
        sessionStorage.clear()
        resolve()
      })
    },
  }
}

export default user
