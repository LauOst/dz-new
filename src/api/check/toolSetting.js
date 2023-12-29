import request from '@/utils/request/request'

// 查询刀具配置列表
export function getToolList(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/getToolConfigureList',
    method: 'get',
    params
  })
}

// 查询所有刀具组
export function getToolGroupsAll(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/getToolGroupsAll',
    method: 'get',
    params
  })
}

// 根据产线查询机床列表
export function getEquipmentByLine(lineId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/getEquipmentByLine/' + lineId,
    method: 'get'
  })
}

// 根据刀具组id查询所有刀具
export function getToolByEqIdAndGroupNo(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/getToolByEqIdAndGroupNo',
    method: 'get',
    params
  })
}

// 新增刀具
export function addToolConfigure(data) {
  return request({
    url: '/api/product/check/addToolConfigure',
    method: 'post',
    data
  })
}

// 修改刀具组
export function putToolConfigure(data) {
  return request({
    url: '/api/product/check/putToolConfigure',
    method: 'put',
    data: data
  })
}

// 查询刀具详细
export function getToolConfigureById(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/getToolConfigureById/' + id,
    method: 'get'
  })
}

// 删除刀具
export function delToolConfigure(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/product/check/delToolConfigure/' + id,
    method: 'delete'
  })
}
