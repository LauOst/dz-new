import request from '@/utils/request/request'

// 查询产线列表
export function getAbnormalList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/throw/WorkReport',
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

// 重发
export function getAbnormalReset(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/throw/WorkReport/repeat/' + id,
    method: 'post',
    requestBaseUrl: 'HZ'
  })
}
