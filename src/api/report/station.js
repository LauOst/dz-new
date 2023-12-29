import request from '@/utils/request/request'

// 工位列表
export function listStation(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/station',
    method: 'get',
    params
  })
}

// 新增工位
export function addStation(data) {
  return request({
    url: '/api/station',
    method: 'post',
    data: data
  })
}

// 修改工位
export function updateStation(data) {
  return request({
    url: '/api/station',
    method: 'put',
    data: data
  })
}

// 删除工位
export function delStation(id) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/station/' + id,
    method: 'delete'
  })
}

// 工位是否显示
export function updateShow(data) {
  return request({
    url: '/api/station/putShowById',
    method: 'put',
    data: data
  })
}
// 工位工件列表
export function listArtifacts(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/location/artifacts',
    method: 'get',
    params
  })
}

// 新增工位工件
export function addArtifacts(data) {
  return request({
    url: '/api/location/artifacts',
    method: 'post',
    data: data
  })
}
// 工位工件详情
export function listArtifactsD(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/location/artifacts/get',
    method: 'get',
    params
  })
}

// 工位工件编辑
export function updateArtifactsD(data) {
  return request({
    url: '/api/location/artifacts',
    method: 'put',
    data: data
  })
}

// 删除工位工件
export function delArtifacts(workStationProductId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/location/artifacts/' + workStationProductId,
    method: 'delete'
  })
}

// 获取产品检测项
export function listArtifactsTest(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/location/artifacts/productNo',
    method: 'get',
    params
  })
}
