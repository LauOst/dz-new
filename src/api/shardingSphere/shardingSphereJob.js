/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/11/23 1:57 下午
 */
import request from '@/utils/request/request'

// 触发
export function trigger(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/' + data.jobName + '/trigger',
    method: 'post',
    data: data
  })
}

// 终止
export function shutdown(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/' + data.jobName + '/shutdown',
    method: 'post',
    data: data
  })
}

// 生效
export function enable(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/' + data.jobName + '/enable',
    method: 'post',
    data: data
  })
}

// 失效
export function disable(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/' + data.jobName + '/disable',
    method: 'post',
    data: data
  })
}

// 删除
export function remove(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/config/' + data.jobName,
    method: 'delete'
  })
}

// 获取配置列表
export function getJobConfig(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/config/' + data.jobName,
    method: 'get'
  })
}

// 修改
export function updateEquipment(data) {
  return request({
    url: '/api/jobs/config',
    method: 'put',
    data: data
  })
}

// 作业纬度详情
export function getJobDetail(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/' + data.jobName + '/sharding',
    method: 'get'
  })
}

// 失效
export function disableDetail(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/' + data.jobName + '/sharding/' + data.item + '/disable',
    method: 'post',
    data: data
  })
}

// 生效
export function enableDetail(data) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/' + data.jobName + '/sharding/' + data.item + '/enable',
    method: 'post',
    data: data
  })
}
