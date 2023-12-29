import request from '@/utils/request/request'

// 查询

export function listMake(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getMannoList',
    method: 'get',
    requestBaseUrl: 'PERSON',
    params
  })
}
