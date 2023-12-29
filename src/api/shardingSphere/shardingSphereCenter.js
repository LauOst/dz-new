/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/11/24 11:03 上午
 */
import request from '@/utils/request/request'

// 获取配置
export function getCenter(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/registry-center/load',
    method: 'get',
    params
  })
}

// 连接
export function connectCenter(data) {
  return request({
    url: '/api/registry-center/connect',
    method: 'post',
    data: data
  })
}

// 新增
export function addCenter(data) {
  return request({
    url: '/api/registry-center/add',
    method: 'post',
    data: data
  })
}

// 删除
export function removeCenter(data) {
  return request({
    url: '/api/registry-center',
    method: 'delete',
    data: data
  })
}
