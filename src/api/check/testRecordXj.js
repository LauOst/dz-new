import request from '@/utils/request/request'

// 查询检测记录列表
export function listTestRecordXj(data) {
  return request({
    url: '/workpieceData/page',
    requestBaseUrl: 'CHECK',
    method: 'post',
    data
  })
}

// 检测模板列表
export function listTestcheckConfig(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getAllDetectionTemplate',
    requestBaseUrl: 'CHECK',
    method: 'get',
    params: query
  })
}

// 编辑检测模板
export function updateTestcheckConfig(data) {
  return request({
    url: '/updateDetectionTemplate',
    requestBaseUrl: 'CHECK',
    method: 'put',
    data: data
  })
}

// 导出OP60
export function downloadTestRecordXj(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/workpieceData/export',
    requestBaseUrl: 'CHECK',
    method: 'post',
    data: data
  })
}
