import request from '@/utils/request/request'

// 查询
export function listWorkpiece(data) {
  return request({
    url: '/workpiece/page',
    method: 'post',
    requestBaseUrl: 'TRACE',
    data: data
  })
}
