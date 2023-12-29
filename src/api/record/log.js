import request from '@/utils/request/request'
/**
 * 日志
 */

// 操作日志
export function userLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/log',
    method: 'get',
    params: query
  })
}

// 通讯日志
export function communicatLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/communication/log',
    method: 'get',
    params: query
  })
}

// MOM通讯日志
export function momCommunicatLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/momCommunicationLog',
    requestBaseUrl: 'MOM',
    method: 'get',
    params: query
  })
}

// 设备运行日志
export function equipmentStateLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipmentState/log',
    method: 'get',
    params: query
  })
}

// 通信指令日志
export function communicationTCPLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/communication/tcp/log',
    method: 'get',
    params: query
  })
}

// 登录日志
export function loginLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/log/login',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLoginLog(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/delLoginLog',
    method: 'delete',
    data
  })
}

// 删除操作日志
export function delOperLog(data) {
  return request({
    url: '/api/user/delOperLog',
    method: 'delete',
    data
  })
}

export function alarmLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/equipments/warn/log',
    method: 'get',
    params: query
  })
}

// 查询其他日志
export function otherLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzics/inside/log/inside/log/query',
    requestBaseUrl: 'MOM',
    method: 'get',
    params: query
  })
}

// DNC通讯日志
export function dncCommunicatLog(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/log/DNC/Query',
    requestBaseUrl: 'MOM',
    method: 'post',
    data
  })
}

// 设备运行日志
export function equipmentOperationLog(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/TimeAnalysis/getTimeAnalysisList',
    // requestBaseUrl: 'PERSON',
    method: 'get',
    params: query
  })
}
