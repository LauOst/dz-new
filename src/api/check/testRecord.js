import request from '@/utils/request/request'

// 查询检测记录列表
export function listTestRecord(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/data',
    method: 'get',
    params: query
  })
}

// 导出
export function exportTestRecord(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/excel',
    method: 'get',
    params: query,
    suiyi: false
  })
}
