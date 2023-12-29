import request from '@/utils/request/request'

// 查询设备生产数据
export function chartsEqptProduction(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/charts/data/center',
    method: 'get',
    params
  })
}

// 根据产线id查询设备列表
export function getEquipmentByLineId(equipmentId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/getEquipmentByLineId/' + equipmentId,
    method: 'get'
  })
}
