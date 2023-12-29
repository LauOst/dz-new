import request from '@/utils/request/request'

// 获取路由
export const getRouters = () => {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/auth/getRouters',
    method: 'get'
  })
}

// 获取消息列表
export const getTipPush = () => {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/index/getActiveTipsVo',
    method: 'get'
  })
}

// 获取消息列表
export const getTipPushMom = () => {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/mom/index/getActiveTipsVo',
    requestBaseUrl: 'MOM',
    method: 'get'
  })
}
