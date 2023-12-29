/*
 * @Author: zhixinJ
 * @Date: 2023-04-20 10:40:45
 * @Desc: 数据检测
 */
import request from '@/utils/request/request'

// 查询检测数据
export function listDetection(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/detection',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}

// 导出检测数据
export function downloadDetection(data) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    url: '/api/excel/detection',
    requestBaseUrl: 'SHANTIAN',
    method: 'post',
    params: data
  })
}
