/**
 * @Description:
 * @Author: Lau
 * @Date: 2022/2/12 11:00 AM
 */
import request from '@/utils/request/request'

// 查询列表
export function listAlarmConfig(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/alarm/config/device',
    method: 'get',
    params: query
  })
}

// 新增
export function addAlarmConfig(data) {
  return request({
    url: '/api/alarm/config/device',
    method: 'post',
    data: data
  })
}

// 修改
export function updateAlarmConfig(data) {
  return request({
    url: '/api/alarm/config/device',
    method: 'put',
    data: data
  })
}

// 删除站点
export function delAlarmConfig(alarmConfigId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/alarm/config/device/' + alarmConfigId,
    method: 'delete'
  })
}

// 查询警告类型
export function listAlarmType(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dict/item/getItemListByCode',
    method: 'get',
    params: query
  })
}
