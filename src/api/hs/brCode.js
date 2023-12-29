import request from '@/utils/request/request'

// 查询

export function listBrCode(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getEquipmentCompIdSeqList',
    method: 'get',
    requestBaseUrl: 'PERSON',
    params
  })
}

// 新增角色
export function updateBrCode(data) {
  return request({
    url: '/updateEquipmentCompIdSeq',
    method: 'post',
    requestBaseUrl: 'PERSON',
    data: data
  })
}
