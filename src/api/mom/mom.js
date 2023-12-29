import request from '@/utils/request/request'

// 分页查询订单
export function appointList(data) {
  return request({
    url: '/api/appoint/api/mom/order/query',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}
