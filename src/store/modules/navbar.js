import { getTipPush, getTipPushMom } from '@/api/menu'

const getDefaultState = () => {
  return {
    notifyList: [], // 消息列表
    notifyListMom: [], // 消息列表
    totalList: []
  }
}

const state = getDefaultState()

const mutations = {
  /** 存储订单信息 */
  SET_NOTIFYLIST: (state, notifyList) => {
    state.notifyList = notifyList
  },
  SET_NOTIFYLISTMOM: (state, notifyList) => {
    state.notifyListMom = notifyList
  },
  SET_TOTALLIST: (state, totalList) => {
    state.totalList = totalList
  }

}

const actions = {
  // get user info
  getNotifyList({ commit }) {
    return new Promise((resolve, reject) => {
      getTipPush().then(response => {
        const { data } = response
        commit('SET_NOTIFYLIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getNotifyListMom({ commit }) {
    return new Promise((resolve, reject) => {
      getTipPushMom().then(response => {
        const { data } = response
        commit('SET_NOTIFYLISTMOM', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  async merge({ dispatch, commit, state }) {
    await dispatch('getNotifyList')
    await dispatch('getNotifyListMom')
    const obj = [...state.notifyList, ...state.notifyListMom]
    commit('SET_TOTALLIST', obj)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

