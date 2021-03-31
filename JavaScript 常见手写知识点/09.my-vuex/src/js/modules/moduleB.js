let moduleB = {
    state: {
        nameB: '我是模块B'
    },
    mutations: {
        syncSetB(state, param) {
            state.nameB = param
        }
    },
    actions: {
        asyncSetState({ commit }, param) {
            setTimeout(() => {
                commit('syncSetB', param)
            }, 1000)
        }
    },
    getters: {
        getB(state) {
            return state.nameB
        }
    }
}

export default moduleB