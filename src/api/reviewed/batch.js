import request from '@/utils/request/request'

// 查询列表
export function listBatch(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/camera/pro/retrospectChase',
    method: 'get',
    params: query
  })
}
