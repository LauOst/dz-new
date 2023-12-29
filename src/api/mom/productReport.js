import request from '@/utils/request/request'

// 报工列表
export function getUpWork(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/upWork/query',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 根据产线ID查询工位
export function getStation(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/upWork/station',

    method: 'get',
    params
  })
}

// 导出生产报工
export function downloadReportWork(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/upWork/upWork',
    requestBaseUrl: 'MOM',
    method: 'get',
    params: query
  })
}

// 模式查询
export function getReportWorkMode(params) {
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
// 模式变更
export function updateReportWorkMode(data) {
  return request({
    url: '/api/mom/mode/upd',
    requestBaseUrl: 'MOM',
    method: 'post',
    data
  })
}
