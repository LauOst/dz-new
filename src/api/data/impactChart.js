import request from '@/utils/request/request'

// 查询稼动率走势图数据
export function impactChart(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/charts/data/center/activation',
    method: 'get',
    params
  })
}
