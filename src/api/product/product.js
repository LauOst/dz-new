import request from '@/utils/request/request'

// 查询站点列表
export function listProduct(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/product',
    method: 'get',
    params: query
  })
}

// 新增产品
export function addProduct(data) {
  return request({
    url: '/product',
    method: 'post',
    data: data
  })
}

// 查询产品详细
export function getProduct(productId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/product/' + productId,
    method: 'get'
  })
}

// 修改产品
export function updateProduct(data) {
  return request({
    url: '/product',
    method: 'put',
    data: data
  })
}

// 删除产品
export function delProduct(productId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/product/' + productId,
    method: 'delete'
  })
}
