import request from '@/utils/request/request'

// 查询告警管理列表
export function listAlarmManage(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/getAlarmConfigList',
    requestBaseUrl: 'PERSON',
    method: 'get',
    params: query
  })
}

// 新增告警管理
export function addAlarmManage(data) {
  return request({
    url: '/addAlarmConfig',
    requestBaseUrl: 'PERSON',
    method: 'post',
    data: data
  })
}

// 修改告警管理
export function updateAlarmManage(data) {
  return request({
    url: '/updateAlarmConfig',
    requestBaseUrl: 'PERSON',
    method: 'put',
    data: data
  })
}

// 删除告警管理
export function delAlarmManage(alarmNo) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/deleteAlarmConfig/' + alarmNo,
    requestBaseUrl: 'PERSON',
    method: 'delete'
  })
}
