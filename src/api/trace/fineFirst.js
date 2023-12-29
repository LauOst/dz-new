import request from '@/utils/request/request'

// 查询
export function listTraceFineFirst(data) {
  return request({
    url: '/traceFineFirst/page',
    method: 'post',
    requestBaseUrl: 'TRACE',
    data: data
  })
}

// 详情
export function detailTraceFineFirst(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/traceFineFirst/info/workpiece',
    method: 'get',
    requestBaseUrl: 'TRACE',
    params: query
  })
}
