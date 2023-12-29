/*
 * @Author: zhixinJ
 * @Date: 2023-04-04 10:14:06
 * @Desc: 人员管理
 */
import request from '@/utils/request/request'

// 查询
export function listPerson(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/Person/list',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

// 新增人员
export function addPerson(data) {
  return request({
    url: '/Person/addPerson',
    method: 'post',
    requestBaseUrl: 'JINGJI',
    data: data
  })
}

// 删除人员
export function delPerson(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/Person/deletePersonById/' + id,
    method: 'delete',
    requestBaseUrl: 'JINGJI'
  })
}

// 修改人员
export function updatePerson(data) {
  return request({
    url: '/Person/updatePerson',
    method: 'put',
    requestBaseUrl: 'JINGJI',
    data
  })
}
