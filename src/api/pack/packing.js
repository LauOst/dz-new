import request from '@/utils/request/request'

// 查询装箱出库数据列表
export function getPack(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/encasement/record',
    method: 'get',
    params
  })
}

// 查询产品型号
export function getProductNumber(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/encasement/record/productNumber',
    method: 'get',
    params
  })
}

// 查询相机历史数据列表
export function getPackShut(params) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/encasement/record/detailsList',
    method: 'get',
    params
  })
}
