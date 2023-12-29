/*
 * @Author: zhixinJ
 * @Date: 2023-03-21 16:32:05
 * @Desc: 设备生产明细
 */
import request from '@/utils/request/request'

export function listEquipmentProNumDetails(data) {
  return request({
    url: '/output/equipmentProNumDetails/page',
    method: 'post',
    data
  })
}

