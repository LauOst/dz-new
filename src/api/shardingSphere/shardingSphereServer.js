import request from '@/utils/request/request'

// 获取服务器维度列表
export function getAllServers(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/servers/getAllServersBriefInfo',
    method: 'get',
    params
  })
}

// 获取服务器维度列表总数
export function getAllServersCount(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/servers/count',
    method: 'get',
    params
  })
}

// 服务器维度失效
export function ServersDisable(serverIp) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/disable`,
    method: 'post'
  })
}

// 服务器维度生效
export function ServersEnable(serverIp) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/enable`,
    method: 'post'
  })
}

// 服务器维度删除
export function ServersDelete(serverIp) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}`,
    method: 'delete'
  })
}

// 服务器维度终止
export function ServersShutdown(serverIp) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/shutdown`,
    method: 'post'
  })
}

// 根据服务器IP获取详情
export function getServersByServerIp(serverIp) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/jobs`,
    method: 'get'
  })
}

// 服务器维度详情失效
export function ServersDetailDisable(serverIp, jobName) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/jobs/${jobName}/disable`,
    method: 'post'
  })
}

// 服务器维度详情生效
export function ServersDetailEnable(serverIp, jobName) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/jobs/${jobName}/enable`,
    method: 'post'
  })
}

// 服务器维度详情删除
export function ServersDetailDelete(serverIp, jobName) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/jobs/${jobName}`,
    method: 'delete'
  })
}

// 服务器维度详情终止
export function ServersDetailShutdown(serverIp, jobName) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: `/api/servers/${serverIp}/jobs/${jobName}/shutdown`,
    method: 'post'
  })
}

