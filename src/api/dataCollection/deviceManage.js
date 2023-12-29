import request from '@/utils/request/request'

// 查询设备列表
export function getdzDataDevice(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/collection/dzDataDevice',
    method: 'get',
    params
  })
}

// 新增设备
export function adddzDataDevice(data) {
  return request({
    url: '/collection/dzDataDevice',
    method: 'post',
    data: data
  })
}

// 修改设备
export function updatedzDataDevice(data) {
  return request({
    url: '/collection/dzDataDevice',
    method: 'put',
    data: data
  })
}

// 删除设备
export function deldzDataDevice(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/collection/dzDataDevice/' + id,
    method: 'delete'
  })
}

// 查询工序列表
export function listProcedure(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/collection/dzDataDevice/getDzEquipment',
    method: 'get',
    params
  })
}
