/*
 * @Author: zhixinJ
 * @Date: 2023-04-04 14:40:12
 * @Desc: 总成追溯
 */
import request from '@/utils/request/request'

// 查询
export function listAssemblyTrace(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/QrCode/getBigCodelist',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

// 查询
export function DetailAssemblyTrace(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/QrCode/getSmallCodelistByBigCode',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

// 查询
export function DetailBatchListByOrCode(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/ComponentBatch/getBatchListByOrCode',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}
