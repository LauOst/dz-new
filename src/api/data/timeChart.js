import request from '@/utils/request/request'

// 分页查询机器人列表
export function timeChart(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/charts/data/center/equipment/time/analysis',
    method: 'get',
    params
  })
}
