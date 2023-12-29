// 查询
import request from '@/utils/request/request'

export function listPerson(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/ChargePerson/getChargePerson',
    method: 'get',
    requestBaseUrl: 'PERSON',
    params: query
  })
}

// 修改角色
export function updatePerson(data) {
  return request({
    url: '/api/ChargePerson/updateChargePersonById',
    method: 'put',
    requestBaseUrl: 'PERSON',
    data: data
  })
}
