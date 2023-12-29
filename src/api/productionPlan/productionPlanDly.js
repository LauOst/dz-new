import request from '@/utils/request/request'

// 查询设置列表
export function listProductionPlanDly(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/production/plan',
    method: 'get',
    params: query
  })
}

// 修改产品
export function updateProduction(data) {
  return request({
    url: '/production/plan',
    method: 'put',
    data: data
  })
}
