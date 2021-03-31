// my-vuex.js 
// 封装后的精简版，含有 state,getters, mutations/commit, actions/dispat方法
let Vue
const install = _Vue => {
    // vue.use()执行的时候，会将vue实例作为参数传入进来，这里我们用一个变量接收
    Vue = _Vue
    // Vue.mixin帮助我们全局混入$store
    Vue.mixin({
        beforeCreate() {
            // 这里的this指的是vue实例
            const options = this.$options
            // console.log(options,'options');
            if (options.store) {
                // 判断当前组件内部是否定义了store，如果有则优先使用内部的store
                this.$store = typeof options.store === 'function' ? options.store() : options.store
            } else if (options.parent && options.parent.$store) {
                // 组件内部没有定义store,则从父组件下继承$store方法
                this.$store = options.parent.$store
            }
        }
    })
}

class Store {
    constructor(options = {}) {
        this.options = options  
        // 利用vue自身提供的data响应式机制
        this.vmData = { state: Vue.observable(options.state || {}) }

        // ---------------初始化getters--------------
        this.getters = {}
        // 遍历store上的getters
        forEachValue(options.getters, (fn, key) => {
            registerGetters(this, fn, key)
        })

        // ---------------实现mutation和commit方法--------------
        this.mutations = {}
        // 遍历store上的mutations
        forEachValue(options.mutations, (fn, key) => {
            registerMutation(this, fn, key)
        })
        // 调用commit方法 执行修改state状态
        this.commit = (type, payload) => { this.mutations[type](payload) }

        // ---------------实现action和dispatch方法--------------
        this.actions = {}
        // 遍历store上的actions
        forEachValue(options.actions, (fn, key) => {
            registerAction(this, fn, key)
        })
        // 调用dispatch方法 执行修改state状态
        this.dispatch = (type, payload) => { this.actions[type](payload) }
    }
    get state() {
        return this.vmData.state
    }
}
// 公共的方法
function forEachValue(object, fn) {
    Object.keys(object).forEach((key) => {
        fn(object[key], key)
    })
}

//初始化 getter
function registerGetters(store, fn, key) {
    Object.defineProperty(store.getters, key, {
        get: () => { return fn.call(store, store.vmData.state) }
    })
}
//初始化 mutations
function registerMutation(store, fn, key) {
    store.mutations[key] = (payload) => fn.call(store, store.vmData.state, payload)
}
//初始化 action
function registerAction(store, fn, key) {
    store.actions[key] = (payload) => fn.call(store, store, payload)
}
export default {
    install,
    Store
}