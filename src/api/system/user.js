import request from '@/utils/request/request'

// 查询用户列表
export function listUser(query) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/account/user',
    method: 'get',
    params: query
  })
}

// 取所有角色
export function getUser(userId) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/account/role',
    method: 'get',
    params: {
      userId: userId
    }
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/api/user/account/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/api/user/account/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId, usernum) {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/account/user/' + userId + '/' + usernum,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId, username, password) {
  const data = {
    userId,
    username,
    password
  }
  return request({
    url: '/api/user/account/reset/user',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status, username) {
  const data = {
    id: userId,
    status,
    username
  }
  return request({
    url: '/api/user/account/disable/enabled/user',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    url: '/api/user/info',
    method: 'get'
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/api/user/info/avatar',
    method: 'post',
    data: data
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/api/user/info',
    method: 'put',
    data: data
  })
}

// 用户密码修改
export function updateUserPwd(passwordOld, passwordNew, passwordRepeat) {
  const data = {
    passwordOld,
    passwordNew,
    passwordRepeat
  }
  return request({
    url: '/api/user/info/password',
    method: 'put',
    data: data
  })
}

