import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const userIdentity = store.getters && store.getters.userIdentity
    userIdentity === 1 ? '' : el.parentNode && el.parentNode.removeChild(el)
  }
}
