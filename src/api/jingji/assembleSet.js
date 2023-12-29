import request from '@/utils/request/request'

// 查询
export function listAssembleStep(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/AssembleStep/list',
    method: 'get',
    requestBaseUrl: 'JINGJI',
    params
  })
}

export function addAssembleStep(data) {
  return request({
    url: '/AssembleStep/add',
    method: 'post',
    requestBaseUrl: 'JINGJI',
    data: data
  })
}

export function setNowProd(data) {
  return request({
    url: '/AssembleStep/setNowProd',
    method: 'post',
    requestBaseUrl: 'JINGJI',
    data: data
  })
}

// 修改产品
export function updateAssembleStep(data) {
  return request({
    url: '/AssembleStep/updatePerson',
    method: 'put',
    requestBaseUrl: 'JINGJI',
    data: data
  })
}

// 删除
export function deleteAssembleStep(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/AssembleStep/deleteAssembleStepById/' + id,
    method: 'delete',
    requestBaseUrl: 'JINGJI'
  })
}
