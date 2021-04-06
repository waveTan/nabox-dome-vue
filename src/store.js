import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    addressInfo:{},
  },
  getters: {
    getAddressInfo(state) {
      return state.addressInfo
    }
  },
  mutations: {
    setAddressInfo(state, data) {
      state.addressInfo = data;
    },
  },
  actions: {

  }
})
