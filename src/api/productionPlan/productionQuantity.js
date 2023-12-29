import request from '@/utils/request/request'

// 设备生产数量明细列表
export function listeQuantity(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/daily/report',
    method: 'get',
    params: query
  })
}

export function downloadQuantity(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/daily/report/order/file',
    method: 'get',
    params: query
  })
}
