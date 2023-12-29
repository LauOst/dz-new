/*
 * @Author: zhixinJ
 * @Date: 2023-09-05 14:13:00
 * @Desc:
 */
import request from '@/utils/request/request'

// 查询列表
export function detailRobotModel(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dzRobotModel/param/info',
    method: 'get',
    params: query
  })
}

// 修改
export function updateRobotModel(data) {
  return request({
    url: '/dzRobotModel/param/upd',
    method: 'post',
    data: data
  })
}

// 发送
export function sendRobotModel(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dzRobotModel/param/send',
    method: 'get',
    params: query
  })
}
