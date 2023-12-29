import request from '@/utils/request/request'

export function listHaed(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/wetkProductHaed',
    method: 'get',
    requestBaseUrl: 'WARN',
    params: query
  })
}

// 修改角色
export function updateHaed(data) {
  return request({
    url: '/wetkProductHaed',
    method: 'put',
    requestBaseUrl: 'WARN',
    data: data
  })
}

