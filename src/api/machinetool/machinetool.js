import request from '@/utils/request/request'

// 分页查询机床列表
export function getTool(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/tool',
    method: 'get',
    params
  })
}

// 修改机床
export function updateTool(data) {
  return request({
    url: '/tool',
    method: 'put',
    data: data
  })
}

// 根据id查询机床
export function getToolById(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/tool/' + id,
    method: 'get'
  })
}

// 机床历史数据列表
export function getToolAll(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/toolData',
    method: 'get',
    params
  })
}

// 机器人停机数据列表
export function getToolShut(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/toolDow',
    method: 'get',
    params
  })
}

// 根据机器人序号查询机器人停机记录详情
export function getToolShutByNo(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/toolDow/getByEquipmentNo',
    method: 'get',
    params
  })
}
