import request from '@/utils/request/request'

// 查询列表
export function listShotBlast(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/TreatmentInventory',
    method: 'get',
    params: query
  })
}

// 库存修正
export function updateShotBlast(data) {
  return request({
    url: '/warehouse/putTreatmentInventory',
    method: 'put',
    data: data
  })
}
