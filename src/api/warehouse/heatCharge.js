import request from '@/utils/request/request'

// 查询列表
export function listHeatCharge(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/getStorageLocation',
    method: 'get',
    params: query
  })
}

// 库存修正
export function updateHeatCharge(data) {
  return request({
    url: '/warehouse/putHeattreatment',
    method: 'put',
    data: data
  })
}
