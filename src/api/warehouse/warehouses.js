import request from '@/utils/request/request'

// 查询仓库列表
export function listWarehouse(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/queryList',
    method: 'get',
    params: query
  })
}

// 查询仓库下来列表
export function listWarehouseSelect(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/queryAllWarehouse',
    method: 'get',
    params: query
  })
}

// 新增仓库
export function addWarehouse(data) {
  return request({
    url: '/warehouse',
    method: 'post',
    data: data
  })
}

// 删除仓库
export function delWarehouse(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/delWarehouse',
    method: 'delete',
    params: query
  })
}

// 根据key查询仓库详情
export function listWarehouseDetail(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/getByKey',
    method: 'get',
    params: query
  })
}

// 修改仓库
export function updateWarehouse(data) {
  return request({
    url: '/warehouse/putWare',
    method: 'put',
    data: data
  })
}
