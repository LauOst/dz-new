
import { getOrderSelect } from '@/api/commens'
const getDefaultState = () => {
  return {
    orderList: [], // 订单列表
    startTimes: '',
    endTimes: ''
  }
}

const state = getDefaultState()

const mutations = {
  /** 存储订单信息 */
  SET_ORDERLIST: (state, orderList) => {
    state.orderList = orderList
  },
  /** 存储开始时间 */
  SET_STARTTIMES: (state, startTimes) => {
    state.startTimes = startTimes
  },
  /** 存储开始时间 */
  SET_ENDTIMES: (state, endTimes) => {
    state.endTimes = endTimes
  }
}

const actions = {
  // get user info
  orderList({ commit }) {
    return new Promise((resolve, reject) => {
      getOrderSelect().then(response => {
        const { data } = response
        commit('SET_ORDERLIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

