/*
 * @Author: zhixinJ
 * @Date: 2023-04-26 09:41:13
 * @Desc: 组件批次
 */
import request from '@/utils/request/request'

// 组件批次查询列表
export function listWorkStaionProd(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/ComponentBatch/getWorkStaionProdList',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

// 产品下组件批次列表
export function detailCompontBatch(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/ComponentBatch/getCompontBatchDetailsList',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

// 产品下组件批次详情修改
export function updateCompontBatchDetail(data) {
  return request({
    url: '/ComponentBatch/updateCompontBatchDetail',
    method: 'post',
    requestBaseUrl: 'JINGJI',
    data: data
  })
}

// 新增组件批次
export function addStationProds(data) {
  return request({
    url: '/ComponentBatch/insertWorkStationProds',
    method: 'post',
    requestBaseUrl: 'JINGJI',
    data: data
  })
}

// 新增组件批次
export function addCompontBatch(data) {
  return request({
    url: '/ComponentBatch/addCompontBatchDetail',
    method: 'post',
    requestBaseUrl: 'JINGJI',
    data: data
  })
}
// 删除
export function deleteCompontBatch(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/ComponentBatch/deleteCompontBatchDetailById/' + id,
    method: 'delete',
    requestBaseUrl: 'JINGJI'
  })
}

// 删除工位绑定批次产品
export function deleteWorkStationProds(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/ComponentBatch/deleteWorkStationProds/' + id,
    method: 'delete',
    requestBaseUrl: 'JINGJI'
  })
}
