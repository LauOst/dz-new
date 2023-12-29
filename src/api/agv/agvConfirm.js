import request from '@/utils/request/request'

// 查询agv列表
export function getAgvConfirm(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/agv/manage',
    method: 'get',
    params
  })
}
// 确认一筐来料
export function confirm(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/agv/manage',
    method: 'post',
    data
  })
}

// 判断是否来料
export function getIsHasData(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/agv/manage/isHasData',
    method: 'get',
    params
  })
}
