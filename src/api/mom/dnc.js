import request from '@/utils/request/request'

// 查询设备列表
export function dncProgramList(params) {
  return request({
    url: '/dncProgram',
    method: 'get',
    requestBaseUrl: 'MOM',
    params
  })
}

// 重发
export function updateDncProgram(data) {
  return request({
    url: '/dncProgram/repeat',
    method: 'put',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 取消
export function cancelDncProgram(data) {
  return request({
    url: '/dncProgram/cancel',
    method: 'put',
    requestBaseUrl: 'MOM',
    data: data
  })
}

// 输入主程序号
export function inputDncProgram(data) {
  return request({
    url: '/dncProgram/manual',
    method: 'put',
    requestBaseUrl: 'MOM',
    data: data
  })
}
