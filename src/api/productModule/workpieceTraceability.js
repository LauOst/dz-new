import request from '@/utils/request/request'

export function listStationTraceability(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/retrospect',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}

export function detailTraceability(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/retrospect/' + id,
    requestBaseUrl: 'SHANTIAN',
    method: 'get'
  })
}
