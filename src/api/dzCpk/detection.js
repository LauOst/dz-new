import request from '@/utils/request/request'

// 查询不合格检测项
export function listDetection(data) {
  return request({
    url: '/workpieceData/getProductionSituation',
    method: 'post',
    requestBaseUrl: 'CPK',
    data: data
  })
}
