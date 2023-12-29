import request from '@/utils/request/request'

// 查询
export function listPointCode(data) {
  return request({
    url: '/traceLoad/page',
    method: 'post',
    requestBaseUrl: 'TRACE',
    data: data
  })
}
