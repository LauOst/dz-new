import request from '@/utils/request/request'

export function listProductManage(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/manage',
    method: 'get',
    requestBaseUrl: 'WARN',
    params: query
  })
}

// 新增角色
export function addProductManage(data) {
  return request({
    url: '/api/product/manage',
    method: 'post',
    requestBaseUrl: 'WARN',
    data: data
  })
}

// 修改角色
export function updateProductManage(data) {
  return request({
    url: '/api/product/manage',
    method: 'put',
    requestBaseUrl: 'WARN',
    data: data
  })
}

// 删除角色
export function delProductManage(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/manage/' + id,
    requestBaseUrl: 'WARN',
    method: 'delete'
  })
}
