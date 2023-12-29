import request from '@/utils/request/request'

// 获取班次计划产量列表
export function listWorkNamePlan(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getWorkNamePlanNum',
    method: 'get',
    requestBaseUrl: 'BODA',
    params
  })
}

export function updateWorkStation(data) {
  return request({
    url: '/updateWorkStation',
    requestBaseUrl: 'BODA',
    method: 'put',
    data: data
  })
}
