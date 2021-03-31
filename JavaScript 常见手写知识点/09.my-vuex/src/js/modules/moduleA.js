let moduleA = {
    state: {
        nameA: '我是模块A'
    },
    mutations: {
        syncSetA(state, param) {
            state.nameA = param
        }
    },
    actions: {
        asyncSetState({ commit }, param) {
            setTimeout(() => {
                commit('syncSetA', param)
            }, 1000)
        }
    },
    getters: {
        getA(state) {
            return state.nameA
        }
    },
    modules:{
        moduleC:{
            state: {
                nameC: '我是模块C'
            },
            mutations: {
                syncSetC(state, param) {
                    state.nameC = param
                }
            },
            actions: {
                asyncSetState({ commit }, param) {
                    setTimeout(() => {
                        commit('syncSetC', param)
                    }, 1000)
                }
            },
            getters: {
                getC(state) {
                    return state.nameC
                }
            },
        }
        
    }
}
export default moduleA