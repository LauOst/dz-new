import request from '@/utils/request/request'

// 报工列表
export function getUpWork(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/upWork',
    method: 'get',
    params
  })
}

// 根据产线ID查询工位
export function getStation(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/upWork/station',
    method: 'get',
    params
  })
}
