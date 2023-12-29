import request from '@/utils/request/request'

// 根据站点id查询订单列表
export function getOrderByDepartId(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/orders/depart',
    method: 'get',
    params
  })
}

// 搜索下拉框查询产线列表
export function getlineSelect(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/lines',
    method: 'get',
    params
  })
}

// 根据id查询产线(新)
export function getLineByOrderIdNew(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/getByOrderId/v2/' + id,
    method: 'get'
  })
}

// 根据id查询产线(老)
export function getLineByOrderId(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/getByOrderId/' + id,
    method: 'get'
  })
}
// 搜索下拉框查询订单列表
export function getOrderSelect(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/orders',
    method: 'get',
    params
  })
}

// 所有工件
export function getOrderWorkpiece(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/products',
    method: 'get',
    params
  })
}

// 查询设备列表
export function listProcedure(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/collection/dzDataDevice',
    method: 'get',
    params
  })
}

// 查询产线下所有设备列表
export function listDevcie(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/line/devcie',
    method: 'get',
    params
  })
}

// 查询字典item值列表
export function getDictItem(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/dict/item',
    method: 'get',
    params: query
  })
}

// 查询设备订单产线下所有设备列表
export function listLinedevice(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/order/linedevice',
    method: 'get',
    params
  })
}

// 查询产品绑定的组件物料列表
export function getMaterialId(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/product/material/' + id,
    method: 'get'
  })
}

// 查询产品绑定的组件物料列表
export function getDictItemDictCode(dictCode) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/getDictItem/' + dictCode,
    method: 'get'
  })
}

// 查询巡检列表
export function getCheckList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/commons/check/up/getList',
    method: 'get',
    params
  })
}

// 条形编码检测结果传
export function updateCheckResult(data) {
  return request({
    url: '/insertCheckResult',
    method: 'post',
    requestBaseUrl: 'PERSON',
    data: data
  })
}
