import request from '@/utils/request/request'

// 查询列表
export function listWork(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/camera/pro/rework/group',
    method: 'get',
    params: query
  })
}
