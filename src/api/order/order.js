import request from '@/utils/request/request'

// 查询站点列表
export function getDepart(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/depart',
    method: 'get',
    params
  })
}

// 新增订单
export function postOrder(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}

// 查询订单
export function getOrder(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/order',
    method: 'get',
    params
  })
}

// 修改订单
export function updateOrder(data) {
  return request({
    url: '/order',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delOrder(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/order/' + id,
    method: 'delete'
  })
}
