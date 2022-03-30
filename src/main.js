import 'bootstrap'
import 'vue-loading-overlay/dist/vue-loading.css'
import { createApp } from 'vue'
import Loading from 'vue-loading-overlay'
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import axios from 'axios' // 需安裝才可使用VueAixos去呼叫
import VueAxios from 'vue-axios' // 本質上與axios相同，安裝起來可以使用this去呼叫axios
import { date, currency } from './methods/filters'
import $httpMessageState from './methods/pushMessageState'
import App from './App.vue'
import router from './router'

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule])
})

configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true // 當輸入任何內容直接進行驗證
})

// 設定預設語系
setLocale('zh_TW')

const app = createApp(App)

app.config.globalProperties.$filters = {
  date,
  currency
}

// 正常來說不建議太多方法掛 Global，這裡可以使用 provide 來處理
app.config.globalProperties.$httpMessageState = $httpMessageState

app.use(router)
app.use(VueAxios, axios)
app.component('AdminLoading', Loading)
app.component('AdminForm', Form)
app.component('AdminField', Field)
app.component('ErrorMessage', ErrorMessage)
app.mount('#app')
