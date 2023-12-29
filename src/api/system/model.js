import request from '@/utils/request/request'

// 查询运行模式
export function model(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/system/run/model',
    method: 'get',
    params: query
  })
}

// 修改运行模式
export function updateModel(data) {
  return request({
    url: '/api/system/run/model',
    method: 'put',
    data: data
  })
}

export function updateRefresh(data) {
  return request({
    url: '/api/refresh',
    method: 'post',
    data: data
  })
}
