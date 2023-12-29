/*
 * @Author: zhixinJ
 * @Date: 2023-04-24 14:39:35
 * @Desc: 装箱二维码
 */
import request from '@/utils/request/request'

export function listPackingScanCode(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/packing/getScanCode/XT',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}
