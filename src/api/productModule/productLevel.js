/*
 * @Author: zhixinJ
 * @Date: 2023-05-24 10:13:01
 * @Desc: 产品等级分布
 */
import request from '@/utils/request/request'

export function getProductLevel(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/produce/grade',
    method: 'get',
    requestBaseUrl: 'SHANTIAN',
    params: query
  })
}
