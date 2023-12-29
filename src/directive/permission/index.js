import hasPermi from './hasPermi'
import hasShow from './hasShow'

const install = function(Vue) {
  Vue.directive('hasPermi', hasPermi)
  Vue.directive('hasShow', hasShow)
}

if (window.Vue) {
  window['hasPermi'] = hasPermi
  window['hasShow'] = hasShow
  Vue.use(install); // eslint-disable-line
}

export default install
