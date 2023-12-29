/*
 * @Author: zhixinJ
 * @Date: 2023-09-05 13:39:56
 * @Desc:
 */
import request from '@/utils/request/request'

// 查询列表
export function listRobotModel(data) {
  return request({
    url: '/dzRobotModel/page',
    method: 'post',
    data: data
  })
}

// 新增
export function addRobotModel(data) {
  return request({
    url: '/dzRobotModel/add',
    method: 'post',
    data: data
  })
}

// 详情
export function detailRobotModel(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dzRobotModel/info',
    method: 'get',
    params: query
  })
}

// 修改
export function updateRobotModel(data) {
  return request({
    url: '/dzRobotModel/upd',
    method: 'post',
    data: data
  })
}

// 删除
export function delRobotModel(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dzRobotModel/del',
    method: 'get',
    params
  })
}

