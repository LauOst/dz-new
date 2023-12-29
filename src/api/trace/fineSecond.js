import request from '@/utils/request/request'

// 查询
export function listTraceFineSecond(data) {
  return request({
    url: '/traceFineSecond/page',
    method: 'post',
    requestBaseUrl: 'TRACE',
    data: data
  })
}

// 详情
export function detailTraceFineSecond(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/traceFineSecond/info/workpiece',
    method: 'get',
    requestBaseUrl: 'TRACE',
    params: query
  })
}
