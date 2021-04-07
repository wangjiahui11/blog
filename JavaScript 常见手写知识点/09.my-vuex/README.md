# my-vuex

### 前言

在前端工程化开发的今天，`vuex`成为了我们项目中状态管理的上上之选。关于如何使用它，相信这已经成为前端开发者的必备技能之一了。今天，我们来一起尝试进阶一下，自己实现一个状态管理器来管理我们的项目，让我们可以在以后的开发过程中可以更加迅捷的定位问题，可以在遇到面试官提出(您好，可以描述下`vuex`的实现原理吗？)类似问题的时候可以更加从容的回答。

### 实际使用

相信大多数同学在日常开发中会这样使用`vuex`

```
// store.js
import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex) 
export default new Vuex.Store({
  state: {
    text: "Hello Vuex"
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
)}
```

### 磨刀不误砍柴工，简单分析下vuex

我们在引入`vuex`之后主要做了以下两步操作

1. `Vue.use(Vuex)`

   !['vue.use用法'](https://user-gold-cdn.xitu.io/2020/2/3/1700b4d651f1ec9e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

   此处说明我们的

   ```
   vuex
   ```

   必须得向外面暴露一个

   ```
   install
   ```

   方法，这个

   ```
   install
   ```

   方法可以帮助我们在

   ```
   vue
   ```

   原型上注册我们的功能。

   

2. `new Vuex.Store()`

看到`new`了，顾名思义我们的`vuex`不仅需要暴露出`install`方法，同样还需要暴露出一个`store`的类,上面挂载了我们使用到的`state、muations、actions、getters`等参数以及`commit、dispatch`等方法

### 开始搭建自己的vuex

#### 1.**实现Vue.use**

> 创建一个`install`函数和一个`store`的类,挂在$store上

1.新建`my-vuex.js`

```
// my-vuex.js
let Vue
const install = _Vue => {
// vue.use()执行的时候，会将vue作为参数传入进来，这里我们用一个变量接收 vue
  Vue = _Vue 
}
class Store {
    
}
export default {
  install,
  Store
}
复制代码
```

2.`install`函数挂载全局`$store`的过程。

```
// my-vuex.js
let Vue
const install = _Vue => {
// vue.use()执行的时候，会将vue实例作为参数传入进来，这里我们用一个变量接收
  Vue = _Vue   // Vue.mixin帮助我们全局混入$store
  Vue.mixin({
    beforeCreate(){
      // 这里的this指的是vue实例
      const options = this.$options
      if(options.store){
        // 判断当前组件内部是否定义了store，如果有则优先使用内部的store
        this.$store = typeof options.store === 'function' ? options.store() : options.store
      } else if(options.parent && options.parent.$store){
        // 组件内部没有定义store,则从父组件下继承$store方法
        this.$store = options.parent.$store
      }
    }
  })
}
class Store {
    
}
export default {
  install,
  Store
}
```

上面已经通过`vue.use`将`$store`实例注入到了`vue`上，下一步继续完善`store`里面的功能

#### 2.**实现State**

通常会在组件中使用`this.$store.state`来获取数据，所以这里我们需要在`Store`类上定义获取`state`时的方法

`my-vuex.js`代码如下

```
// 省略其余代码 
class Store {
    constructor(options={}){
        this.options = options
    }
    get state(){
        return this.options.state
    }
}
export default {
  install,
  Store
}
```

测试一下

```
// store.js
import Vue from "vue"
import Vuex from "./my-vuex.js"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    text: "Hello Vuex"
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {}
})
App.vue
<template>
  <div id="app">
    <h1>{{getState}}</h1>
  </div>
</template>
<script>
  export default{
    computed:{
      getState(){
        return this.$store.state.text 
      }
    }
  }
</script>
```

运行代码后会发现展示出了预期的  Hello Vuex

> 但是在这里有一个小问题，我们都知道vue的数据是响应式的。如果我们如下去操作:

```
// App.vue
<template>
  <div id="app">
      <h1>{{getState}}</h1>
  </div>
</template>
<script>
  export default{
    computed:{
      getState(){
        return this.$store.state.text 
      }
    },
    mounted(){
      setTimeout(() => {
        console.log('执行了')
        this.$store.state.text = 'haha'
      }, 1000)
    }
  }
</script>
```

代码运行后会我们发现页面的数据并没有变化,所以这里我们要将`state`改造成响应式的数据。这里提供两种方法

1. 利用`vue`自身提供的`data`响应式机制

```
// my-vuex.js
// 省略多余代码
class Store {
    constructor(options={}){
        this.options = options
        this.vmData = new Vue({
          data: {
              state: options.state
          }
        });
    }
    get state(){
        return this.vmData._data.state
    }
}
```

2.利用`vue`2.6.0新增的`Vue.observable()`实现

```
// my-vuex.js
// 省略多余代码
class Store {
    constructor(options={}){
        this.options = options
        this.vmData = {
            state:Vue.observable(options.state || {})
        }
    }
    get state(){
        return this.vmData.state
    }
}
```

#### 3.**实现getters**

`my-vuex.js`代码如下

```
// my-vuex.js
// 省略多余代码
class Store {
    constructor(options={}){
        this.options = options
        this.vmData = {
            state:Vue.observable(options.state || {})
        }
      // 初始化getters
      this.getters = {}
      // 遍历store上的getters
      Object.keys(options.getters).forEach(key=>{
        //为getters里所有的函数定义get时执行的操作
        Object.defineProperty(this.getters,key,{
          get:()=>{
            return options.getters[key](this.vmData.state)
          }
        })
      })
    }
    get state(){
        return this.vmData.state
    }
}
```

**测试一下** 

store.js

```
import Vue from "vue"
import Vuex from "./my-vuex.js"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    text: "Hello Vuex"
  },
  getters: {
    getText(state){
      return state.text
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
```

App.vue

```
<template>
  <div id="app">
      <h1>{{getState}}</h1>
  </div>
</template>
<script>
  export default{
    computed:{
      getState(){
        return this.$store.getters.getText
      }
    }
  }
</script>
```

#### 4.**实现mutation和commit方法**

`my-vuex.js`代码如下

```
// 省略多余代码
class Store {
    constructor(options={}){
        this.options = options
        this.vmData = {
            state:Vue.observable(options.state || {})
        }
      // 初始化getters
      this.getters = {}
      // 遍历store上的getters
      Object.keys(options.getters).forEach(key=>{
        //为getters里所有的函数定义get时执行的操作
        Object.defineProperty(this.getters,key,{
          get:()=>{
            return options.getters[key](this.vmData.state)
          }
        })
      })
      // 初始化mutations
      this.mutations = {}
      // 遍历mutations里所有的函数
      Object.keys(options.mutations).forEach(key=>{
        // 拷贝赋值
        this.mutations[key] = payload=>{
          options.mutations[key](this.vmData.state,payload)
        }
      })
      // commit实际上就是执行mutations里指定的函数
      this.commit = (type,param)=>{
        this.mutations[type](param)
      }
    }
    get state(){
        return this.vmData.state
    }
}
复制代码
```

测试一下

store.js

```
import Vue from "vue"
import Vuex from "./my-vuex.js"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    text: "Hello Vuex"
  },
  getters: {
    getText(state){
      return state.text
    }
  },
  mutations: {
    syncSetText(state,param){
      state.text = param
    }
  },
  actions: {},
  modules: {}
})
复制代码
```

App.vue

```
<template>
  <div id="app">
      <h1>{{getState}}</h1>
  </div>
</template>
<script>
  export default{
    computed:{
      getState(){
        return this.$store.getters.getText
      }
    },
    mounted(){
      setTimeout(() => {
        console.log('执行了')
        this.$store.commit('syncSetText','同步更改数据')
      }, 1000)
    }
  }
</script>
```

#### 5.**实现action和dispatch方法**

action与mutations原理类似，同样dispatch实现方法与commit类似

`my-vuex.js`代码如下

```
// 省略多余代码
class Store {
    constructor(options={}){
        this.options = options
        this.vmData = {
            state:Vue.observable(options.state || {})
        }
      // 初始化getters
      this.getters = {}
      // 遍历store上的getters
      Object.keys(options.getters).forEach(key=>{
        //为getters里所有的函数定义get时执行的操作
        Object.defineProperty(this.getters,key,{
          get:()=>{
            return options.getters[key](this.vmData.state)
          }
        })
      })
      // 初始化mutations
      this.mutations = {}
      // 遍历mutations里所有的函数
      Object.keys(options.mutations).forEach(key=>{
        // 拷贝赋值
        this.mutations[key] = payload=>{
          options.mutations[key](this.vmData.state,payload)
        }
      })
      // commit实际上就是执行mutations里指定的函数
      this.commit = (type,param)=>{
        this.mutations[type](param)
      }
      // 初始化actions
      this.actions = {} 
      Object.keys(options.actions).forEach(key => {
        this.actions[key] = payload => {
          options.actions[key](this, payload)
        }
      })
      this.dispatch = (type,param)=>{
        this.actions[type](param)
      }
    }
    get state(){
        return this.vmData.state
    }
}
```

测试一下

store.js

```
import Vue from "vue"
import Vuex from "./my-vuex.js"
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    text: "Hello Vuex"
  },
  getters: {
    getText(state){
      return state.text
    }
  },
  mutations: {
    syncSetText(state,param){
      state.text = param
    }
  },
  actions: {
    asyncSetText({commit},param){
      commit('syncSetText',param)
    }
  },
  modules: {}
})
```

App.vue

```
<template>
  <div id="app">
      <h1>{{getState}}</h1>
  </div>
</template>
<script>
  export default{
    computed:{
      getState(){
        return this.$store.getters.getText
      }
    },
    mounted(){
      setTimeout(() => {
        console.log('执行了')
        this.$store.dispatch('asyncSetText','异步更改数据')
      }, 1000)
    }
  }
</script>
```

#### 6.**代码精简**

目前已经实现了vuex中基本的几个功能，但是上面的代码稍微现得有些冗余，我们来优化一下，主要从以下两点入手

1.将出现多次的`Object.keys().forEach()`封装成公共的`forEachValue`函数

```
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key=>fn(obj[key], key));
}
```

2.把多个初始化重新赋值的部分封装为易读的`register`函数

优化后的代码如下

```
// my-vuex.js
// 省略多余代码
class Store {
  constructor(options={}){
      this.options = options
      this.vmData = {
          state:Vue.observable(options.state || {})
      }
      // 初始化getters
      this.getters = {}
      forEachValue(options.getters,(getterFn,getterName)=>{
        registerGetter(this,getterName,getterFn)
      }
      )
      // 初始化mutations
      this.mutations = {}
      forEachValue(options.mutations,(mutationFn,mutationName)=>{
          registerMutation(this,mutationName,mutationFn)
        }
      )
      // 初始化actions
      this.actions = {}
      forEachValue(options.actions,(actionFn,actionName)=>{
          registerAction(this,actionName,actionFn)
        }
      )
      // commit实际上就是执行mutations里指定的函数
      this.commit = (type,param)=>{
        this.mutations[type](param)
      }
      this.dispatch = (type,param)=>{
        this.actions[type](param)
      }
  }
  get state(){
      return this.vmData.state
  }
}
// 注册getter
function registerGetter(store,getterName,getterFn){
  Object.defineProperty(store.getters,getterName,{
    get:()=>{
      return getterFn.call(store,store.vmData.state)
    }
  })
}
// 注册mutation
function registerMutation(store,mutationName,mutationFn){
  store.mutations[mutationName] = payload=>{
    mutationFn.call(store,store.vmData.state,payload)
  }
}
// 注册action
function registerAction(store,actionName,actionFn){
  store.actions[actionName] = payload=>{
    actionFn.call(store,store,payload)
  }
}
// 封装出公共的循环执行函数
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key=>fn(obj[key], key));
}
export default {
  install,
  Store
}
```

#### 7.**实现module模块**

当我们项目日益复杂化的时候势必会引入`module`进行模块化状态管理，下面我们来继续实现`module`的功能

首先我们一起来看一下我们一般怎样使用`module`的

store.js代码如下

```
import Vue from "vue"
// import Vuex from "./my-vuex.js"
import Vuex from "vuex"
Vue.use(Vuex)
let moduleA = {
  state:{
    nameA:'我是模块A'
  },
  mutations:{
    syncSetA(state,param){
      state.nameA = param
    }
  },
  actions:{
    asyncSetState({commit},param){
      setTimeout(()=>{
        commit('syncSetA',param)
      },1000)
    }
  },
  getters:{
    getA(state){
      return state.nameA
    }
  }
}
let moduleB = {
  state:{
    nameB:'我是模块B'
  },
  mutations:{
    syncSetB(state,param){
      state.nameB = param
    }
  },
  actions:{
    asyncSetState({commit},param){
      setTimeout(()=>{
        commit('syncSetB',param)
      },1000)
    }
  },
  getters:{
    getB(state){
      return state.nameB
    }
  }
}
export default new Vuex.Store({
  modules:{
    moduleA,moduleB
  },
  state: {
    text: "Hello Vuex"
  },
  getters: {
    getText(state){
      return state.text
    }
  },
  mutations: {
    syncSetText(state,param){
      state.text = param
    }
  },
  actions: {
    asyncSetText({commit},param){
      commit('syncSetText',param)
    }
  }
})
复制代码
```

App.vue代码如下

```
<template>
  <div id="app">
      <h1>{{getState}}</h1>
      A<h2>{{stateA}}</h2>
      B<h2>{{stateB}}</h2>
  </div>
</template>
<script>
  export default{
    computed:{
      getState(){
        return this.$store.getters.getText
      },
      stateA(){
        return this.$store.state.moduleA.nameA
      },
      stateB(){
        return this.$store.state.moduleB.nameB
      }
    },
    mounted(){
      setTimeout(() => {
        this.$store.dispatch('asyncSetState','异步更改数据')
      }, 1000)
    }
  }
</script>
```

在不启用nameSpace的情况下，我们发现我们获取模块内的`state`使用`this.$store.state.moduleB.nameA`的方式获取。而触发模块内的`mutations`或者`action`则是与以前一样,只不过若是两个不同的模块有重名的`mutation`或者`action`,则需要全部都执行。下面运用两个步骤进行模块化实现

##### **1.格式化`modules`传来的数据**

我们可以格式化成下面这种格式,形成一个模块状态树

```
const newModule = {
    // 根模块store
    _rootModule:store,
    // 子模块
    _children:{
        moduleA:{
          _rootModule:moduleA,
          _children:{},
          state:moduleA.state
        },
        moduleB:{
          _rootModule:moduleB,
          _children:{},
          state:moduleB.state
        }
    },
    // 根模块状态
    state:store.state
}
复制代码
```

为此我们需要新增一个`moduleCollection`类来收集`store.js`中的数据，然后格式化成状态树

`my-vuex.js`代码如下

```
// my-vuex.js
let Vue
const install = _Vue => {
// 省略部分代码
}
class Store {
  constructor(options={}){
      // 省略部分代码
      // 格式化数据，生成状态树
      this._modules = new ModuleCollection(options)
  }
}
class moduleCollection{
  constructor(rootModule) {
        this.root = {}
        this.register(undefined, rootModule, {})
    }
    // moduleName:模块的名称，rootModule：当前根模块，parent：挂载的父级模块
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
                this.register(moduleName, rootChildModule, newModule)
            })
        }
    }
}}
```

##### 2. 安装状态树

`store.js`中的数据已经被我们递归组装成了状态树，接下来需要将状态树安装进`Store`类中 这里主要做了两个改动

1. 新增`installModule`函数,`installModule`主要帮助我们将格式化好的状态树注册到`Store`类中
2. 重新改造了注册函数(`registerMutation、registerGetter`等)以及触发函数(`commit、dispatch`)。

`my-vuex.js`代码如下

```
// my-vuex.js
// 省略部分代码
class Store {
  constructor(options={}){
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
  get state(){
      return this.vmData.state
  }
}
class moduleCollection{
    // 省略部分代码
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
// 省略其余代码
```

至此，我们已经实现了`vuex`的基本功能，当然其他类似于`nameSpace、plugins,store.subscribe`的功能这里并没有展开，小伙伴们可以自行扩展。这里建议先要理清楚思路。从`vuex`是什么，要实现那些功能？怎样可以更好的实现？如果思路通了，相信大家可以写出更好的`vuex`

#### 8.辅助函数

my-vue.js

```
// 省略部分代码
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

// 省略部分代码
```

#### 参考资料：

> [Build a Vuex Module](https://serversideup.net/build-vuex-module/)
>
> [从0到1手写一个vuex](https://juejin.cn/post/6844904066246508551#heading-14)
>
> [从0开始写一个自己的Vuex](https://segmentfault.com/a/1190000010888395)
>
> [vuex 源码：如何实现一个简单的 vuex](https://juejin.im/post/5a7a935851882524713dcd05)
>
> [Vue 源码（三） —— Vuex](https://zhuanlan.zhihu.com/p/48516116)
>
> [浅谈Vue.use](https://segmentfault.com/a/1190000012296163)
>
> [Vuex官方文档](https://vuex.vuejs.org/zh/guide/)
>
> [vuex Github仓库](https://github.com/vuejs/vuex)

