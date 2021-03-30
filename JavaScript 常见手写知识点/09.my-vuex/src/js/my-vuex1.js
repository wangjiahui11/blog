// my-vuex.js 初始版本  含有 state,getters, mutations/commit, actions/dispat方法
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
        console.log('options--------------:', options);
        this.vmData = {
            state: Vue.observable(options.state || {})
        }

        // ---------------初始化getters--------------
        this.getters = {}
        // 遍历store上的getters
        Object.keys(options.getters).forEach(key => {
            //为getters里所有的函数定义get时执行的操作
            Object.defineProperty(this.getters, key, {
                get: () => {
                    return options.getters[key](this.vmData.state)
                }
            })
        })

        // ---------------实现mutation和commit方法--------------
        this.mutations = {}
        // 遍历store上的mutations
        Object.keys(options.mutations).forEach(key => {
            //为mutations里所有的函数定义时执行的操作
            this.mutations[key] = (payload) => options.mutations[key](this.vmData.state, payload)
        })
        // 调用commit方法 执行修改state状态
        this.commit = (type, payload) => {
            this.mutations[type](payload)
        }

        // ---------------实现action和dispatch方法--------------
        this.actions = {}
        // 遍历store上的actions
        Object.keys(options.actions).forEach(key => {
            //为actions里所有的函数定义时执行的操作
            this.actions[key] = (payload) => options.actions[key](this, payload)
        })
        // 调用dispatch方法 执行修改state状态
        this.dispatch = (type, payload) => {
            this.actions[type](payload)
        }
    }
    get state() {
        return this.vmData.state
    }
}
export default {
    install,
    Store
}