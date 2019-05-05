import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
// import food from './module/food'
// import order from './module/order'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    ff () {
    }
    //
  },
  modules: {
    user,
    app
    // food
  //  order
  }
})
