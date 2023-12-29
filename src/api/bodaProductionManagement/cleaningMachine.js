/*
 * @Author: zhixinJ
 * @Date: 2023-04-24 09:38:46
 * @Desc: 清洗机
 */
import request from '@/utils/request/request'

// 查询
export function listCleaningMachine(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/CleaningMachineFailureRate/list',
    method: 'get',
    requestBaseUrl: 'BODA',
    params
  })
}
