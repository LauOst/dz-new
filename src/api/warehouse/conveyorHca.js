import request from '@/utils/request/request'

// 查询仓库列表
export function listHca(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/storage/list',
    method: 'get',
    params: query
  })
}

// 传输带每日详情查询
export function DetailsHca(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/storage/details',
    method: 'get',
    params: query
  })
}
