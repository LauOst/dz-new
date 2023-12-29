import request from '@/utils/request/request'

// 产品生产明细列表
export function listProductionDetails(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/production/details',
    method: 'get',
    params: query
  })
}
