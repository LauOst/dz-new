import request from '@/utils/request/request'

// 查询产线列表
export function getSpotCheckList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/spotCheck/get/spotCheck',
    requestBaseUrl: 'HZ',
    method: 'get',
    params
  })
}

// 修改设备
export function updateSpotCheck(data) {
  return request({
    url: '/api/spotCheck/put/spotCheck',
    requestBaseUrl: 'HZ',
    method: 'put',
    data: data
  })
}

export function getSpotCheckQrCode(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/spotCheck/get/Work/QrCode',
    requestBaseUrl: 'HZ',
    method: 'get',
    params
  })
}

export function updateSpotCheckTest(data) {
  return request({
    url: '/api/spotCheck',
    requestBaseUrl: 'HZ',
    method: 'put',
    data: data
  })
}
