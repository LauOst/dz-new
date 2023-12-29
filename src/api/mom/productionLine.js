import request from '@/utils/request/request'

export function getProductionLine(data) {
  return request({
    url: '/api/line/production/data',
    method: 'post',
    data
  })
}
