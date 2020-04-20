import Vue from 'vue'
import Vuex from 'vuex'
import getDataDictionary from './modules/getDataDictionary'
import getters from './getters.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    getDataDictionary
  },
  getters
})