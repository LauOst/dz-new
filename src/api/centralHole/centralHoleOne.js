import request from '@/utils/request/request'

// 查询(OP10)
export function centreHoleOne(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/traceRough/centreHole',
    method: 'get',
    requestBaseUrl: 'TRACE',
    params: query
  })
}

// 查询(OP50)
export function centreHoleFive(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/traceFineFirst/centreHole',
    method: 'get',
    requestBaseUrl: 'TRACE',
    params: query
  })
}
