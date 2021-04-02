// my-vuex.js 
// 封装后的精简版，含有 state,getters, mutations/commit, actions/dispat moudles方法
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
        // 初始化数据
        this.options = options  
        this.getters = {}
        this.mutations = {}
        this.actions = {}
        
        // 调用commit方法 ,循环调用mutations上的方法
        this.commit = (type, payload) => { 
            this.mutations[type].forEach(fn => fn(payload))
        }

        // 调用dispatch方法 执行修改state状态
        this.dispatch = (type, payload) => {
            this.actions[type].forEach(fn => fn(payload))
        }

        //------------格式化成一个模块状态树-------------
        this._modules = new moduleCollection(options)

        //------------安装状态树-------------
        installModule(this, options.state, undefined, this._modules.root);

        // 利用vue自身提供的data响应式机制
        this.vmData = { state: Vue.observable(options.state || {}) }
    }
    get state() {
        return this.vmData.state
    }
}

// 收集store.js中的数据
class moduleCollection {
    constructor(rootModule) {
        this.root = {}
        this.register(undefined, rootModule, {})
    }
    register(moduleName, rootModule, parent) {
        const newModule = {
            _rootModule: rootModule, // 根模块 
            _children: {}, // 子模块
            state: rootModule.state // 根模块状态
        }
        if (JSON.stringify(parent) === '{}' && !moduleName) {
            this.root = newModule
        } else {
            parent._children[moduleName] = newModule
        }
        if (rootModule.modules) {
            forEachValue(rootModule.modules, (rootChildModule, moduleName) => {
                // console.log(rootChildModule, moduleName);
                this.register(moduleName, rootChildModule, newModule)
            })
        }
    }
}

// 递归状态树,挂载getters,actions,mutations
function installModule(store, rootState, key, rootModule) {
    //1. 模块中的state循环出来设置到根state中去,以便通过this.$store.state.moduleA来访问数据
    if (key) { // 若无key表示是根store上的state
        Vue.set(rootState, key, rootModule.state)
    }
    // 2.循环注册包含模块内的所有getters
    let getters = rootModule._rootModule.getters
    if(getters){
        forEachValue(getters, (fn, key) => {
            registerGetter(store,fn,key,rootModule);
        });
    }
  
    // 3.循环注册包含模块内的所有mutations
    let mutations = rootModule._rootModule.mutations
    if (mutations) {
        forEachValue(mutations, (fn, key) => {
            registerMutation(store, fn, key, rootModule);
        });
    }

    // 4.循环注册包含模块内的所有actions
    let actions = rootModule._rootModule.actions
    if (actions) {
        forEachValue(actions, (fn, key) => {
            registerAction(store, fn, key, rootModule);
        });
    }
    forEachValue(rootModule._children, (child, key) => {
        installModule(store, rootModule.state, key, child)
    })
}


//初始化 getter
function registerGetter(store, fn, key, currentModule) {
    Object.defineProperty(store.getters, key, {
        get: () => { return fn.call(store, currentModule.state) }
    })
}

//初始化 mutations
function registerMutation(store, fn, key, currentModule) {
    let ArrList = store.mutations[key] || (store.mutations[key] = []);
    ArrList.push((payload) => {
        fn.call(store, currentModule.state, payload)
    })
}
//初始化 action
function registerAction(store, fn, key) {
    let ArrList = store.actions[key] || (store.actions[key] = []);
    ArrList.push((payload) => {
        fn.call(store, store, payload)
    })
}

// 公共的方法
function forEachValue(object, fn) {
    Object.keys(object).forEach((key) => {
        fn(object[key], key)
    })
}

// 辅助函数

export const mapState = stateList => {
    return stateList.reduce((prev, stateName) => {
        prev[stateName] = function () {
            return this.$store.state[stateName]
        }
        return prev
    }, {})
}
export const mapGetters = gettersList => {
    return gettersList.reduce((prev, gettersName) => {
        prev[gettersName] = function () {
            return this.$store.getters[gettersName]
        }
        return prev
    }, {})
}

export const mapMutations = mutationsList => {
    return mutationsList.reduce((prev, mutationsName) => {
        prev[mutationsName] = function (payload) {
            return this.$store.commit(mutationsName, payload)
        }
        return prev
    }, {})
}

export const mapActions = actionsList => {
    return actionsList.reduce((prev, actionsName) => {
        prev[actionsName] = function (payload) {
            return this.$store.dispatch(actionsName, payload)
        }
        return prev
    }, {})
}

export default {
    install,
    Store
}