import request from '@/utils/request/request'

// 查询不合格检测项
export function listGaussian(data) {
  return request({
    url: '/normalDistribution/data',
    method: 'post',
    requestBaseUrl: 'CPK',
    data: data
  })
}
export function listGaussianDetection(data) {
  return request({
    url: '/detectionTemplate/getDetect',
    method: 'post',
    requestBaseUrl: 'CPK',
    data: data
  })
}
