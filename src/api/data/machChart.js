import request from '@/utils/request/request'

// 查询运行率走势图数据
export function machChart(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/charts/data/center/processing/beat',
    method: 'get',
    params
  })
}

// 设备生产分时数据
export function sharChart(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/charts/data/center/productionTime',
    method: 'get',
    params
  })
}
