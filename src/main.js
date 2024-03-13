// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
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
import PrintDialog from '@/views/components/printDialog'

// import 'babel-polyfill'
import '@/icons' // icons
import '@/utils/update.js'
import apiBase from '@/api/global/apiBase.js'
import '@/utils/app'
import trim from '@/directive/trim' // 去除两边空格

// 全局修改默认配置，点击空白处不能关闭弹窗
ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.use(ElementUI)
Vue.use(VueScroller)
Vue.use(trim)

Vue.config.productionTip = false
Vue.prototype.$fabric = fabric;
Vue.prototype.$hoursFromNow = hoursFromNow;

Vue.component('PrintDialog', PrintDialog)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  apiBase,
  router,
  store,
  components: { App },
  template: '<App/>'
})


