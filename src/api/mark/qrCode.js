import request from '@/utils/request/request'

// 查询打标列表
export function listMark(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/markInfo/info',
    requestBaseUrl: 'TRACE',
    method: 'get',
    params: query
  })
}

// 发送
export function sendMark(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/markInfo/send',
    requestBaseUrl: 'TRACE',
    method: 'get',
    params: query
  })
}

// 设置
export function updateMark(data) {
  return request({
    url: '/markInfo/set',
    requestBaseUrl: 'TRACE',
    method: 'post',
    data: data
  })
}
