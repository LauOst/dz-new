import request from '@/utils/request/request'

// 分页查询机器人列表
export function getRobot(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/robot',
    method: 'get',
    params
  })
}

// 新增机器人
export function postEquipment(data) {
  return request({
    url: '/equipment',
    method: 'post',
    data
  })
}

// 修改机器人
export function updateRobot(data) {
  return request({
    url: '/robot',
    method: 'put',
    data: data
  })
}

// 根据id查询机器人
export function getRobotById(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/robot/' + id,
    method: 'get'
  })
}

// 机器人历史数据列表
export function getRobotAll(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/robotData',
    method: 'get',
    params
  })
}

// 机器人停机数据列表
export function getRobotShut(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/robotDow',
    method: 'get',
    params
  })
}

// 根据机器人序号查询机器人停机记录详情
export function getRobotShutByNo(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/robotDow/getByEquipmentNo',
    method: 'get',
    params
  })
}
