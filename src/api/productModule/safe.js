import request from '@/utils/request/request'

export function listSafe(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/alarm/dzicsProjectRecord',
    method: 'get',
    requestBaseUrl: 'WARN',
    params: query
  })
}

// 新增角色
export function addSafe(data) {
  return request({
    url: '/api/alarm/dzicsProjectRecord',
    method: 'post',
    requestBaseUrl: 'WARN',
    data: data
  })
}

// 修改角色
export function updateSafe(data) {
  return request({
    url: '/api/alarm/dzicsProjectRecord',
    method: 'put',
    requestBaseUrl: 'WARN',
    data: data
  })
}

// 删除角色
export function delSafe(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/alarm/dzicsProjectRecord/' + id,
    requestBaseUrl: 'WARN',
    method: 'delete'
  })
}
