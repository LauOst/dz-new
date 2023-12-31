import request from '@/utils/request/request'

// 查询角色列表
export function listRole(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/role',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/api/user/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/api/user/update/role',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/role/' + roleId,
    method: 'delete'
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/api/user/disable/enabled/role',
    method: 'put',
    data: data
  })
}
