import request from '@/utils/request/request'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/api/user/menu',
    method: 'get',
    params: query
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/tree/select/check/' + roleId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/tree/select',
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/api/user/menu',
    method: 'post',
    data: data
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/menu/' + menuId,
    method: 'get'
  })
}

// 编辑菜单
export function updateMenu(data) {
  return request({
    url: '/api/user/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/menu/' + menuId,
    method: 'delete'
  })
}
