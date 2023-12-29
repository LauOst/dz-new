
import request from '@/utils/request/request'

// 查询巡检列表
export function regularList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzicsMaintenancePatrol/list',
    requestBaseUrl: 'MOM',
    method: 'get',
    params
  })
}

// 新增巡检
export function addRegular(data) {
  return request({
    url: '/api/dzicsMaintenancePatrol/add',
    requestBaseUrl: 'MOM',
    method: 'post',
    data
  })
}

// 编辑巡检
export function updateRegular(data) {
  return request({
    url: '/api/dzicsMaintenancePatrol/edit',
    requestBaseUrl: 'MOM',
    method: 'put',
    data: data
  })
}

// 确认处理
export function confirmRegular(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzicsMaintenancePatrol/headle/' + id,
    requestBaseUrl: 'MOM',
    method: 'put'
  })
}

// 删除巡检
export function delRegular(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzicsMaintenancePatrol/remove/' + id,
    requestBaseUrl: 'MOM',
    method: 'delete'
  })
}
