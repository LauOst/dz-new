/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/10/9 3:45 下午
 */
import request from '@/utils/request/request'

// 查询巡检项记录
export function listFault(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/fault/record',
    method: 'get',
    params
  })
}

// 新增保养设备
export function addFault(data) {
  return request({
    url: '/api/fault/record',
    method: 'post',
    data: data
  })
}

// 修改保养记录
export function updateFault(data) {
  return request({
    url: '/api/fault/record',
    method: 'put',
    data: data
  })
}

// 查询巡检项记录详情
export function faultDetails(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/fault/record/details',
    method: 'get',
    params
  })
}

// 删除设备
export function delFault(repairId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/fault/record/' + repairId,
    method: 'delete'
  })
}
