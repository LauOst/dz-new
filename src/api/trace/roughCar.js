import request from '@/utils/request/request'

// 查询
export function listTraceRough(data) {
  return request({
    url: '/traceRough/page',
    method: 'post',
    requestBaseUrl: 'TRACE',
    data: data
  })
}

// 详情
export function detailTraceRough(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/traceRough/info/workpiece',
    method: 'get',
    requestBaseUrl: 'TRACE',
    params: query
  })
}
