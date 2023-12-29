/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/10/12 3:09 下午
 */
import request from '@/utils/request/request'

// 查询设备列表
export function listEquipmentStatus(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/equipment/state',
    method: 'get',
    params
  })
}
// 是否显示
export function changeEquipmentStatus(data) {
  return request({
    url: '/api/equipment/state',
    method: 'put',
    data: data
  })
}
