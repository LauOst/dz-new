/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/11/22 3:44 下午
 */
import request from '@/utils/request/request'

// 历史轨迹
export function getTrack(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/workHistory/trajectory',
    method: 'get',
    params
  })
}

// 历史状态
export function getStatus(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/workHistory/status',
    method: 'get',
    params
  })
}

// 作业纬度
export function getJob(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/jobs/getAllJobsBriefInfo',
    method: 'get',
    params
  })
}

