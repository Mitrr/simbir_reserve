import Vue from 'vue'
import Vuex from 'vuex'
import userModule from './store/user'
import generalModule from './store/general'
import newsModule from './store/news'

Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
      userModule,
        generalModule,
        newsModule,
    }
})
