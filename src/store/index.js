import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters.js'
import user from './modules/user'
import window from './modules/window'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    window,
    permission,
  },
  getters
})

export default store
