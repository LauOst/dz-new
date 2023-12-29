import request from '@/utils/request/request'

// 查询刀具信息数据
export function getToolInfoDataList(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/getToolInfoDataList',
    method: 'get',
    params: query
  })
}
