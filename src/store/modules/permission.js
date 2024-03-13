import { getPermission } from '@/api/login'

const state = {
  arrMenu: [],
  arrButton: [],
  arrNotification: [],
  hasGetRules: false,
}

const mutations = {
  SET_ARRBUTTON(state, button) {
    state.arrButton = button
  },
  SET_ARRMENU(state, menu) {
    state.arrMenu = menu
    state.hasGetRules = true
  },
  SET_ARRNOTIFICATION(state, notification) {
    state.arrNotification = notification
  },
}

const actions = {
  getPermission({ commit }, id) {
    return getPermission(id).then(res => {
      const menu = res.data.filter(item => item.type === 'menu' && item.code.includes('pda_')).map(item => item.code)
      const buttons = res.data.filter(item => item.type === 'button' && item.code.includes('pda_')).map(item => item.code)
      const notification =  res.data.filter(item => item.type === 'notification').map(ele => ele.code)
      commit('SET_ARRBUTTON', buttons)
      commit('SET_ARRMENU', menu)
      commit('SET_ARRNOTIFICATION', notification)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
