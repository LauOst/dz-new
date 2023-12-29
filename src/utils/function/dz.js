import validation from './validate'
import moment from 'moment'

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}

export function indexMethod(index) {
  const vm = this
  return (vm.queryParams.page - 1) * vm.queryParams.limit + index + 1
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  var search = params
  if (dateRange != null && dateRange !== '') {
    if (typeof (propName) === 'undefined') {
      search.startTime = dateRange[0]
      search.endTime = dateRange[1]
    } else {
      search.propName = dateRange[0]
      search.propName = dateRange[1]
    }
  } else {
    search.startTime = ''
    search.endTime = ''
  }
  return search
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || Math.min.apply(Math, data.map(item => {
    return item[parentId]
  })) || '0'
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回第一层
    return father[parentId] === rootId
  })

  return treeData !== '' ? treeData : data
}

// 添加单位，如果有px，%，px等单位结尾或者值为auto，直接返回，否则加上rpx单位结尾
export function addUnit(value = 'auto', unit = 'px') {
  // console.log(validation)
  // return 1
  value = String(value)
  return validation.number(value) ? `${value}${unit}` : value
}

// 生成随机数字加字符串方法
export function randomWord(randomFlag, min, max, num = true) {
  var str = ''
  var range = min
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var arr1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  if (!num) {
    for (var i = 0; i < range; i++) {
      var pos = Math.round(Math.random() * (arr.length - 1))
      str += arr[pos]
    }
  } else {
    for (var t = 0; t < range; t++) {
      var pos1 = Math.round(Math.random() * (arr1.length - 1))
      str += arr1[pos1]
    }
  }

  return str
}

// 时间转换方法
export function initDate(date, type) {
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }
  if (type === 1) {
    return hours + ':' + minute + ':' + second
  } else if (type === 2) {
    return year + '-' + month + '-' + day
  } else if (type === 3) {
    return year + '-' + month + '-' + day + '-' + hours + '-' + minute + '-' + second
  }
}

// 数组对对象根据对象某个属性合并其中对象
export function mergeArr(prop, ...arr) {
  if (!prop || !arr) return []
  const map = {}
  arr.forEach(item => {
    item.forEach(info => {
      if (!info) return
      const id = info[prop]
      map[id] = { ...map[id], ...info }
    })
  })
  return Object.keys(map).map(key => map[key])
}

// 调用排序方法
export function mySort(data, column, Func) {
  console.log('column', column)
  if (column.order === 'ascending') {
    column.order = 'ASC'
  } else if (column.order === 'descending') {
    column.order = 'DESC'
  }
  data.field = column.prop
  data.type = column.order

  Func()
}

// 导出文件
export function downloadFunc(res, filename) {
  const route = this.$route
  const { meta } = route
  const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }) // 构造一个blob对象来处理数据，并设置文件类型
  const fileName = filename ? filename + '-' + this.initDate(new Date(), 3) + '.xlsx' : meta.title + '-' + this.initDate(new Date(), 3) + '.xlsx'
  if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
    navigator.msSaveBlob(blob, fileName)
  } else {
    const href = URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象
    const a = document.createElement('a') // 创建a标签
    a.style.display = 'none'
    a.href = href // 指定下载链接
    a.download = fileName // 指定下载文件名
    a.click() // 触发下载
    URL.revokeObjectURL(a.href) // 释放URL对象
  }
}

// 通过秒获得当前用时 xx:xx
export function timeAnaly(timer) {
  var tempTime = moment.duration(Number(timer))
  var hours = tempTime.hours()
  var minutes = tempTime.minutes()
  var days = tempTime.days()
  if (days > 0) (days * 24) + formatNumber(hours) + ':' + formatNumber(minutes)
  return formatNumber(hours) + ':' + formatNumber(minutes)
}

function formatNumber(n) {
  if (n < 10 && n > 0) return '0' + n
  else if (n === 0) return '00'
  else return n
  // return (n < 10 && n > 0) ? '0' + n : n
}

// 通过毫秒获得当前用时 xx小时xx分xx秒
export function doorTime(timer) {
  var tempTime = moment.duration(Number(timer))
  var hours = tempTime.hours()
  var minutes = tempTime.minutes()
  var seconds = tempTime.seconds()
  var days = tempTime.days()
  if (minutes === 0 && hours === 0 && days === 0) return seconds + ' 秒'
  if (hours === 0 && days === 0) return minutes + ' 分 ' + seconds + ' 秒'
  if (days > 0) return (tempTime.days() * 24 + hours) + ' 小时 ' + minutes + ' 分 ' + seconds + ' 秒'
  if (hours > 0 && (minutes === 0 && seconds === 0)) return hours + ' 小时 '
  return hours + ' 小时 ' + minutes + ' 分 ' + seconds + ' 秒'
}

export function serverArray(arr) {
  for (var item = 0; item < arr.length; item++) {
    if (arr[item]['name'] === 'Mom') {
      arr[item]['meta'].title = '哈哈哈'
    }
    if (arr[item].children) {
      this.serverArray(arr[item].children)
    }
  }
}
