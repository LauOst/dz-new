/*
 * @Author: zhixinJ
 * @Date: 2023-04-20 10:40:45
 * @Desc: 装箱记录
 */
import request from '@/utils/request/request'

export function listPackingRecord(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/packing',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}
