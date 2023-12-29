import request from '@/utils/request/request'

// 查询
export function listAddress(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/url/mange',
    method: 'get',
    requestBaseUrl: 'HZ',
    params
  })
}

export function updateAddress(data) {
  return request({
    url: '/api/url/mange',
    method: 'put',
    requestBaseUrl: 'HZ',
    data: data
  })
}
