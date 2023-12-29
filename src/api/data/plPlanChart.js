import request from '@/utils/request/request'

// 查询产线计划走势图数据
export function plPlanChart(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/charts/data/center/plan',
    method: 'get',
    params
  })
}
