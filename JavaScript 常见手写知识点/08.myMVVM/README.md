基于 Vue2.0 的 MVVM 的实现

### 一、什么是 MVVM?

Model–View–ViewModel （MVVM） 是一个软件架构设计模式，由微软 WPF 和 Silverlight 的架构师 Ken Cooper 和 Ted Peters 开发，是一种简化用户界面的事件驱动编程方式。由 John Gossman（同样也是 WPF 和 Silverlight 的架构师）于 2005 年在他的博客上发表

MVVM 源自于经典的 Model–View–Controller（MVC）模式 ，MVVM 的出现促进了前端开发与后端业务逻辑的分离，极大地提高了前端开发效率，MVVM 的核心是 ViewModel 层，它就像是一个中转站（value converter），负责转换 Model 中的数据对象来让数据变得更容易管理和使用，该层向上与视图层进行双向数据绑定，向下与 Model 层通过接口请求进行数据交互，起呈上启下作用。如下图所示

![mvvm](https://github.com/wangjiahui11/blog/blob/main/JavaScript%20%E5%B8%B8%E8%A7%81%E6%89%8B%E5%86%99%E7%9F%A5%E8%AF%86%E7%82%B9/08.myMVVM/img/mvvm.png?raw=true)

（1）View 层

View 是视图层，也就是用户界面。前端主要由 HTML 和 CSS 来构建

（2）Model 层

Model 是指数据模型，泛指后端进行的各种业务逻辑处理和数据操控，对于前端来说就是后端提供的 api 接口。

（3）ViewModel 层

ViewModel 是由前端开发人员组织生成和维护的视图数据层。在这一层，前端开发者对从后端获取的 Model 数据进行转换处理，做二次封装，以生成符合 View 层使用预期的视图数据模型。

ViewModel 所封装出来的数据模型包括视图的状态和行为两部分:而 Model 层的数据模型是只包含状态的，比如页面的这一块展示什么，而页面加载进来时发生什么，点击这一块发生什么，这一块滚动时发生什么这些都属于视图行为（交互），视图状态和行为都封装在了 ViewModel 里。这样的封装使得 ViewModel 可以完整地去描述 View 层。

MVVM 框架实现了双向绑定，这样 ViewModel 的内容会实时展现在 View 层，前端开发者再也不必低效又麻烦地通过操纵 DOM 去更新视图，MVVM 框架已经把最脏最累的一块做好了，我们开发者只需要处理和维护 ViewModel，更新数据视图就会自动得到相应更新

我们以下通过一个 Vue 实例来说明 MVVM 的具体实现，有 Vue 开发经验的同学应该一目了然：

（1）View 层

```
<div id="app">
    <p>{{message}}</p>
    <button v-on:click="showMessage()">Click me</button>
</div>
复制代码
```

（2）ViewModel 层

```
var app = new Vue({
    el: '#app',
    data: {  // 用于描述视图状态
        message: 'Hello Vue!',
    },
    methods: {  // 用于描述视图行为
        showMessage(){
            let vm = this;
            alert(vm.message);
        }
    },
    created(){
        let vm = this;
        // Ajax 获取 Model 层的数据
        ajax({
            url: '/your/server/data/api',
            success(res){
                vm.message = res;
            }
        });
    }
})
复制代码
```

（3） Model 层

```
{
    "url": "/your/server/data/api",
    "res": {
        "success": true,
        "name": "IoveC",
        "domain": "www.cnblogs.com"
    }
}
```

面试者在回答 Vue 的双向数据绑定原理时，几乎所有人都会说：Vue 是采用数据劫持结合发布订阅模式，通过 Object.defineProperty()来劫持各个属性的 getter,setter, 在数据变动时发布消息给订阅者，触发相应的回调函数，从而实现数据双向绑定。但当继续深入问道：

- 实现一个 MVVM 里面需要那些核心模块？
- 为什么操作 DOM 要在内存上进行？
- 各个核心模块之间的关系是怎样的？
- Vue 中如何对数组进行数据劫持？
- 你自己手动完整的实现过一个 MVVM 吗？
- ...

在了解完整的 MVVM，我们需要了解三个重要知识点（自行百度）

- Object.defineProperty()
- DocumentFragment - 文档碎片
- 发布订阅模式

### 二、实现自己的 MVVM

**要实现 mvvm 的双向绑定，就必须要实现以下几点：**

1. 实现一个数据劫持 - Observer，能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
2. 实现一个模板编译 - Compiler，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
3. 实现一个 - Watcher，作为连接 Observer 和 Compile 的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
4. MVVM 作为入口函数，整合以上三者

![mvvm流程图](https://github.com/wangjiahui11/blog/blob/main/JavaScript%20%E5%B8%B8%E8%A7%81%E6%89%8B%E5%86%99%E7%9F%A5%E8%AF%86%E7%82%B9/08.myMVVM/img/mvvm%E6%B5%81%E7%A8%8B%E5%9B%BE.png?raw=true)

### 2.1 数据劫持 - Observer

> Observer 类主要目的就是给 data 数据内的所有层级的数据都进行数据劫持，让其具备监听对象属性变化的能力

**核心点：**

- 数据劫持-- 递归处理
- 当对象赋值与旧值一样，则不需要后续操作 --- 防止重复渲染
- 获取数据时(get)，添加订阅者 Watcher 到 Dep 的容器中，设置数据时候（set），通过 dep.notify()通知订阅者 Watcher 更新视图

```
class Observer {
  constructor(data) {
    this.defineReactive(data); // 将用户自定义的data中的元素都进行劫持观察，从而来实现双向绑定
  }
  defineReactive(data) {
    var dep = new Dep();
    Object.keys(data).forEach(key => {
      var val = data[key];
      Object.defineProperty(data, key, {
        get() {
          if (Watcher) { // 如果当前所获取的这个变量上面有监视器，那么就需要把监视器放到订阅器中等待触发
            if (!Watcher.hasAddedAsSub) { // 对于已经添加到订阅列表中的监视器则无需再重复添加了
              dep.addSub(Watcher); // 将监视器添加到订阅列表中
              Watcher.hasAddedAsSub = true;
            }
          }
          return val;
        },
        set(newVal) {
          if (newVal === val) return;
          val = newVal; // 将vue实例上对应的值(name的值)修改为新的值
          dep.notify();
        }
      })
    });
  }
}
```

### 2.2 模板编译 - Compiler

> Compiler 是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

![compile流程图](https://github.com/wangjiahui11/blog/blob/main/JavaScript%20%E5%B8%B8%E8%A7%81%E6%89%8B%E5%86%99%E7%9F%A5%E8%AF%86%E7%82%B9/08.myMVVM/img/compile%E6%B5%81%E7%A8%8B%E5%9B%BE.png?raw=true)

**Compiler 主要做了三件事：**

- 将当前根节点所有子节点遍历放到内存中
- 编译文档碎片，替换模板（元素、文本）节点中属性的数据
- 将编译的内容回写到真实 DOM 上

【重点】：

1. 先把真实的 dom 移入到内存中操作 --- 文档碎片
2. 编译 元素节点 和 文本节点
3. 给模板中的表达式和属性添加观察者

```
class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      // 在$fragment中操作，比this.$el中操作节省很多性能，所以要赋值给fragment
      let $fragment = this.node2Fragment(this.$el);
      this.compileText($fragment.childNodes[0]); // 将模板中的{{}}替换成对应的变量
      this.$el.appendChild($fragment)
    }
  }
  node2Fragment(el) {
    // 将node节点都放到fragment中去
    var fragment = document.createDocumentFragment();
    fragment.appendChild(el.firstChild);// 将el中的元素放到fragment中去,并删除el中原有的，这个是appendChild自带的功能
    return fragment;
  }

  compileText(node) {
    //编译{{xxx}}的值
    var reg = /\{\{(.*)\}\}/ //用来判断有没有vue的双括号的
    if (reg.test(node.textContent)) {
      let matchedName = RegExp.$1;
      node.textContent = this.$vm[matchedName];
      new Watch(this.$vm, matchedName, function (value) {
        node.textContent = value;
      });
    }
  }
}

```

### 2.3 发布订阅 - Watcher

> Watcher 订阅者作为 Observer 和 Compile 之间通信的桥梁，主要做的事情是:

1. 在自身实例化时往属性订阅器(dep)里面添加自己
2. 自身必须有一个 update()方法
3. 待属性变动 dep.notice()通知时，能调用自身的 update()方法，并触发 Compile 中绑定的回调，则功成身退。

```
let Watcher = null; // 用来表明有没有监视器实例
// Dep 即订阅者
class Dep { // 把与一个变量相关的监听器都存在subs这个变量中
  constructor() {
    this.subs = [];
  }
  notify() {
    // 执行所有与变量相关的回调函数
    this.subs.forEach(sub => sub.update());
  }
  addSub(sub) {
    // 添加与变量相关的订阅回调
    this.subs.push(sub);
  }
}
// 观察者
class Watch {
  constructor(vue, exp, cb) {
    this.vue = vue;
    this.exp = exp;
    this.cb = cb;
    this.hasAddedAsSub = false; // 有没有被添加到Dep中的Subscriber中去，有的话就不需要重复添加
    this.value = this.get(); // 得到当前vue实例上对应表达式exp的最新的值
  }
  get() {
    Watcher = this; // 将当前实例watch放入到Watcher中
    var value = this.vue[this.exp];
    Watcher = null; // 将Watcher置空，让给下一个值
    return value;
  }
  update() {
    let value = this.get();
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vue, value); // 将于此变量相关的回调函数全部执行掉
    }
  }
}

```

Dep 和 Watcher 是简单的观察者模式的实现，Dep 即订阅者，它会管理所有的观察者，并且有给观察者发送消息的能力。Watcher 即观察者，当接收到订阅者的消息后，观察者会做出自己的更新操作。

### 2.4 整合 - MVVM

MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。

```
class Vue {
  constructor(options) {
    let data = this._data = options.data || undefined;
    this._initData.call(this); // 将data中的数据都挂载到this上去，使得this.name 相当于就是得到了this._data.name
    new Observer(data); // 将data中的数据进行劫持
    new Compiler(options.el, this);
  }
  _initData() {
    // 这个函数的功能很简单，就是把用户定义在data中的变量，都挂载到Vue实例(this)上
    Object.keys(this._data).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => {
          return this._data[key];
        },
        set: (newVal) => {
          this._data[key] = newVal;
        }
      })
    });
  }
}

```

### 2.5 大功告成了

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <!-- <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script> -->
</head>

<body>
  <div id="app">
    {{name}}
  </div>
</body>

</html>
<script src="./js/Observer.js"></script>
<script src="./js/Watcher.js"></script>
<script src="./js/Compiler.js"></script>
<script src="./js/Vue.js"></script>
<script type="text/javascript">
  let vue = new Vue({
    el: '#app',
    data: {
      name: 'jackieyin',
      skill: {
        a: 'JavaScript'
      }
    }
  })
  window.vue = vue;
</script>

```
