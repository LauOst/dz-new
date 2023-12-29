/*
 * @Author: zhixinJ
 * @Date: 2022-07-15 08:03:00
 * @Desc:
 */
import request from '@/utils/request/request'

// 分页查询订单
export function appointList(data) {
  return request({
    url: '/api/mom/order/query',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 开始订单
export function appointStart(data) {
  return request({
    url: '/api/mom/order/start',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 暂停订单
export function appointStop(data) {
  return request({
    url: '/api/mom/order/stop',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 恢复订单
export function appointRecover(data) {
  return request({
    url: '/api/mom/order/recover',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 关闭订单
export function appointClose(data) {
  return request({
    url: '/api/mom/order/forceclose',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 作废订单
export function appointDel(proTaskOrderId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/order/delete/' + proTaskOrderId,
    method: 'delete',
    requestBaseUrl: 'MOM'
  })
}

// 订单状态变更
export function appointChange(data) {
  return request({
    url: '/api/mom/order/updState',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 切换订单
export function appointToggle(type) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/mode/manualMode/' + type,
    method: 'post',
    requestBaseUrl: 'MOM'
  })
}

// 模式
export function appointMode(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/mode/mode',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 重发
export function forwardOrder(proTaskOrderId) {
  return request({
    url: '/api/mom/order/forwardOrder/' + proTaskOrderId,
    method: 'put',
    requestBaseUrl: 'MOM'
  })
}
