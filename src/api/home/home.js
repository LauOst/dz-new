import request from '@/utils/request/request'

export function getHomeLine(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/all/line/list',
    method: 'get',
    params
  })
}

export function getOutputAndQualified(lineId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/index/getOutputAndQualified/' + lineId,
    method: 'get'
  })
}

export function geDayAndMonthData(params, lineId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/index/geDayAndMonthData/' + lineId,
    method: 'get',
    params
  })
}
export function geEquipmentState(lineId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/index/geEquipmentState/' + lineId,
    method: 'get'
  })
}

// 告警日志列表
export function listAlarm(lineId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/index/getIndexWarnLog/' + lineId,
    method: 'get'
  })
}

// MOM日志列表
export function listMom(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/index/appoint/log',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}
