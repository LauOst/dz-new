import request from '@/utils/request/request'
/**
 * TCP指令相关api
 */

// 分页查询TCP指令列表
export function getCmdTcp(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/cmdTcp',
    method: 'get',
    params: query
  })
}

// 添加TCP指令
export function addCmdTcp(data) {
  return request({
    url: '/cmdTcp',
    method: 'post',
    data: data
  })
}

// 修改TCP指令
export function updateCmdTcp(data) {
  return request({
    url: '/cmdTcp/update',
    method: 'put',
    data: data
  })
}

// 根据id查询TCP指令
export function getCmdTcpById(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/cmdTcp/' + id,
    method: 'get'
  })
}

// 分页查询TCP指令列表
export function getCmdTcpItem(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/cmdTcp/Item',
    method: 'get',
    params: query
  })
}

// 添加TCP指令Item值
export function addCmdTcpItem(data) {
  return request({
    url: '/cmdTcp/Item',
    method: 'post',
    data: data
  })
}

// 修改字典item值
export function updateCmdTcpItem(data) {
  return request({
    url: '/cmdTcp/Item',
    method: 'put',
    data: data
  })
}

// 查询字典item值列表
export function getCmdTcpItemById(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/cmdTcp/Item/' + id,
    method: 'get'
  })
}

// 删除字典item值
export function delDictItem(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/cmdTcp/Item/' + id,
    method: 'delete'
  })
}

// 删除字典
// export function delDict(id) {
//   return request({
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     url: '/cmdTcp/' + id,
//     method: 'delete'
//   })
// }

