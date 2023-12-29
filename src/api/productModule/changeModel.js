import request from '@/utils/request/request'

export function listChangeModel(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/change',
    method: 'get',
    requestBaseUrl: 'WARN',
    params: query
  })
}
export function selectChangeModel(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/change/all/equipments',
    method: 'get',
    requestBaseUrl: 'WARN',
    params: query
  })
}

export function selectChangeModelProducts(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/change/all/products',
    method: 'get',
    requestBaseUrl: 'WARN',
    params: query
  })
}

// 新增角色
export function addChangeModel(data) {
  return request({
    url: '/api/product/change',
    method: 'post',
    requestBaseUrl: 'WARN',
    data: data
  })
}

// 修改角色
export function updateChangeModel(data) {
  return request({
    url: '/api/product/change',
    method: 'put',
    requestBaseUrl: 'WARN',
    data: data
  })
}

// 删除角色
export function delChangeModel(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/alarm/dzicsProjectRecord/' + id,
    requestBaseUrl: 'WARN',
    method: 'delete'
  })
}

// 发送
export function sendChangeModel(data) {
  return request({
    url: '/api/product/change/send/rob',
    method: 'post',
    requestBaseUrl: 'WARN',
    data: data
  })
}
