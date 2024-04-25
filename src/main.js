// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/lee.scss'
import "@/styles/index.scss"
import App from './App'
import router from './router'
import store from './store'
// import '@/icons' // icon
import '@/permission' // 权限
import VueScroller from 'vue-scroller'
import fabric from 'fabric';
import { hoursFromNow } from '@/utils/tool'
import moment from 'moment'
import 'moment/locale/zh-cn'
import Direction from 'vue-direction-key'

// import 'babel-polyfill'
import '@/icons' // icons
import '@/utils/update.js'
import apiBase from '@/api/global/apiBase.js'
import '@/utils/app'
import trim from '@/directive/trim' // 去除两边空格

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Treeselect from '@riophae/vue-treeselect'
import SelectUserinfo from '@/components/select_userinfo.vue'
import CodeScanner from '@/components/CodeScanner.vue'
import SelectAccessoryLife from '@/components/SelectAccessoryLife.vue'
Vue.component('Treeselect', Treeselect)
Vue.component('SelectUserinfo', SelectUserinfo)
Vue.component('CodeScanner', CodeScanner)
Vue.component('SelectAccessoryLife', SelectAccessoryLife)

// 全局修改默认配置，点击空白处不能关闭弹窗
ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.use(ElementUI)
Vue.use(VueScroller)
Vue.use(trim)
Vue.use(Direction)

Vue.config.productionTip = false
Vue.prototype.$fabric = fabric;
Vue.prototype.$hoursFromNow = hoursFromNow;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apiBase,
  router,
  store,
  components: { App },
  template: '<App/>'
})


