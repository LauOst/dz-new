import request from '@/utils/request/request'

// 设备生产数量明细列表
export function listeQuipment(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/production/equipment',
    method: 'get',
    params: query
  })
}

// 设备生产数量详情列表
export function listeQuipmentDetails(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/production/equipment/listDetails',
    method: 'get',
    params: query
  })
}

