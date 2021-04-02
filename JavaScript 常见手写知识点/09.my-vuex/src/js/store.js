// store.js
import Vue from "vue"
import Vuex from "./my-vuex.js"
Vue.use(Vuex)
import moduleA from './modules/moduleA.js'
import moduleB from './modules/moduleB.js'
const store = new Vuex.Store({
    state: {
        text: "Hello Vuex",
        name:'hello-vue-map函数'
    },
    getters: {
        getText(state) {
            return state.text
        }
    },
    mutations: {
        syncSetText(state, playload) {
            state.text = playload
        }
    },
    actions: {
        asyncSetText({ commit }, payload ) {
            setTimeout(() => {
                commit('syncSetText', payload)
            }, 1000)
        }
    },
    modules: {
        moduleA, moduleB
    },
})

export default store