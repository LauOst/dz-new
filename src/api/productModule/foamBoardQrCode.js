/*
 * @Author: zhixinJ
 * @Date: 2023-04-24 14:42:28
 * @Desc: 泡沫板二维码
 */
import request from '@/utils/request/request'

export function listfoamBoardQrCode(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/packing/getScanCode/PMB',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}
