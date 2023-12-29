import request from '@/utils/request/request'

// 查询不合格检测项
export function listUnqualified(data) {
  return request({
    url: '/workpieceData/getUnQualified',
    method: 'post',
    requestBaseUrl: 'CPK',
    data: data
  })
}

// 查询不合格检测项
export function listDevice(data) {
  return request({
    url: '/workpieceData/getUnQualifiedDevice',
    method: 'post',
    requestBaseUrl: 'CPK',
    data: data
  })
}
