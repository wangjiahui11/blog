## js设计模式总结

##### 设计模式目的

- 设计模式提供了一个标准的术语系统，且具体到特定的情景。

- 提供了开发过程中问题最佳解决方案。

  

##### 设计六大原则

1. **单一职责原则**
2. **里氏替换原则**
3. **依赖倒转原则**
4. **接口隔离原则**
5. **最少知识原则(迪米特法则)**
6. **开放封闭原则**

##### 设计模式分类

总体来说设计模式分为三大类：

创建型模式，共五种：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式。

结构型模式，共七种：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式。

行为型模式，共十一种：策略模式、模板方法模式、`观察者模式`、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式。

其实还有两类：并发型模式和线程池模式。

不过，对于前端来说，有的设计模式在平时工作中几乎用不到或者很少用到，来来来，来了解下前端常见的设计模式



#### 常见的几种设计模式

1. ##### **工厂模式**

   > 工厂模式定义一个用于创建对象的接口，这个接口由子类决定实例化哪一个类。该模式使一个类的实例化延迟到了子类。而子类可以重写接口方法以便创建的时候指定自己的对象类型。

   

   **基础的工厂模式**

   ES6

   ```
   class Person {
       constructor(name,age,gender) {
           this.name = name
           this.age = age
           this.gender = gender
       }
       sayHi() {
   		console.log('你好,我是'+this.name+'今年'+this.age+'性别'+this.gender)
       }
   }
   var p1 = new Person("Will",'28','男');
   p1.sayHi() // 你好,我是Will今年28性别男
   ```

   ES5

   ```
   function Person(name,age,gender) {
       var obj = new Object();
       obj.name = name;
       obj.age = age;
       obj.gender = gender;
       obj.sayName = function(){
           console.log('你好,我是'+this.name+'今年'+this.age+'性别'+this.gender)
       }
       return obj;
   }
   var p1 = new Person("Will",'28','男');
   p1.sayHi() // 你好,我是Will今年28性别男
   ```

   **复杂的工厂模式**

   ES6

   ```
   // engine工厂
   class Engine {
       constructor(engine) {
           this.engine = engine
       }
       do() {
   		console.log('创建了-----------'+this.engine)
       }
   }
   
   // 灯工厂
   class Light {
       constructor(light) {
           this.light = light
       }
       do() {
   		console.log('创建了-----------'+this.light)
       }
   }
   
   // 组装工厂
   class Factory {
     constructor(type) {
       return new (this[type]())
     }
     
     // 各流水线
     Engine() { return Engine }
     Light()  { return Light }
   }
   
   // 创建工厂
   const engineFactory = new Factory('Engine')
   const lightFactory = new Factory('Light')
   
   engineFactory.engine = '发动机'
   engineFactory.do()  //  创建了-----------发动机
   
   lightFactory.light = '电灯'
   lightFactory.do()  //   创建了-----------电灯
   
   ```

   ES5

   ```
   var Page = Page || {};
   //engine工厂
   Page.Engine = function () {
       this.do = function () {
   		console.log('创建了-----------'+this.engine)
       };
   };
   
   // 灯工厂
   Page.Light = function () {
       this.do = function (where) {
         console.log('创建了-----------'+this.light)
       };
   };
   
   // 组装工厂
   Page.Factory = function (type) {
       return new Page[type];
   }
   
   const engineFactory = Page.Factory('Engine')
   const lightFactory = Page.Factory('Light')
   
   engineFactory.engine = '发动机'
   engineFactory.do()  //  创建了-----------发动机
   
   lightFactory.light = '电灯'
   lightFactory.do()  //   创建了-----------电灯
   ```

   **应用情景下：**

   1. 对象的构建十分复杂

   2. 需要依赖具体环境创建不同实例

   3. 处理大量具有相同属性的小对象

      

   **优点**

   - 弱化对象间的耦合，防止代码的重复。在一个方法中进行类的实例化，可以消除重复性的代码。
   - 重复性的代码可以放在父类去编写，子类继承于父类的所有成员属性和方法，子类只专注于实现自己的业务逻辑。

   

2. ##### 单体模式

   > 保证一个类只有一个实例，并提供一个访问它的全局访问点（调用一个类，任何时候返回的都是同一个实例）。

   

   ```
   // 单体模式
   var Singleton = function(name){
       this.name = name;
   };
   Singleton.prototype.getName = function(){
       return this.name;
   }
   // 获取实例对象
   function getInstance(name) {
   	// this ---window 将实例绑定公共的变量上
       if(!this.instance) {
           this.instance = new Singleton(name);
       }
       return this.instance;
   }
   // 测试单体模式的实例
   var a = getInstance("aa");
   var b = getInstance("bb");
   
   // 因为单体模式是只实例化一次，所以下面的实例是相等的
   console.log(a === b); // true
   ```

   **封装单体模式**

   ```
   // 单体模式
   var Singleton = function(name){
       this.name = name;
   };
   Singleton.prototype.getName = function(){
       return this.name;
   }
   // 获取实例对象
   var getInstance = (function() {
       var instance = null;
       return function(name) {
           if(!instance) {
               instance = new Singleton(name);
           }
           return instance;
       }
   })();  // 沙盒模式，内部应用一个公共的变量instance，外部无法访问
   
   // 测试单体模式的实例
   var a = getInstance("aa");
   var b = getInstance("bb");
   // 因为单体模式是只实例化一次，所以下面的实例是相等的
   ```

   **单体模式的优点是：**

   1. 可以用来划分命名空间，减少全局变量的数量。

   2. 使用单体模式可以使代码组织的更为一致，使代码容易阅读和维护。

   3. 可以被实例化，且实例化一次。

      

3. **模块模式**

   > 模块模式的思路是为单体模式添加私有变量和私有方法能够减少全局变量的使用

   **核心：匿名闭包**

   ```
   所有函数内部代码都在闭包(closure)内。它提供了整个应用生命周期的私有和状态。
   
   (function () {
       // ... all vars and functions are in this scope only
       // still maintains access to all globals
   }());
   ```

   例子

   ```jsx
   var MODULE = (function () {
   var my = {},
   privateVariable = 1;
   
   function privateMethod() {
       // ...
   }
   
   my.moduleProperty = 1;
   my.moduleMethod = function () {
       // ...
   };
   
   return my;
   }());
   ```

   上述声明了一个全局模块MODULE，有两个公开属性：方法MODULE.moduleMethod和属性MODULE.moduleProperty。而且，匿名函数的闭包还维持了私有内部状态。

   **也就说，通过模块模式可以访问匿名函数内部的私有变量和函数**

   

4. ##### 代理模式

   ​	 代理是一个对象，它可以用来控制对本体对象的访问，它与本体对象实现了同样的接口，代理对象会把所有的调用方法传递给本体对象的；代理模式最基本的形式是对访问进行控制，而本体对象则负责执行所分派的那个对象的函数或者类，简单的来讲本地对象注重的去执行页面上的代码，代理则控制本地对象何时被实例化，何时被使用；

   > 代理模式（Proxy），为其他对象提供一种代理以控制对这个对象的访问。

   例子

   ​	我们来举一个简单的例子，假如小明要送酸奶小妹玫瑰花，却不知道她的联系方式或者不好意思，想委托大叔去送这些玫瑰，那大叔就是个代理，那我们如何来做呢？

   ```
   // 先声明美女对象
   var girl = function (name) {
       this.name = name;
   };
   
   // 这是小明
   var xiaoMing = function (girl) {
       this.girl = girl;
       this.sendGift = function (gift) {
           console.log("Hi " + girl.name + ", 小明送你一个礼物：" + gift);
       }
   };
   
   // 大叔是代理
   var proxyTom = function (girl) {
       this.girl = girl;
       this.sendGift = function (gift) {
           (new xiaoMing(girl)).sendGift(gift); // 替xiaom送花咯
       }
   };
   // 自己调用
   var xm = new xiaoMing(new girl("酸奶小妹"));
   xm.sendGift("999朵玫瑰")
   // 代理调用
   var proxy = new proxyTom(new girl("酸奶小妹"));
   proxy.sendGift("999朵玫瑰");
   ```

   在js中常用到的是**缓存代理**和**虚拟代理**

   **虚拟代理**

   - 不使用代理模式写图片预加载

   ```
   // 不使用代理的预加载图片函数如下
   var myImage = (function(){
       var imgNode = document.createElement("img");
       document.body.appendChild(imgNode);
       var img = new Image();
       img.onload = function(){
           imgNode.src = this.src;
       };
       return {
           setSrc: function(src) {
               imgNode.src = "loading.gif";
               img.src = src;
           }
       }
   })();
   // 调用方式
   myImage.setSrc("pic.png");
   ```

   - 使用代理模式写图片预加载

   ```
   var myImage = (function(){
       var imgNode = document.createElement("img");
       document.body.appendChild(imgNode);
       return {
           setSrc: function(src) {
               imgNode.src = src;
           }
       }
   })();
   // 代理模式
   var ProxyImage = (function(){
       var img = new Image();
       img.onload = function(){
           myImage.setSrc(this.src);
       };
       return {
           setSrc: function(src) {
               myImage.setSrc("loading.gif");
               img.src = src;
           }
       }
   })();
   // 调用方式
   ProxyImage.setSrc("pic.png");
   ```

   - 方案一步骤：

     1、创建img标签

     2、插入img标签

     3、创建img对象

     4、书写onloading方法

     5、返回设置图片对象。

   **缺点**：

   ​	1、代码耦合度比较大，一个函数内负责做了几件事情。未满足面向对象设计原则中单一职责原则；

   ​	2、当某个时候不需要图片预加载的时候，需要从myImage 函数内把代码删掉，这样代码耦合性太高。

   

   - 方案二步骤：

     1、myImage中创建img标签

     2、myImage中插入img标签

     3、myImage中返回设置imgNode的src方法

     4、ProxyImage中创建img对象

     5、ProxyImage中书写onload方法

     6、ProxyImage中返回设置图片的方法。

   **优点**：

   ​	1、myImage 函数只负责做一件事。创建img元素加入到页面中，其中的加载loading图片交给代理函数	ProxyImage 去做。

   ​	2、加载成功以后，代理函数ProxyImage 会通知及执行myImage 函数的方法。

   ​	3、当以后不需要代理对象的话，我们直接可以调用本体对象的方法即可

   

   **缓存代理**

   缓存代理，就是将前面使用的值缓存下来，后续还有使用的话，就直接拿出来用。

   ```
   var add = function(){
       var sum = 0
       for(var i = 0, l = arguments.length; i < l; i++){
           sum += arguments[i]
       }
       return sum
   }
   var proxyAdd = (function(){
       var cache = {} //缓存运算结果的缓存对象
       return function(){
           var args = Array.prototype.join.call(arguments)
           if(cache.hasOwnProperty(args)){//等价 args in cache
               console.log('使用缓存结果')
               return cache[args]//直接使用缓存对象的“值”
           }
           console.log('计算结果')
           return cache[args] = add.apply(this,arguments)//使用本体函数计算结果并加入缓存
           console.log(cache);
       }
   })()
   console.log(proxyAdd(1,2,3,4,5))
   console.log(proxyAdd(1,2,3,4,5))
   console.log(proxyAdd(1,2,3,4,5))
   
   // 输出结果
   计算结果
   15
   使用缓存结果
   15
   使用缓存结果
   15
   ```

   两者的职责划分：add函数提供计算功能。proxyAdd提供访问add函数的功能和缓存功能。

   

5. **观察者模式**

     发布---订阅模式又叫观察者模式，它定义了对象间的一种一对多的关系，让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖于它的对象都将得到通知。

   **优点：**

   1. 支持简单的广播通信，自动通知所有已经订阅过的对象。
   2. 页面载入后目标对象很容易与观察者存在一种动态关联，增加了灵活性。
   3. 目标对象与观察者之间的抽象耦合关系能够单独扩展以及重用。

   **缺点：**

   1.  创建订阅者需要消耗一定的时间和内存。
   2. 虽可以弱化对象之间的联系，如果过度使用的话，反而使代码不好理解及代码不好维护。

   例子：

   ```
   var shoeObj = {}; // 定义发布者
   shoeObj.list = []; // 缓存列表 存放订阅者回调函数
           
   // 增加订阅者
   shoeObj.listen = function(fn) {
       shoeObj.list.push(fn);  // 订阅消息添加到缓存列表
   }
   
   // 发布消息
   shoeObj.trigger = function(){
   	console.log(this)
       for(var i = 0,fn; fn = this.list[i];i++) {
           fn.apply(this,arguments); 
       }
   }
   // 小红订阅如下消息
   shoeObj.listen(function(color,size){
       console.log("颜色是："+color+'------'+"尺码是："+size);
   });
   
   // 小花订阅如下消息
   shoeObj.listen(function(color,size){
       console.log("再次打印颜色是："+color+'------'+"再次打印尺码是："+size);
   });
   shoeObj.trigger("红色",40);
   shoeObj.trigger("黑色",42);
   
   // 运行结果：
   // 颜色是：红色------尺码是：40
   // 再次打印颜色是：红色------再次打印尺码是：40
   // 颜色是：黑色------尺码是：42
   // 再次打印颜色是：黑色------再次打印尺码是：42
   
   ```

   上面的结果我们可知道：订阅者接收到发布者的每个消息，但订阅者只需要关注自己的消息

   **改造---增加key值，只需关注自己 的订阅部分**

   ```
   var shoeObj = {}; // 定义发布者
   shoeObj.list = {}; // 缓存列表 存放订阅者回调函数
           
   // 增加订阅者
   shoeObj.listen = function(key,fn) {
   	if(!this.list[key]){
   		this.list[key] =[]
   	}
      	this.list[key].push(fn);  // 订阅消息添加到缓存列表
   }
   
   // 发布消息
   shoeObj.trigger = function(){
   	var key = Array.prototype.shift.call(arguments); // 取出消息类型名称
       var fns = this.list[key];  // 取出该消息对应的回调函数的集合
       // 如果没有订阅过该消息的话，则返回
       if(!fns || fns.length === 0) {
           return;
       }
       for(var i = 0,fn; fn = fns[i++]; ) {
           fn.apply(this,arguments); // arguments 是发布消息时附送的参数
       }
   }
   // 小红订阅如下消息
   shoeObj.listen('red',function(size){
       console.log("尺码是："+size);
   });
   
   // 小花订阅如下消息
   shoeObj.listen('black',function(size){
       console.log("再次打印尺码是："+size);
   });
   shoeObj.trigger("red",40);
   shoeObj.trigger("black",42);
   
   // 输出
   // 尺码是：40
   // 再次打印尺码是：42
   ```

   **发布者-订阅者封装**

   ​	我们知道，对于上面的代码，小红去买鞋这么一个对象shoeObj 进行订阅，但是如果以后我们需要对买房子或者其他的对象进行订阅呢，我们需要复制上面的代码，再重新改下里面的对象代码；为此我们需要进行代码封装；

   

   **1、event.js**

   ```
   var event = {
       list: [],
       listen: function(key,fn) {
           if(!this.list[key]) {
               this.list[key] = [];
           }
           // 订阅的消息添加到缓存列表中
           this.list[key].push(fn);
       },
       trigger: function(){
           var key = Array.prototype.shift.call(arguments);
           var fns = this.list[key];
           // 如果没有订阅过该消息的话，则返回
           if(!fns || fns.length === 0) {
               return;
           }
           for(var i = 0,fn; fn = fns[i++];) {
               fn.apply(this,arguments);
           }
       }
   };
   
   var initEvent = function(obj) {
       for(var i in event) {
           obj[i] = event[i];
       }
   };
   
   // 我们再来测试下，我们还是给shoeObj这个对象添加发布-订阅功能；
   var shoeObj = {};
   initEvent(shoeObj);
   
   // 小红订阅如下消息
   shoeObj.listen('red',function(size){
       console.log("尺码是："+size);  
   });
   
   // 小花订阅如下消息
   shoeObj.listen('block',function(size){
       console.log("再次打印尺码是："+size); 
   });
   shoeObj.trigger("red",40);
   shoeObj.trigger("block",42);
   
   // 输出
   // 尺码是：40
   // 再次打印尺码是：42
   ```

   

   **2、添加取消订阅的功能**

   ```
   var event = {
      ...
      remove: function(key,fn){
          var fns = this.list[key];
          // 如果key对应的消息没有订阅过的话，则返回
          if(!fns) {
           return false;
          }
          // 如果没有传入具体的回调函数，表示需要取消key对应消息的所有订阅
          if(!fn) {
           fn && (fns.length = 0);
          }else {
              for(var i = fns.length - 1; i >= 0; i--) {
                  var _fn = fns[i];
                  if(_fn === fn) {
                   fns.splice(i,1); // 删除订阅者的回调函数
                  }
              }
          }
   	}
       ...
   };
   ...
   
   var shoeObj = {};
   initEvent(shoeObj);
   // 小红订阅如下消息
   shoeObj.listen('red',fn1 = function(size){
       console.log("尺码是："+size);  
   });
   
   // 小花订阅如下消息
   shoeObj.listen('red',fn2 = function(size){
       console.log("再次打印尺码是："+size); 
   });
   shoeObj.remove("red",fn1);
   shoeObj.trigger("red",42);
   
   // 输出：
   // 再次打印尺码是：42
   ```

   

   3、**全局--发布订阅对象代码封装**

   ```
   var Event = (function(){
       var list = {},listen,trigger,remove;
        listen = function(key,fn){
            if(!list[key]) {
            	list[key] = [];
            }
            list[key].push(fn);
         };
         trigger = function(){
             var key = Array.prototype.shift.call(arguments),
             fns = list[key];
             if(!fns || fns.length === 0) {
             	return false;
             }
             for(var i = 0, fn; fn = fns[i++];) {
             	fn.apply(this,arguments);
             }
         };
         remove = function(key,fn){
             var fns = list[key];
             if(!fns) {
             	return false;
             }
             if(!fn) {
             	fns && (fns.length = 0);
             }else {
               for(var i = fns.length - 1; i >= 0; i--){
                   var _fn = fns[i];
                   if(_fn === fn) {
                       fns.splice(i,1);
                   }
                }
             }
         };
         return {
             listen: listen,
             trigger: trigger,
             remove: remove
         }
   })();
   function fn1(size) {
       console.log("尺码为:"+size); // 打印出尺码为42
   }
   function fn2(size) {
       console.log("再次尺码为:"+size); // 打印出尺码为42
   }
   
   // 测试代码如下：
       Event.listen("color",fn1);
       Event.listen("color",fn2);
       Event.trigger("color",42);
       Event.remove("color",fn2);
       Event.trigger("color",42);
   
   // 输出
   // 尺码为:42
   // 再次尺码为:42
   // 尺码为:42
   
   ```

   4、**理解模块间通信**

   我们使用上面封装的全局的发布-订阅对象来实现两个模块之间的通信问题；比如现在有一个页面有一个按钮，每次点击此按钮后，div中会显示此按钮被点击的总次数；如下代码：

   ```
   <button id="count">点将我</button>
   <div id="showcount"></div>
   ```

   a.js 负责处理点击操作 及发布消息；如下JS代码：

   ```
   var a = (function(){
       var count = 0;
       var button = document.getElementById("count");
       button.onclick = function(){
           Event.trigger("add",count++);
       }
   })();
   ```

   b.js 负责监听add这个消息，并把点击的总次数显示到页面上来；如下代码：

   ```
   var b = (function(){
       var div = document.getElementById("showcount");
       Event.listen('add',function(count){
           div.innerHTML = count;
       });
   })();
   ```

   下面是html代码如下，JS应用如下引用即可：

   ```
   <!doctype html>
   <html lang="en">
    <head>
     <meta charset="UTF-8">
     <title>Document</title>
     <script src="event.js"></script>
    </head>
    <body>
       <button id="count">点将我</button>
       <div id="showcount"></div>
       <script src = "a.js"></script>
       <script src = "b.js"></script>
    </body>
   </html>
   ```

   如上代码，当点击一次按钮后，showcount的div会自动加1，如上演示的是2个模块之间如何使用发布-订阅模式之间的通信问题；

   其中event.js 就是我们上面封装的全局-发布订阅模式对象的封装代码；

   

6. 

