import request from '@/utils/request/request'

// 查询工序列表
export function listProcedure(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/working/procedure',
    method: 'get',
    params
  })
}

// 新增工序
export function addProcedure(data) {
  return request({
    url: '/api/working/procedure',
    method: 'post',
    data: data
  })
}

// 修改工序
export function updateProcedure(data) {
  return request({
    url: '/api/working/procedure',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delProcedure(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/working/procedure/' + id,
    method: 'delete'
  })
}

// 工序工件列表
export function listWorkpiece(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/working/detection',
    method: 'get',
    params
  })
}

// 获取产品检测项
export function listWorkpieceTest(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/working/detection/productNo/' + id,
    method: 'get'
  })
}

// 新增工件
export function addWorkpiece(data) {
  return request({
    url: '/api/working/detection',
    method: 'post',
    data: data
  })
}

// 工序工件列表
export function listWorkpieceDetail(workProcedProductId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/working/detection/' + workProcedProductId,
    method: 'get'
  })
}

// 修改工件
export function updateWorkpiece(data) {
  return request({
    url: '/api/working/detection',
    method: 'put',
    data: data
  })
}

// 删除工件
export function delWorkpiece(workProcedProductId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/working/detection/' + workProcedProductId,
    method: 'delete'
  })
}
