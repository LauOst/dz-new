import request from '@/utils/request/request'

// 查询查询字典列表
export function getDict(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dict',
    method: 'get',
    params: query
  })
}

// 新增字典
export function addDict(data) {
  return request({
    url: '/dict',
    method: 'post',
    data: data
  })
}

// 修改字典
export function updateDict(data) {
  return request({
    url: '/dict',
    method: 'put',
    data: data
  })
}

// 查询字典item值列表
export function getDictById(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dicts/' + id,
    method: 'get'
  })
}

// 新增字典item值
export function addDictItem(data) {
  return request({
    url: '/dict/item',
    method: 'post',
    data: data
  })
}

// 修改字典item值
export function updateDictItem(data) {
  return request({
    url: '/dict/item',
    method: 'put',
    data: data
  })
}

// 查询字典item值列表
export function getDictItem(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dict/item',
    method: 'get',
    params: query
  })
}

// 删除字典item值
export function delDictItem(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/dict/item/' + id,
    method: 'delete'
  })
}

// 删除字典
// export function delDict(id) {
//   return request({
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     url: '/dict/' + id,
//     method: 'delete'
//   })
// }

