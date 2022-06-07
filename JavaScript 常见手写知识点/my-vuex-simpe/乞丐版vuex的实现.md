# 乞丐版vuex的实现

### 1.什么是vuex？

> Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。通俗点说话就是，数据集中管理的仓库，任何页面都可以使用和管理的数据状态

**为什么要使用Vuex :**

- 能够在 `vuex` 中集中管理共享的数据，易于开发和后期维护
- 能够高效地实现组件之间的数据共享，提高开发效率
- 在 `vuex` 中的数据都是响应式的

**在手写vuex时，我们需要了解几个个重要知识点**

- [Vue.use](https://cn.vuejs.org/v2/guide/plugins.html)
- [class语法](https://es6.ruanyifeng.com/#docs/class)

### 2.vuex的主要组成部分

- **State** : 单一状态树

- **Getter**: store 中的 state 中派生出一些状态,可以理解成store的计算属性

- **Mutations** ：行为，用来改变state的值

- **Action** :类似mutation, 异步的，不直接调用mutation

- **Modules**: 将store 分割成模块

  具体使用方法参考：https://v3.vuex.vuejs.org/zh/guide/modules.html

### 3.模拟简单的my-vuex

##### **3.1 搭建架子**

创建index.js

```
// 保存一个全局的 Vue 之后会用到
let _Vue = null

// Store 类
class Store {
  constructor(options) {
  	//...待实现
  }
}

// 因为Vuex 需要 Vue.use() 安装，所以我们必须要有个 install 方法 传入 Vue
function install(Vue) {
	//... 待实现
}

// 导出 install 和 Store
export default {
  install,
  Store,
}
```

##### **3.2 注入vue中**

```
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
```

**3.3 初始化store的数据**

```
// 保存一个全局的 Vue 之后会用到
let _Vue = null

// Store 类
class Store {
  // 先完成构造方法,构造方法接收一个对象
  constructor(options) {
    // 赋初值
    const state = options.state || {}
    const mutations = options.mutations || {}
    const actions = options.actions || {}
    const getters = options.getters || {}
    
   }
//...install

}  



```

##### **3.4 state同步成响应式**

```
// Store 类
class Store {
  // 先完成构造方法,构造方法接收一个对象
  constructor(options) {
  	...
    // 1.实现state 把 state 中的数据转为 响应式,直接用 Vue 中的 observable
    this.state = _Vue.observable(state)
  	
  } 
  ....
}
```

##### **3.5 getters方法的同步**

```
// Store 类
class Store {
  // 先完成构造方法,构造方法接收一个对象
  constructor(options) {
  	...
  	
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
  	
  } 
  ....
}
```

##### **3.5 mutations和commit方法的实现**

```
// Store 类
class Store {
  // 先完成构造方法,构造方法接收一个对象
  constructor(options) {
  	...
  	
	// ------------- 3.实现 mutations ------------
    this.mutations = {}
    Object.keys(mutations).forEach(key => {
      this.mutations[key] = (params) => {
        mutations[key].call(this, this.state, params)
      }
    })
  	
  }
  ....
  // 4.实现commit操作  箭头函数将this绑定到Store上
  commit = (type, params) => {
    this.mutations[type] && this.mutations[type](params)
  }
  ....
}
```

##### **3.6 actions 和 dispatch方法的实现**

```
// Store 类
class Store {
  // 先完成构造方法,构造方法接收一个对象
  constructor(options) {
  	...
  	
	// -----------------5.实现actions--------------
    this.actions = {}
    Object.keys(actions).forEach((key) => {
      this.actions[key] = (params) => {
        actions[key].call(this, this, params)
      }
    })
  	
  }
  ....
  // 6.实现dispatch操作
  dispatch = (type, params) => {
    this.actions[type] && this.actions[type](params)
  }
  ....
}
```

##### **3.7 大功告成**

index.html

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>乞丐版Vuex</title>
</head>

<body>
  <div id="app">
    <h1>state 测试：{{$store.state.name}}</h1>
    <h1>getName 测试：{{$store.getters.getName}}</h1>
    <button @click="$store.commit('changeName', 'jack')">
      mutations 按钮
    </button>
    <button @click="$store.dispatch('changeNameAsync', 'tony')">
      actions 按钮
    </button>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
  <script type="module">
    import Vuex from "./index.js";

    Vue.use(Vuex) // 使用插件

    let store = new Vuex.Store({
      state: {
        name: 'will',
        age: 21,
      },

      getters: {
        getName(state) {
          return `大家好,我叫${state.name}今年${state.age}岁`
        },
      },

      mutations: {
        changeName(state, newName) {
          // 这里简单举个例子 修改个名字
          state.name = newName
        },
      },

      actions: {
        changeNameAsync({ commit }, newName) {
          // 这里用 setTimeout 模拟异步
          setTimeout(() => {
            // 在这里调用 mutations 中的处理方法
            commit('changeName', newName)
          }, 2000)
        },
      }

    })

    Vue.config.productionTip = false
    let vue = new Vue({
      el: '#app',
      store,// 绑定到this.$options上
    })
    window.vue = vue
  </script>
</body>

</html>
```

index.js（store的代码）

```
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
```

