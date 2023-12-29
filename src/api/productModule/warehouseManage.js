/*
 * @Author: zhixinJ
 * @Date: 2023-04-20 10:40:45
 * @Desc: 库位管理
 */
import request from '@/utils/request/request'

export function listWarehouse(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/warehouse',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}

// 新增库位
export function addWarehouse(data) {
  return request({
    url: '/api/warehouse',
    method: 'post',
    requestBaseUrl: 'SHANTIAN',
    data: data
  })
}

// 修改库位
export function updateWarehouse(data) {
  return request({
    url: '/api/warehouse',
    method: 'put',
    requestBaseUrl: 'SHANTIAN',
    data: data
  })
}

// 库位详情
export function detailWarehouse(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/warehouse/details',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}

// 清库
export function clearWarehouse(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/warehouse/rob/clearHouse',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}
