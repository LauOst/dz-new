import request from '@/utils/request/request'

/**
 * @Description:
 * @Author: Lau
 * @Date: 2021/12/6 3:59 下午
 */

// 新增设备
export function getIntelligent(data) {
  return request({
    url: '/charts/data/center/intelligent/detection',
    method: 'post',
    data: data
  })
}
