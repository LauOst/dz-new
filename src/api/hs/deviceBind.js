import request from '@/utils/request/request'

// 查询

export function listDeviceBind(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getNameDirectiveBindingList',
    method: 'get',
    requestBaseUrl: 'PERSON',
    params
  })
}

// 新增
export function addDeviceBind(data) {
  return request({
    url: '/addNameDirectiveBinding',
    method: 'post',
    requestBaseUrl: 'PERSON',
    data: data
  })
}

// 删除角色
export function delDeviceBind(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/deleteNameDirectiveBindingId/' + id,
    requestBaseUrl: 'PERSON',
    method: 'delete'
  })
}

