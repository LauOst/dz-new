import request from '@/utils/request/request'

// 查询运行率走势图数据
export function fnChart(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/charts/data/center/operation',
    method: 'get',
    params
  })
}
