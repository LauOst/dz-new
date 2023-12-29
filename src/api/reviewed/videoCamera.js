import request from '@/utils/request/request'

// 查询列表
export function listCamera(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/camera/pro',
    method: 'get',
    params: query
  })
}
