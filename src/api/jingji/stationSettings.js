/*
 * @Author: zhixinJ
 * @Date: 2023-04-04 10:14:06
 * @Desc: 工位设置
 */
import request from '@/utils/request/request'

// 查询
export function listStation(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/WorkStation/list',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

// 查询
export function AllListStation() {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/Person/allList',
    method: 'get',
    requestBaseUrl: 'JINGJI'
  })
}

// 修改人员
export function updateWorkStation(data) {
  return request({
    url: '/WorkStation/updateWorkStation',
    method: 'put',
    requestBaseUrl: 'JINGJI',
    data
  })
}
