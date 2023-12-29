import request from '@/utils/request/request'

// 查询站点列表
export function listDepart(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/depart',
    method: 'get',
    params: query
  })
}

// 查询站点详细
export function getDepart(departId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/depart/' + departId,
    method: 'get'
  })
}

// 新增站点
export function addDepart(data) {
  return request({
    url: '/api/user/depart',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateDepart(data) {
  return request({
    url: '/api/user/depart',
    method: 'put',
    data: data
  })
}

// 获取树形结构
export function departMenuTreeselect(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/depart/msg',
    method: 'get',
    params: {
      departId: query
    }
  })
}

// 删除站点
export function delDepart(departId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/depart/' + departId,
    method: 'delete'
  })
}

// 查询可切换站点
export function switchSite(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/auth/you/can/switch/site',
    method: 'get',
    params: query,
    permissions: 'system:depart:show'
  })
}

// 站点状态修改
export function changeDepartStatus(departId, status) {
  const data = {
    departId,
    status
  }
  return request({
    url: '/api/user/disable/enabled/depart',
    method: 'put',
    data: data
  })
}
