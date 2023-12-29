import request from '@/utils/request/request'

// 查询列表
export function listDipcoate(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/dipcoatng',
    method: 'get',
    params: query
  })
}

// 库存修正
export function updateDipcoate(data) {
  return request({
    url: '/warehouse/putdipcoatng',
    method: 'put',
    data: data
  })
}
