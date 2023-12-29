import request from '@/utils/request/request'

// 查询巡检项列表
export function listCheck(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/check/up',
    method: 'get',
    params
  })
}

// 新增巡检项
export function addCheck(data) {
  return request({
    url: '/api/check/up',
    method: 'post',
    data: data
  })
}

// 编辑巡检项
export function updateCheck(data) {
  return request({
    url: '/api/check/up',
    method: 'put',
    data: data
  })
}

// 删除巡检项
export function delEquipment(checkItemId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/check/up/' + checkItemId,
    method: 'delete'
  })
}
