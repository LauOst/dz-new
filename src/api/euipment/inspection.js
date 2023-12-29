/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/10/8 1:35 下午
 */
import request from '@/utils/request/request'

// 查询巡检项记录
export function listInspect(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/device/check',
    method: 'get',
    params
  })
}

// 新增保养设备
export function addInspect(data) {
  return request({
    url: '/api/device/check',
    method: 'post',
    data: data
  })
}

// 修改保养记录
export function updateInspect(data) {
  return request({
    url: '/api/device/check',
    method: 'put',
    data: data
  })
}

// 查询巡检项记录详情
export function inspectDetails(checkHistoryId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/device/check/' + checkHistoryId,
    method: 'get'
  })
}

// 删除巡检项记录
export function delInspect(checkHistoryId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/device/check/' + checkHistoryId,
    method: 'delete'
  })
}
