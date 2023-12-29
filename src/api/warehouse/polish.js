import request from '@/utils/request/request'

// 查询列表
export function listPolish(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/Finegrinding',
    method: 'get',
    params: query
  })
}

// 库存修正
export function updatePolish(data) {
  return request({
    url: '/warehouse/putFinegrinding',
    method: 'put',
    data: data
  })
}
