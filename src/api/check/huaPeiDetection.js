/*
 * @Author: zhixinJ
 * @Date: 2023-05-26 16:52:36
 * @Desc:
 */
import request from '@/utils/request/request'

// 查询检测记录列表
// export function listTestRecord(query) {
//   return request({
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     url: '/pieceData/page',
//     method: 'get',
//     requestBaseUrl: 'HUAPEI',
//     params: query
//   })
// }

export function listTestRecord(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/pieceData/page',
    method: 'get',
    requestBaseUrl: 'HUAPEI',
    params: query
  })
}

