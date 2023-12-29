import request from '@/utils/request/request'

// 查询仓库列表
export function listTransfer(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/transfer/belt',
    method: 'get',
    params: query
  })
}

// 传输带每日详情查询
export function DetailsTransfer(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/day/details',
    method: 'get',
    params: query
  })
}
