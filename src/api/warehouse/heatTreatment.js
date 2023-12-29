import request from '@/utils/request/request'

// 查询仓库列表
export function listHeattreatment(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/warehouse/getStorageLocation',
    method: 'get',
    params: query
  })
}

// 16件是否允许出库
export function updateHeattreatment(data) {
  return request({
    url: '/warehouse/switchoverState',
    method: 'put',
    data: data
  })
}
