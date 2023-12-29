import request from '@/utils/request/request'

// 查询刀具组
export function getProductCheck(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check',
    method: 'get',
    params: query
  })
}

// 新增刀具组
export function postProductCheck(data) {
  return request({
    url: '/api/product/check',
    method: 'post',
    data
  })
}

// 修改刀具组
export function updateProductCheck(data) {
  return request({
    url: '/api/product/check',
    method: 'put',
    data: data
  })
}

// 删除刀具组
export function delProductCheck(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/' + id,
    method: 'delete'
  })
}

// 新增刀具
export function postToolInfo(data) {
  return request({
    url: '/api/product/check/addToolInfo',
    method: 'post',
    data
  })
}

// 修改刀具
export function updateToolInfo(data) {
  return request({
    url: '/api/product/check/putToolInfo',
    method: 'put',
    data: data
  })
}

// 删除刀具
export function delToolInfo(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/delToolInfo/' + id,
    method: 'delete'
  })
}

// 根据刀具组id查询刀具列表
export function getProductCheckById(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/toolGroupsId',
    method: 'get',
    params
  })
}
