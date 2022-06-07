// 保存一个全局的 Vue 之后会用到
let _Vue = null

// Store 类
class Store {
  // 先完成构造方法,构造方法接收一个对象包括state,getter,mutation,action,module
  constructor(options) {
    // 赋初值
    const state = options.state || {}
    const getters = options.getters || {}
    const mutations = options.mutations || {}
    const actions = options.actions || {}

    // 1.实现state 把 state 中的数据转为 响应式,直接用 Vue 中的 observable
    this.state = _Vue.observable(state)

    // 2.实现getter的操作,对getter进行数据劫持
    this.getters = Object.create(null)
    Object.keys(getters).forEach((key) => {
      // 第一个参数是给谁添加 ，第二个是添加的属性名，第三个对象里面可以设置很多参数
      Object.defineProperty(this.getters, key, {
        // 为 this.getters 每一项都添加 一个 get 方法
        get: () => {
          // getters 中的方法 默认把 state传入进去,改变this指向
          return getters[key].call(this, this.state)
        },
      })
    })

    // ------------- 3.实现 mutations ------------
    this.mutations = {}
    Object.keys(mutations).forEach(key => {
      this.mutations[key] = (params) => {
        mutations[key].call(this, this.state, params)
      }
    })

    // -----------------5.实现actions--------------
    this.actions = {}
    Object.keys(actions).forEach((key) => {
      this.actions[key] = (params) => {
        actions[key].call(this, this, params)
      }
    })
  }

  // 4.实现commit操作  箭头函数将this绑定到Store上
  commit = (type, params) => {
    this.mutations[type] && this.mutations[type](params)
  }

  // 6.实现dispatch操作
  dispatch = (type, params) => {
    this.actions[type] && this.actions[type](params)
  }

}


// Vuex 需要 Vue.use() 安装，install 方法 传入 Vue
// 第二个参数是一个可选对象
function install(Vue) {
  // 保存到全局 _Vue
  _Vue = Vue
  // 全局注册混入 这样在所有的组件都能使用 $store
  _Vue.mixin({
    // 在 beforeCreate 这个时候把 $store 挂载到 Vue 上
    beforeCreate() {
      // this.$options  是Vue的实例对象
      if (this.$options.store) {
        _Vue.prototype.$store = this.$options.store      // 把 store 挂载到 Vue 原型上
      }
    },
  })
}

// 导出 install 和 store
export default {
  install,
  Store,
}
