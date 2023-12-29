import request from '@/utils/request/request'

// 查询日生产计划记录列表
export function listProductionPlanRecord(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/production/record',
    method: 'get',
    params: query
  })
}

// 查询日生产计划记录详情列表
export function listProductionPlanDetailsList(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    // url: '/production/record/detailsList',
    url: '/production/details',
    method: 'get',
    params: query
  })
}

