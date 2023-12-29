/*
 * @Author: zhixinJ
 * @Date: 2023-04-04 14:40:12
 * @Desc: 工位追溯
 */

import request from '@/utils/request/request'

// 查询
export function listStationTrace(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/StationTraceability/list',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

// 删除二维码
export function delCode(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/StationTraceability/deleteComponetCodeById/' + id,
    method: 'delete',
    requestBaseUrl: 'JINGJI'
  })
}
