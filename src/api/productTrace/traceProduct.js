import request from '@/utils/request/request'

// 查询订单
export function listTraceProduct(data) {
  return request({
    url: '/api/trace/workingFlow/page',
    method: 'post',
    data: data
  })
}
