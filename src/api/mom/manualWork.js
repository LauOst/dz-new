/*
 * @Author: zhixinJ
 * @Date: 2022-07-15 08:03:00
 * @Desc: 人工报工
 */
import request from '@/utils/request/request'

// MOM报工响应列表
export function getReport(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/report/query',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 重发
export function putReport(data) {
  return request({
    url: '/api/report/repeat',
    requestBaseUrl: 'MOM',
    method: 'put',
    data
  })
}

// 新增报工
export function addReport(data) {
  return request({
    url: '/api/upWork/add',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 获取二维码
export function getCood(data) {
  return request({
    url: '/api/upWork/qrCode',
    method: 'post',
    requestBaseUrl: 'MOM',
    data: data
  })
}
