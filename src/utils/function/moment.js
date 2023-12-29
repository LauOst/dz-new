// 引入 moment 时间插件
import moment from 'moment'
// 获取今日的开始结束时间
export function getToday() {
  const arr = []
  arr[0] = moment(moment().startOf('day').valueOf()).format('YYYY-MM-DD')
  arr[1] = moment(moment().valueOf()).format('YYYY-MM-DD')
  return arr
}
export function getTodayTime() {
  const arr = []
  arr[0] = moment(moment().startOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss')
  arr[1] = moment(moment().valueOf()).format('YYYY-MM-DD HH:mm:ss')
  return arr
}
export function getTodayTimeEnd() {
  const arr = []
  arr[0] = moment(moment().startOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss')
  arr[1] = moment(moment().endOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss')
  // arr[1] = moment(moment().valueOf()).format('YYYY-MM-DD HH:mm:ss')
  return arr
}
// 获取昨日的开始结束时间
export function getYesterday() {
  // let obj = {
  //   starttime: '',
  //   endtime: ''
  // }
  const arr = []
  arr[0] = moment(moment().add(-1, 'days').startOf('day').valueOf()).format('YYYY-MM-DD')
  arr[1] = moment(moment().add(-1, 'days').endOf('day').valueOf()).format('YYYY-MM-DD')
  return arr
}
// 获取当前周的开始结束时间
export function getCurrWeekDays() {
  const arr = []
  arr[0] = moment(moment().week(moment().week()).startOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD')
  arr[1] = moment(moment().week(moment().week()).endOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD')
  return arr
}
// 获取上一周的开始结束时间
export function getLastWeekDays() {
  const arr = []
  arr[0] = moment(moment().week(moment().week() - 1).startOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD')
  arr[1] = moment(moment().week(moment().week() - 1).endOf('week').add(1, 'days').valueOf()).format('YYYY-MM-DD')
  return arr
}
// 获取当前月的开始结束时间
export function getCurrMonthDays() {
  const arr = []
  arr[0] = moment(moment().month(moment().month()).startOf('month').valueOf()).format('YYYY-MM-DD')
  arr[1] = moment(moment().month(moment().month()).endOf('month').valueOf()).format('YYYY-MM-DD')
  return arr
}
// 获取上一个月的开始结束时间
export function getLastMonthDays() {
  const arr = []
  arr[0] = moment(moment().month(moment().month() - 1).startOf('month').valueOf()).format('YYYY-MM-DD')
  arr[1] = moment(moment().month(moment().month() - 1).endOf('month').valueOf()).format('YYYY-MM-DD')
  return arr
}

// 获取从当前时间之一个月开始结束时间
export function getMonthDays() {
  const arr = []
  arr[0] = moment().subtract(30, 'days').format('YYYY-MM-DD')
  arr[1] = moment().format('YYYY-MM-DD')
  return arr
}

// 获取从当前时间之一个月开始结束时间
export function getMonthWeeks() {
  const arr = []
  arr[0] = moment().subtract(7, 'days').format('YYYY-MM-DD')
  arr[1] = moment().format('YYYY-MM-DD')
  return arr
}

// 获取从当前时间之一个月开始结束时间
export function getAddYear(time, step = 1) {
  return moment(time).add(step, 'year').format('YYYY-MM-DD')
}
export function getAddMonths(time, step = 1) {
  return moment(time).add(step, 'months').format('YYYY-MM-DD')
}
export function getAddWeeks(time, step = 1) {
  return moment(time).add(step, 'w').format('YYYY-MM-DD')
}
export function getMonths(time) {
  return moment(time).add('months').format('YYYY-MM')
}
