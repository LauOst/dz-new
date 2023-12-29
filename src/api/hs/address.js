import request from '@/utils/request/request'

// 查询
export function listAddress(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getMesIp',
    method: 'get',
    requestBaseUrl: 'PERSON',
    params
  })
}

export function updateAddress(data) {
  return request({
    url: '/updateMesIp',
    method: 'put',
    requestBaseUrl: 'PERSON',
    data: data
  })
}
