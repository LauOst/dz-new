import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocalefrom from 'element-ui/lib/locale/lang/en'
import zhLocalefrom from 'element-ui/lib/locale/lang/zh-CN'
import thLocalefrom from 'element-ui/lib/locale/lang/th'
import enLocale from '../lang/en' // 引入本地en.js
import zhLocale from '../lang/zh' // 引入本地zh.js
import thLocale from '../lang/th' // 引入本地zh.js
import locale from 'element-ui/lib/locale'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh',
  messages: {
    'en': {
      ...enLocale,
      ...enLocalefrom
    },
    'zh': {
      ...zhLocale,
      ...zhLocalefrom
    },
    'th': {
      ...thLocalefrom,
      ...thLocale
    }
  }
})

locale.i18n((key, value) => i18n.t(key, value))

export default i18n // 务必export i18n
