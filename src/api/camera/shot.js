import request from '@/utils/request/request'

// 查询相机数据列表
export function getShot(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/camera/Data',
    method: 'get',
    params
  })
}

// 查询相机历史数据列表
export function getShotShut(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/camera/Data/detailsList',
    method: 'get',
    params
  })
}
