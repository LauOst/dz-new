import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import { resetForm, addDateRange, initDate, mySort, downloadFunc, timeAnaly, doorTime } from '@/utils/function/dz'
import {
  getMonthDays,
  getToday,
  getTodayTime,
  getAddYear,
  getAddMonths,
  getAddWeeks,
  getMonths,
  getMonthWeeks,
  getTodayTimeEnd
} from '@/utils/function/moment'
import { param } from '@/utils/function/index'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import utils from '@/utils/index' // 全局方法
import '@/utils/function/dialogdrag' // 弹窗拖动方法
import permission from '@/directive/permission'
// import VueSocketIO from 'vue-socket.io'

// 引入主题文件
import './theme/index.css'
import '@/icons' // icon
import '@/permission' // permission control
// import Pagination from '@/components/Pagination' // 分页
import DzTable from '@/components/DzTable' // 表格
import DzForm from '@/components/DzForm' // 表单
import Packer from '@/components/Packer' // 时间
import StartDate from '@/components/StartDate' // 开始时间
import EndDate from '@/components/EndDate' // 结束时间
import RightToolbar from '@/components/RightToolbar' // 自定义表格工具扩展
// import flexNative from 'flex-native' // flex兼容ie9
import supportIE from '@/utils/function/placeholder'
import hasPermise from '@/utils/function/hasPermise'
import md5 from 'js-md5'
import * as echarts from 'echarts'
import i18n from './i18n/i18n' // 引入本地配置的i18n.js‘

Vue.use(permission)
// Vue.use(flexNative)
Vue.use(supportIE)
Vue.use(hasPermise)

// set ElementUI
Vue.use(ElementUI, { locale })

// Vue.use(new VueSocketIO({
//   // 控制台调试 console.log
//   debug: false,
//   // 连接地址 后端提供
//   connection: process.env.VUE_APP_IO_BASE_API
// }))

// 挂载全局方法
Vue.prototype.$Dz = utils
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.getMonthDays = getMonthDays
Vue.prototype.getMonthWeeks = getMonthWeeks
Vue.prototype.getToday = getToday
Vue.prototype.getTodayTime = getTodayTime
Vue.prototype.getTodayTimeEnd = getTodayTimeEnd
Vue.prototype.getAddYear = getAddYear
Vue.prototype.getAddMonths = getAddMonths
Vue.prototype.getAddWeeks = getAddWeeks
Vue.prototype.getMonths = getMonths
Vue.prototype.param = param
Vue.prototype.initDate = initDate
Vue.prototype.$echarts = echarts
Vue.prototype.$mySort = mySort
Vue.prototype.$downloadFunc = downloadFunc
Vue.prototype.$timeAnaly = timeAnaly
Vue.prototype.$doorTime = doorTime
Vue.prototype.$md5 = md5

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}

// 全局组件挂载
/*
Pagination 分页
RightToolbar 表格小工具
* */
// Vue.component('Pagination', Pagination)
Vue.component('DzTable', DzTable)
Vue.component('DzForm', DzForm)
Vue.component('Packer', Packer)
Vue.component('StartDate', StartDate)
Vue.component('EndDate', EndDate)
Vue.component('RightToolbar', RightToolbar)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
