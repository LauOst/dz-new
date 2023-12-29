import request from '@/utils/request/request'

// 查询订单
export function listProductionTask(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/order',
    method: 'get',
    params: query
  })
}

// 新增订单
export function addProductionTask(data) {
  return request({
    url: '/api/mom/order',
    method: 'post',
    data: data
  })
}

// 查询组件物料详情
export function detailProductionTask(workingProcedureId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/order/' + workingProcedureId,
    method: 'get'
  })
}
// 开始订单
export function startOrder(data) {
  return request({
    url: '/api/mom/order',
    method: 'put',
    data: data
  })
}

// 强制关闭
export function closeOrder(data) {
  return request({
    url: '/api/mom/order/force/close',
    method: 'put',
    data: data
  })
}

// 暂停订单
export function stopOrder(data) {
  return request({
    url: '/api/mom/order/order/stop',
    method: 'put',
    data: data
  })
}

// 恢复订单
export function recoveryOrder(data) {
  return request({
    url: '/api/mom/order/order/recover',
    method: 'put',
    data: data
  })
}

// 作废
export function delOrder(proTaskOrderId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/order/order/' + proTaskOrderId,
    method: 'delete'
  })
}
