/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/9/30 9:26 上午
 */
import request from '@/utils/request/request'

// 查询设备列表
export function listMaintain(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/maintain/record/device',
    method: 'get',
    params
  })
}

// 查看保养记录
export function recordMaintain(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/maintain/record',
    method: 'get',
    params
  })
}

// 查看保养记录详情
export function recordMaintainDetails(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/maintain/record/details',
    method: 'get',
    params
  })
}

// 新增保养设备
export function addMaintain(data) {
  return request({
    url: '/api/maintain/record/device',
    method: 'post',
    data: data
  })
}

// 修改保养记录
export function updateMaintain(data) {
  return request({
    url: '/api/maintain/record/device',
    method: 'put',
    data: data
  })
}

// 新增保养记录
export function addMaintainRecord(data) {
  return request({
    url: '/api/maintain/record',
    method: 'post',
    data: data
  })
}

// 删除设备
export function delMaintain(maintainId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/maintain/record/' + maintainId,
    method: 'delete'
  })
}
