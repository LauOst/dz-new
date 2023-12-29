import request from '@/utils/request/request'

// 查询产线列表
export function getLine(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line',
    method: 'get',
    params
  })
}

// 新增产线
export function postLine(data) {
  return request({
    url: '/line',
    method: 'post',
    data
  })
}

// 编辑产线
export function updateLine(data) {
  return request({
    url: '/line',
    method: 'put',
    data: data
  })
}

// 根据id查询产线详情
export function getLineById(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/' + id,
    method: 'get'
  })
}

// 根据id查询产线详情
// export function getLineByOrderId(id) {
//   return request({
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     url: '/line/getByOrderId/' + id,
//     method: 'get'
//   })
// }

// 根据产线id查询设备列表
export function getLineByEquipment(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/getEquipmentByLineId/' + id,
    method: 'get'
  })
}

// 删除产线
export function delLine(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/line/' + id,
    method: 'delete'
  })
}

// 绑定产线统计产量的设备
export function updateEquipment(data) {
  return request({
    url: '/line/bing/equipment',
    method: 'put',
    data: data
  })
}
