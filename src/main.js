import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import App from './App.vue'
import routes from './router'
import storeConfig from './store'

Vue.config.productionTip = false
import '@/assets/icon-font/iconfont'
import './assets/icon-font/iconfont.css'

Vue.component('scroll', () => import('@/components/common/scroll/scroll'))
Vue.component('timers', () => import('@/components/content/timers/timers'))
Vue.component('navbar', () => import('@/components/common/navbar/NavBar'))

import lrz from 'lrz'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

import { setJurisdiction } from '@/common/utils'
Vue.prototype.$Jurisdiction = setJurisdiction

import Vant, { Toast, Dialog, Lazyload } from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)

Vue.use(Toast)

Vue.use(Lazyload, {
  lazyComponent: true,
  loading: '@/assets/image/Default.png',
})

Vue.prototype.$dialog = Dialog

import FastClick from 'fastclick'
FastClick.attach(document.body)

Vue.prototype.$bus = new Vue()

import dataV from '@jiaminghi/data-view'
Vue.use(dataV)

import * as filter from './common/filter'
Object.keys(filter).forEach((item) => {
  Vue.filter(item, filter[item])
})

import VueCompositionAPI from '@vue/composition-api'
Vue.use(VueCompositionAPI)

Vue.use(Vuex)
const store = new Vuex.Store(storeConfig)

Vue.use(VueRouter)
const router = new VueRouter({
  routes,
})

import './assets/css/style.scss'

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!window.localStorage) {
      alert('浏览器不支持localstorage')
    } else {
      var storage = window.localStorage
      let tokenStr = JSON.parse(storage.getItem('token'))
      if (!tokenStr) {
        return next('/login')
      } else {
        return next()
      }
    }
  } else {
    return next()
  }
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
