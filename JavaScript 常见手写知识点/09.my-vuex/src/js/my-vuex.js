// my-vuex.js 
// 封装后的精简版，含有 state,getters, mutations/commit, actions/dispat方法
// 添加 module方法
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
        // ---------------初始化数据--------------
        this.options = options
        this.getters = {}
        this.mutations = {}
        this.actions = {}
        // ---------------初始化module模块--------------
        // 1.新增installModule函数, installModule主要帮助我们将格式化好的状态树注册到Store类中
        this._modules = new ModuleCollection(options)
        // console.log(this._modules.root);

        // 2.重新改造了注册函数(registerMutation、registerGetter等)以及触发函数(commit、dispatch) 。
        const state = options.state;
        installModule(this, state, null, this._modules.root);

        // 利用vue自身提供的data响应式机制
        this.vmData = { state: Vue.observable(options.state || {}) }

        console.log(this, '-----------state');

        this.commit = (type, param) => {
            this.mutations[type].forEach(fn => fn(param))
        }

        // ---------------实现action和dispatch方法--------------
        this.dispatch = (type, param) => {
            this.actions[type].forEach(fn => fn(param))
        }


    }
    get state() {
        return this.vmData.state
    }
}
// 将store格式化成下面这种格式, 形成一个模块状态树
// const newModule = {
//     // 根模块store
//     _rootModule: store,
//     // 子模块
//     _children: {
//         moduleA: {
//             _rootModule: moduleA,
//             _children: {},
//             state: moduleA.state
//         },
//         moduleB: {
//             _rootModule: moduleB,
//             _children: {},
//             state: moduleB.state
//         }
//     },
//     // 根模块状态
//     state: store.state
// }

// 收集store.js中的数据
class ModuleCollection {
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
                console.log(rootChildModule, moduleName);
                this.register(moduleName, rootChildModule, newModule)
            })
        }
    }
}

// 这儿的getters中的state是各自模块中的state
function registerGetter(store, getterName, getterFn, currentModule) {
    Object.defineProperty(store.getters, getterName, {
        get: () => {
            return getterFn.call(store, currentModule.state)
        }
    })
}

// 由于各个模块mutation存在重复情况，因此这里使用发布-订阅模式进行注册
function registerMutation(store, key, fn, currentModule) {
    let mutationArr = store.mutations[key] || (store.mutations[key] = []);
    mutationArr.push((payload) => {
        fn.call(store, currentModule.state, payload)
    })
}

// 由于各个模块action存在重复情况，因此这里使用发布-订阅模式进行注册
function registerAction(store, key, actionFn) {
    let actionArr = store.actions[key] || (store.actions[key] = []);
    actionArr.push((payload) => {
        actionFn.call(store, store, payload)
    })
}

// 递归状态树,挂载getters,actions,mutations
function installModule(store, rootState, key, rootModule) {
    // 这儿将模块中的state循环出来设置到根state中去,以便我们通过this.$store.state.moduleA来访问数据
    if (key) {
        Vue.set(rootState, key, rootModule.state)
    }
    // 循环注册包含模块内的所有getters
    let getters = rootModule._rootModule.getters
    if (getters) {
        forEachValue(getters, (fn, key) => {
            registerGetter(store, key, fn, rootModule);
        });
    }
    // 循环注册包含模块内的所有mutations
    let mutations = rootModule._rootModule.mutations
    if (mutations) {
        forEachValue(mutations, (fn, key) => {
            registerMutation(store, key, fn, rootModule)
        });
    }

    // 循环注册包含模块内的所有actions
    let actions = rootModule._rootModule.actions
    if (actions) {
        forEachValue(actions, (actionFn, actionName) => {
            registerAction(store, actionName, actionFn, rootModule);
        });
    }

    forEachValue(rootModule._children, (child, key) => {
        installModule(store, rootModule.state, key, child)
    })
}

// 公共的方法
function forEachValue(object, fn) {
    Object.keys(object).forEach((key) => {
        fn(object[key], key)
    })
}

export default {
    install,
    Store
}