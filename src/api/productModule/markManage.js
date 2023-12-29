import request from '@/utils/request/request'

// 查询列表
export function getMarkManagelList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzMarkingPrefix',
    requestBaseUrl: 'HL',
    method: 'get',
    params
  })
}

// 查询记录列表
export function getMarkRecordList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzMarkingLog',
    requestBaseUrl: 'HL',
    method: 'get',
    params
  })
}

// 查询产线列表
export function getMarkManageMes(mesOrderNo) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/dzMarkingPrefix/getMes/' + mesOrderNo,
    requestBaseUrl: 'HL',
    method: 'get'
  })
}

// 新增
export function addMarkManage(data) {
  return request({
    url: 'api/dzMarkingPrefix',
    method: 'post',
    requestBaseUrl: 'HL',
    data: data
  })
}

// 发送
export function sendMarkManage(data) {
  return request({
    url: '/api/dzMarkingPrefix/sendRob',
    method: 'post',
    requestBaseUrl: 'HL',
    data: data
  })
}
