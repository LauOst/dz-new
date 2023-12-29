import request from '@/utils/request/request'

// 查询检测配置列表
export function listTest(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/detection/item',
    method: 'get',
    params: query
  })
}

// 检测项获取
export function listTestAll(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/detection/item/all',
    method: 'get',
    params: query
  })
}

// 新增检测
export function addTest(data) {
  return request({
    url: '/api/detection/item',
    method: 'post',
    data: data
  })
}

// 修改检测
export function updateTest(data) {
  return request({
    url: '/api/detection/item',
    method: 'put',
    data: data
  })
}

// 修改比对值
export function updateComparison(data) {
  return request({
    url: '/api/detection/item/contrast',
    method: 'put',
    data: data
  })
}

// 删除比对值
export function delTest(groupId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/detection/itemdel/' + groupId,
    method: 'delete'
  })
}
