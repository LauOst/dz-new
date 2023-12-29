import request from '@/utils/request/request'

// 查询设备列表
export function listEquipment(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment',
    method: 'get',
    params
  })
}

// 查询设备详细
export function getEquipment(equipmentId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/' + equipmentId,
    method: 'get'
  })
}

// 新增设备
export function addEquipment(data) {
  return request({
    url: '/equipment',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updateEquipment(data) {
  return request({
    url: '/equipment',
    method: 'put',
    data: data
  })
}

// 删除设备
export function delEquipment(equipmentId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/equipment/' + equipmentId,
    method: 'delete'
  })
}

// 修改相机(删除)
export function updateCamera(data) {
  return request({
    url: '/equipment/definitionType',
    method: 'put',
    data: data
  })
}

// 修改相机(删除)
export function updateLineTest(data) {
  return request({
    url: '/equipment/putLintType',
    method: 'put',
    data: data
  })
}

// 是否显示
export function changeStatus(id, isShow) {
  const data = {
    id,
    isShow
  }
  return request({
    url: '/equipment/putIsShow',
    method: 'put',
    data: data
  })
}
