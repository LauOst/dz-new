import request from '@/utils/request/request'

// 查询
export function listTraceMill(data) {
  return request({
    url: '/traceMill/page',
    method: 'post',
    requestBaseUrl: 'TRACE',
    data: data
  })
}
// 详情
export function detailTraceMill(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/traceMill/info/workpiece',
    method: 'get',
    requestBaseUrl: 'TRACE',
    params: query
  })
}
