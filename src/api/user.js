import request from '@/utils/request/request'

export function login(data) {
  return request({
    url: '/api/user/auth/login',
    method: 'post',
    data
  })
}

export function getSite(data) {
  return request({
    url: '/api/user/auth/switch/site',
    method: 'put',
    data
  })
}

export function getInfo() {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/auth/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/auth/signout',
    method: 'DELETE'
  })
}

// 更新锁屏密码
export function updatePassword(data) {
  return request({
    url: '/api/system/run/model/update/lock/screen/password',
    method: 'put',
    data
  })
}
