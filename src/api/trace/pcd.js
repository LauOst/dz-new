import request from '@/utils/request/request'

// 查询
export function listTracePcd(data) {
  return request({
    url: '/tracePcd/page',
    method: 'post',
    requestBaseUrl: 'TRACE',
    data: data
  })
}

// 详情
export function detailTracePcd(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/tracePcd/info/workpiece',
    method: 'get',
    requestBaseUrl: 'TRACE',
    params: query
  })
}
