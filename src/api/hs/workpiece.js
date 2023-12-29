import request from '@/utils/request/request'

// 查询

export function listWorkpiece(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getBarcodeRoughMachiningList',
    method: 'get',
    requestBaseUrl: 'PERSON',
    params
  })
}

// 编辑工件信息
export function updateWorkpiece(data) {
  return request({
    url: '/updateBarcodeRoughMachiningStatus',
    method: 'put',
    requestBaseUrl: 'PERSON',
    data: data
  })
}

// 绑定炉号
export function bingCompLno(data) {
  return request({
    url: '/bingCompLno',
    method: 'post',
    requestBaseUrl: 'PERSON',
    data: data
  })
}

