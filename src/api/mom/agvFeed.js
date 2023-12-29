/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/11/5 11:25 上午
 */

import request from '@/utils/request/request'

// 查询设备列表
export function agvFeedList(params) {
  return request({
    url: '/api/mom/materialPoint/search',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 新增设备
export function addAgvFeed(data) {
  return request({
    url: '/api/mom/materialPoint/add',
    requestBaseUrl: 'MOM',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateAgvFeed(data) {
  return request({
    url: '/api/mom/materialPoint/update',
    requestBaseUrl: 'MOM',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delAgvFeed(materialPointId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestBaseUrl: 'MOM',
    url: '/api/mom/materialPoint/' + materialPointId,
    method: 'delete'
  })
}

// 查询DZICS工位
export function agvFeedStationList(params) {
  return request({
    url: '/api/mom/agv/line/station',
    method: 'get',
    params
  })
}

// 导出小车投料管理
export function downloadAgvFeed(query) {
  return request({
    responseType: 'blob',
    headers: {
      'Accept': 'application/octet-stream'
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/materialPoint/export',
    requestBaseUrl: 'MOM',
    method: 'get',
    params: query
  })
}

// 人工物流操作
export function changeAgvFeed(data) {
  return request({
    url: '/api/agv/call/material/m',
    requestBaseUrl: 'MOM',
    method: 'post',
    data: data
  })
}

// 查询AGV呼叫模式
export function agvFeedMode(params) {
  return request({
    url: '/api/mom/materialPoint/get/mom/run/model',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 修改AGV呼叫模式
export function updateAgvMode(data) {
  return request({
    url: '/api/mom/materialPoint/put/mom/run/model',
    requestBaseUrl: 'MOM',
    method: 'put',
    data: data
  })
}

// 料框编号绑定
export function bindAgvCode(data) {
  return request({
    url: '/api/mom/materialPoint/put/mom/farmCode',
    requestBaseUrl: 'MOM',
    method: 'put',
    data: data
  })
}

// 查询料框物料详情
export function agvFeedBindList(params) {
  return request({
    url: '/api/mom/materialPoint/get/mom/farm/materials',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 查询料框物料详情
export function agvFeedInnerList(params) {
  return request({
    url: '/api/mom/materialPoint/put/mom/farm/materials',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 移动小车
export function agvFeedInnerMove(data) {
  return request({
    url: '/api/mom/materialPoint/put/mom/farm/materials/remove',
    requestBaseUrl: 'MOM',
    method: 'put',
    data: data
  })
}
