/*
 * @Author: zhixinJ
 * @Date: 2023-05-19 10:14:30
 * @Desc: 不合格品分布
 */
import request from '@/utils/request/request'

export function getNgProduce(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/produce/getNg',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}
