import { login, logout, getInfo } from '@/api/user'
import { getToken, removeToken, setToken, setSub, getSub, removeSub, getCode, setCode, removeCode } from '@/utils/function/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // token信息
    sub: getSub(), // 用户账号
    code: getCode(), // 用户账号
    name: '', // 用户名称
    avatar: '', // 用户头像
    roles: [], // 用户拥有的权限
    userIdentity: 0, // 用户身份
    departName: '', // 用户所属站点
    departId: '', // 用户归属站点id
    permissions: [], // 权限
    sysConfig: '', // 公司
    useOrgCode: '', // 站点code
    affiliationDepartId: '', // 账号归属id
    imgUploadAction: process.env.VUE_APP_BASE_API + '/api/user/uplaod'
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  /** 存储token信息 */
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  /** 存储用户账号 */
  SET_SUB: (state, sub) => {
    state.sub = sub
  },
  /** 存储用户账号 */
  SET_CODE: (state, code) => {
    state.code = code
  },
  /** 存储用户账名称 */
  SET_NAME: (state, name) => {
    state.name = name
  },
  /** 存储用户头像 */
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  /** 存储用户权限 */
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  /** 存储用户身份 */
  SET_USERIDENTITY: (state, userIdentity) => {
    state.userIdentity = userIdentity
  },
  /** 存储用户所属站点 */
  SET_USERDEPARTNAME: (state, departName) => {
    state.departName = departName
  },
  /** 用户归属站点id */
  SET_USERDEPARTID: (state, departId) => {
    state.departId = departId
  },
  /** 账号归属id */
  SET_AFFILIATIONDEPARTID: (state, affiliationDepartId) => {
    state.affiliationDepartId = affiliationDepartId
  },
  /** 权限 */
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  /** 公司 */
  SET_SYSCONFIG: (state, sysConfig) => {
    state.sysConfig = sysConfig
  },
  /** 公司 */
  SET_USEORGCODE: (state, useOrgCode) => {
    state.useOrgCode = useOrgCode
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        const { userTokenMsg: user } = data
        commit('SET_TOKEN', user.access_token)
        commit('SET_SUB', user.sub)
        commit('SET_CODE', user.code)
        setToken(user.access_token)
        setSub(user.sub)
        setCode(user.code)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { roles, permissions, sysConfig } = data
        const { realname, avatar, userIdentity, affiliationDepartId, useOrgCode } = data.user
        const ResultString = useOrgCode.split(':').join('')
        const { departName, departId } = data.user.sysDepart
        commit('SET_PERMISSIONS', permissions)
        commit('SET_NAME', realname)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_USERIDENTITY', userIdentity)
        commit('SET_USERDEPARTNAME', departName)
        commit('SET_USERDEPARTID', departId)
        commit('SET_SYSCONFIG', sysConfig)
        commit('SET_USEORGCODE', ResultString)
        commit('SET_AFFILIATIONDEPARTID', affiliationDepartId)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token, state.sub, state.code).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_SUB', '')
        commit('SET_CODE', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken() // must remove  token  first
        removeSub()
        removeCode()
        resetRouter()
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeSub()
      removeCode()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

