/*
 * @Author: zhixinJ
 * @Date: 2023-04-20 10:40:45
 * @Desc: 出入库记录
 */
import request from '@/utils/request/request'

export function listInventoryRecord(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/warehouse/Access/record',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}
