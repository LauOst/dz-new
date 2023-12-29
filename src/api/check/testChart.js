import request from '@/utils/request/request'

// 查询走势图数据
export function listTestcheck(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/trend',
    method: 'get',
    params: query
  })
}

// 根据产品id查询检测项
export function getByProductId(productId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/trend/getByProductId/' + productId,
    method: 'get'
  })
}

// 根据站点id查询产品列表
export function getDepartId() {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/trend/getDepartId/',
    method: 'get'
  })
}

// 上传base64图片
export function uplaodBase64(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/uplaod/base64',
    method: 'post',
    data
  })
}

// 导出检测走势图
export function getExportTrend(params) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/exp/check/manage/trend',
    method: 'get',
    params
  })
}
