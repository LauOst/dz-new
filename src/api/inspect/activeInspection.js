
import request from '@/utils/request/request'

// 查询巡检列表
export function activeList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzicsMaintenancePatrol/active/list',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 新增巡检
export function addActive(data) {
  return request({
    url: '/api/dzicsMaintenancePatrol/active/add',
    requestBaseUrl: 'MOM',
    method: 'post',
    data
  })
}

// 编辑巡检
export function updateActive(data) {
  return request({
    url: '/api/dzicsMaintenancePatrol/active/edit',
    requestBaseUrl: 'MOM',
    method: 'put',
    data: data
  })
}

// 删除巡检
export function delActive(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzicsMaintenancePatrol/active/remove/' + id,
    requestBaseUrl: 'MOM',
    method: 'delete'
  })
}
