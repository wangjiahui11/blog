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

   

6. ##### 责任链模式

   ​		职责链模式（Chain of responsibility）是使多个对象都有机会处理请求，从而避免请求的发送者和接受者之间的耦合关系。将这个对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理他为止。

   

   **基本实现流程如下：**

   1. 发送者知道链中的第一个接收者，它向这个接收者发送该请求。

   2. 每一个接收者都对请求进行分析，然后要么处理它，要么它往下传递。

   3. 每一个接收者知道其他的对象只有一个，即它在链中的下家(successor)。

   4. 如果没有任何接收者处理请求，那么请求会从链中离开。

      

   ```
   // 我们一般写代码如下处理操作
   var order =  function(orderType,isPay,count) {
       if(orderType == 1) {  // 用户充值500元到支付宝去
           if(isPay == true) { // 如果充值成功的话，100%中奖
               console.log("亲爱的用户，您中奖了100元红包了");
           }else {
               // 充值失败，就当作普通用户来处理中奖信息
               if(count > 0) {
                   console.log("亲爱的用户，您已抽到10元优惠卷");
               }else {
                   console.log("亲爱的用户，请再接再厉哦");
               }
           }
       }else if(orderType == 2) {  // 用户充值200元到支付宝去
           if(isPay == true) {     // 如果充值成功的话，100%中奖
               console.log("亲爱的用户，您中奖了20元红包了");
           }else {
               // 充值失败，就当作普通用户来处理中奖信息
               if(count > 0) {
                   console.log("亲爱的用户，您已抽到10元优惠卷");
               }else {
                   console.log("亲爱的用户，请再接再厉哦");
               }
           }
       }else if(orderType == 3) {
           // 普通用户来处理中奖信息
           if(count > 0) {
               console.log("亲爱的用户，您已抽到10元优惠卷");
           }else {
               console.log("亲爱的用户，请再接再厉哦");
           }
       }
   };
   ```

   该代码的缺点是，代码不容易扩展且难以阅读，耦合性相对比较高；

   这时用职责链模式来依次传递对象来实现：

   ```
   function order500(orderType,isPay,count){
       if(orderType == 1 && isPay == true)    {
           console.log("亲爱的用户，您中奖了100元红包了");
       }else {
           // 自己不处理，传递给下一个对象order200去处理
           order200(orderType,isPay,count);
       }
   };
   function order200(orderType,isPay,count) {
       if(orderType == 2 && isPay == true) {
           console.log("亲爱的用户，您中奖了20元红包了");
       }else {
           // 自己不处理，传递给下一个对象普通用户去处理
           orderNormal(orderType,isPay,count);
       }
   };
   function orderNormal(orderType,isPay,count){
       // 普通用户来处理中奖信息
       if(count > 0) {
           console.log("亲爱的用户，您已抽到10元优惠卷");
       }else {
           console.log("亲爱的用户，请再接再厉哦");
       }
   }
   ```

   ​		上述分别使用了三个函数来处理自己的业务逻辑，如果自己函数不能处理，就传递给下面的函数去处理，依次类推，直到有一个函数能处理他，这就是职责链模式的核心思想；但上述代码毫无扩展性，违背了开放-封闭原则。

   改进版

   ```
   function order500(orderType,isPay,count){
       if(orderType == 1 && isPay == true)    {
           console.log("亲爱的用户，您中奖了100元红包了");
       }else {
           //我不知道下一个节点是谁,反正把请求往后面传递
           return "nextSuccessor";
       }
   };
   function order200(orderType,isPay,count) {
       if(orderType == 2 && isPay == true) {
           console.log("亲爱的用户，您中奖了20元红包了");
       }else {
           //我不知道下一个节点是谁,反正把请求往后面传递
           return "nextSuccessor";
       }
   };
   function orderNormal(orderType,isPay,count){
       // 普通用户来处理中奖信息
       if(count > 0) {
           console.log("亲爱的用户，您已抽到10元优惠卷");
       }else {
           console.log("亲爱的用户，请再接再厉哦");
       }
   }
   // 下面需要编写职责链模式的封装构造函数方法
   var Chain = function(fn){
       this.fn = fn;
       this.successor = null;
   };
   Chain.prototype.setNextSuccessor = function(successor){
       return this.successor = successor;
   }
   // 把请求往下传递
   Chain.prototype.passRequest = function(){
       var ret = this.fn.apply(this,arguments);
       if(ret === 'nextSuccessor') {
           return this.successor && this.successor.passRequest.apply(this.successor,arguments);
       }
       return ret;
   }
   //现在我们把3个函数分别包装成职责链节点：
   var chainOrder500 = new Chain(order500);
   var chainOrder200 = new Chain(order200);
   var chainOrderNormal = new Chain(orderNormal);
   chainOrder500.passRequest=function () {
       console.log('chainOrder500 before ...'，...function order500(orderType,isPay,count){
       if(orderType == 1 && isPay == true)    {
           console.log("亲爱的用户，您中奖了100元红包了");
       }else {
           //我不知道下一个节点是谁,反正把请求往后面传递
           return "nextSuccessor";
       }
   };
   function order200(orderType,isPay,count) {
       if(orderType == 2 && isPay == true) {
           console.log("亲爱的用户，您中奖了20元红包了");
       }else {
           //我不知道下一个节点是谁,反正把请求往后面传递
           return "nextSuccessor";
       }
   };
   function orderNormal(orderType,isPay,count){
       // 普通用户来处理中奖信息
       if(count > 0) {
           console.log("亲爱的用户，您已抽到10元优惠卷");
       }else {
           console.log("亲爱的用户，请再接再厉哦");
       }
   }
   // 下面需要编写职责链模式的封装构造函数方法
   var Chain = function(fn){
       this.fn = fn;
       this.successor = null;
   };
   Chain.prototype.setNextSuccessor = function(successor){
       return this.successor = successor;
   }
   // 把请求往下传递
   Chain.prototype.passRequest = function(){
       var ret = this.fn.apply(this,arguments);
       if(ret === 'nextSuccessor') {
           return this.successor && this.successor.passRequest.apply(this.successor,arguments);
       }
       return ret;
   }
   //现在我们把3个函数分别包装成职责链节点：
   var chainOrder500 = new Chain(order500);
   var chainOrder200 = new Chain(order200);
   var chainOrderNormal = new Chain(orderNormal);
   //  中断passRequest的操作；
   chainOrder500.passRequest=function (arguments) {
       console.log('chainOrder500 before ...'，...arguments)
       // 这里做具体的处理操作
       // Chain.prototype.passRequest.call(this); //链接passRequest的操作；
       console.log('chainOrder500 after ...')
   };
   // 然后指定节点在职责链中的顺序
   chainOrder500.setNextSuccessor(chainOrder200);
   chainOrder200.setNextSuccessor(chainOrderNormal);
   
   //最后把请求传递给第一个节点：
   chainOrder500.passRequest(1,true,500);  // 亲爱的用户，您中奖了100元红包了
   chainOrder500.passRequest(2,true,500);  // 亲爱的用户，您中奖了20元红包了
   chainOrder500.passRequest(3,true,500);  // 亲爱的用户，您已抽到10元优惠卷 
   chainOrder500.passRequest(1,false,0);   // 亲爱的用户，请再接再厉哦)
       // 这里做具体的处理操作
       // Chain.prototype.passRequest.call(this); //继续往上走
       console.log('chainOrder500 after ...')
   };
   // 然后指定节点在职责链中的顺序
   chainOrder500.setNextSuccessor(chainOrder200);
   chainOrder200.setNextSuccessor(chainOrderNormal);
   
   //最后把请求传递给第一个节点：
   chainOrder500.passRequest(1,true,500);  // 亲爱的用户，您中奖了100元红包了
   chainOrder500.passRequest(2,true,500);  // 亲爱的用户，您中奖了20元红包了
   chainOrder500.passRequest(3,true,500);  // 亲爱的用户，您已抽到10元优惠卷 
   chainOrder500.passRequest(1,false,0);   // 亲爱的用户，请再接再厉哦
   ```

   如上代码分别编写三个函数，在函数内分别处理自己的业务逻辑，如果不能处理的话，就返回字符串nextSuccessor 往后面传递，然后封装Chain这个构造函数，传递一个fn这个对象实列进来，且有自己的一个属性successor，原型上有2个方法 setNextSuccessor 和 passRequest;setNextSuccessor 这个方法是指定节点在职责链中的顺序的，把相对应的方法保存到this.successor这个属性上；

   **理解异步的职责链**

   ```
   function Fn1() {
       console.log(1);
       return "nextSuccessor";
   }
   function Fn2() {
       console.log(2);
       var self = this;
       setTimeout(function(){
           self.next();
       },1000);
   }
   function Fn3() {
       console.log(3);
   }
   // 下面需要编写职责链模式的封装构造函数方法
   var Chain = function(fn){
       this.fn = fn;
       this.successor = null;
   };
   Chain.prototype.setNextSuccessor = function(successor){
       return this.successor = successor;
   }
   // 把请求往下传递
   Chain.prototype.passRequest = function(){
       var ret = this.fn.apply(this,arguments);
       if(ret === 'nextSuccessor') {
           return this.successor && this.successor.passRequest.apply(this.successor,arguments);
       }
       return ret;
   }
   Chain.prototype.next = function(){
       return this.successor && this.successor.passRequest.apply(this.successor,arguments);
   }
   //现在我们把3个函数分别包装成职责链节点：
   var chainFn1 = new Chain(Fn1);
   var chainFn2 = new Chain(Fn2);
   var chainFn3 = new Chain(Fn3);
   
   // 然后指定节点在职责链中的顺序
   chainFn1.setNextSuccessor(chainFn2);
   chainFn2.setNextSuccessor(chainFn3);
   
   chainFn1.passRequest();  // 打印出1，2 过1秒后 会打印出3
   ```

   **职责链模式的优点是：**

   1. 解耦了请求发送者和N个接收者之间的复杂关系

   2. 链中的节点对象可以灵活地拆分重组，增加或删除一个节点，或者改变节点的位置都是很简单的事情。

   3. 我们还可以手动指定节点的起始位置，并不是说非得要从其实节点开始传递的.

    **缺点：**职责链模式中多了一点节点对象，可能在某一次请求过程中，大部分节点没有起到实质性作用，他们的作用只是让

    请求传递下去，从性能方面考虑，避免过长的职责链提高性能。

   参考：[职责链模式](cnblogs.com/TomXu/archive/2012/04/10/2435381.html)

   

7. **命令模式的理解**

   > 命令模式(Command)的定义是：用于将一个请求封装成一个对象，从而使你可用不同的请求对客户进行参数化；对请求排队或者记录请求日志，以及执行可撤销的操作。也就是说改模式旨在将函数的调用、请求和操作封装成一个单一的对象，然后对这个对象进行一系列的处理。此外，可以通过调用实现具体函数的对象来解耦命令对象与接收对象。

   **面向对象编程来实现命令模式**

   ```
   假设html结构如下：
   <button id="button1">刷新菜单目录</button>
   <button id="button2">增加子菜单</button>
   ```

   js代码

   ```
   var b1 = document.getElementById("button1"),
       b2 = document.getElementById("button2")；
        
    // 定义setCommand 函数，该函数负责往按钮上面安装命令。点击按钮后会执行command对象的execute()方法。
    var setCommand = function(button,command){
       button.onclick = function(){
           command.execute();
       }
    };
    // 下面我们自己来定义各个对象来完成自己的业务操作
    var Menu= {
       refersh: function(){
           alert("刷新菜单目录");
       }，
       add: function(){
           alert("增加子菜单");
       }
    };
   
    // 下面是编写命令类
    var RefreshMenuBarCommand = function(receiver){
       this.receiver = receiver;
    };
    RefreshMenuBarCommand.prototype.execute = function(){
       this.receiver.refersh();
    }
    // 增加命令操作
    var AddSubMenuCommand = function(receiver) {
       this.receiver = receiver;
    };
    AddSubMenuCommand.prototype.execute = function() {
       this.receiver.add();
    }
    // 最后把命令接收者传入到command对象中，并且把command对象安装到button上面
    var refershBtn = new RefreshMenuBarCommand(Menu);
    var addBtn = new AddSubMenuCommand(Menu);
    
    setCommand(b1,refershBtn);
    setCommand(b2,addBtn);
   ```

   ​		上面的代码是使用传统的面向对象编程来实现命令模式的，命令模式过程式的请求调用封装在command对象的execute方法里。我们有没有发现上面的编写代码有点繁琐呢，现在我们使用回调函数，接收者被封装在回调函数中，操作起来更加方便；

   **回调处理**

   ```
       var b1 = document.getElementById("button1"),
           b2 = document.getElementById("button2")；
       
    	var setCommand = function (button, fn) {
         button.onclick = function () {
          	fn();
         }
       };
       // 下面我们自己来定义各个对象来完成自己的业务操作
       var Menu = {
         refersh: function () {
           alert("刷新菜单目录");
         },
         add: function () {
           alert("增加子菜单");
         }
       };
   
       // 下面是编写命令类
       var RefreshMenuBarCommand = function (receiver) {
         return function() {
           receiver.refersh();
         }
       };
       
       // 增加命令操作
       var AddSubMenuCommand = function (receiver) {
          return function () {
           receiver.add();
         }
       };
       // 最后把命令接收者传入到command对象中，并且把command对象安装到button上面
       var refershBtn = new RefreshMenuBarCommand(Menu);
       var addBtn = new AddSubMenuCommand(Menu);
   
       setCommand(b1, refershBtn);
       setCommand(b2, addBtn);
   ```

   **理解宏命令：**

   >   宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。
   >
   > 其实类似把页面的所有函数方法放在一个数组里面去，然后遍历这个数组，依次
   >
   > 执行该方法的。

   代码如下：

   ```
   var command1 = {
       execute(){
           console.log(1);
       }
   }; 
   var command2 = {
       execute(){
           console.log(2);
       }
   };
   var command3 = {
       execute(){
           console.log(3);
       }
   };
   // 定义宏命令，command.add方法把子命令添加进宏命令对象，
   // 当调用宏命令对象的execute方法时，会迭代这一组命令对象，
   // 并且依次执行他们的execute方法。
   var command = function(){
       return {
           commandsList: [], 
           add: function(command){
               this.commandsList.push(command);
           },
           execute: function(){
               for(var i = 0 ; i < this.commandsList.length; i+=1) {
                   this.commandsList[i].execute();
               }
           }
       }
   };
   // 初始化宏命令
   var c = command();
   c.add(command1);
   c.add(command2);
   c.add(command3);
   c.execute();  // 1,2,3
   ```

   

8. ##### **模板方法**

   > 模板方法（TemplateMethod）定义了一个操作中的算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
   >
   > 模板方法模式由二部分组成，第一部分是抽象父类，第二部分是具体实现的子类，一般的情况下是抽象父类封装了子类的算法框架，包括实现一些公共方法及封装子类中所有方法的执行顺序，子类可以继承这个父类，并且可以在子类中重写父类的方法，从而实现自己的业务逻辑。

   ​		举个例子，泡茶和泡咖啡有同样的步骤，比如烧开水（boilWater）、冲泡（brew）、倒在杯子里（pourOnCup），加小料（addCondiments）等等。但每种饮料冲泡的方法以及所加的小料不一样，所以我们可以利用模板方法实现这个主要步骤。

   首先先来定义抽象步骤：

   ```
   var CaffeineBeverage = function () {};
   CaffeineBeverage.prototype.prepareRecipe = function () {
       this.boilWater();
       this.brew();
       this.pourOnCup();
       if (this.customerWantsCondiments()) {
           // 如果可以想加小料，就加上
    		this.addCondiments();
       }
   };
   CaffeineBeverage.prototype.boilWater = function () {
       console.log("将水烧开!");
   };
   CaffeineBeverage.prototype.pourOnCup = function () {
       console.log("将饮料到再杯子里!");
   };
   CaffeineBeverage.prototype.brew = function () {
       console.log("泡茶或者泡饮料!");
   };
   CaffeineBeverage.prototype.addCondiments = function () {
    	console.log("添加其他小料!");
   };
   // 默认加上小料
   CaffeineBeverage.prototype.customerWantsCondiments = function () {
       return true;
   };
   
   ```

   ​		该函数在原型上扩展了所有的基础步骤，以及主要步骤，冲泡和加小料步骤没有实现，供具体饮料所对应的函数来实现，另外是否加小料（customerWantsCondiments ）默认返回true，子函数重写的时候可以重写该值。

   下面两个函数分别是冲咖啡和冲茶所对应的函数：

   ```
   // 冲咖啡
   var Coffee = function () {
     CaffeineBeverage.apply(this);  // 继承父类的属性和方法
   };
   Coffee.prototype = new CaffeineBeverage();
   Coffee.prototype.brew = function () {
     console.log("从咖啡机想咖啡倒进去!");
   };
   
   //创建coffee的子类
   var c1 = new Coffee()
   console.log(c1)
   c1.prepareRecipe()
   
   //冲茶叶
   var Tea = function () {
     CaffeineBeverage.apply(this); // 继承父类的属性和方法
   };
   Tea.prototype = new CaffeineBeverage();
   Tea.prototype.brew = function () {
     console.log("泡茶叶!");
   };
   Tea.prototype.addCondiments = function () {
     console.log("添加柠檬!");
   };
   Tea.prototype.customerWantsCondiments = function () {
     return console.log("你想添加柠檬嘛？");
   };
   
   //创建Tea的子类
   var t1 = new Tea()
   console.log(t1)
   t1.prepareRecipe()
   ```

   模板方法应用于下列情况：

   1. 一次性实现一个算法的不变的部分，并将可变的行为留给子类来实现
   2. 各子类中公共的行为应被提取出来并集中到一个公共父类中的避免代码重复，不同之处分离为新的操作，最后，用一个钓鱼这些新操作的模板方法来替换这些不同的代码
   3. 控制子类扩展，模板方法只在特定点调用“hook”操作，这样就允许在这些点进行扩展

   和策略模式不同，模板方法使用继承来改变算法的一部分，而策略模式使用委托来改变整个算法。

   

9. #### **策略模式**

   > 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。

   策略模式的优点如下：

   1. 策略模式利用组合，委托等技术和思想，有效的避免很多if条件语句。

      2. 策略模式提供了开放-封闭原则，使代码更容易理解和扩展。

   3. 策略模式中的代码可以复用

   

   一：使用策略模式计算奖金；

   ​		比如公司的年终奖是根据员工的工资和绩效来考核的，绩效为A的人，年终奖为工资的4倍，绩效为B的人，年终奖为工资的3倍，绩效为C的人，年终奖为工资的2倍；我们一般的编码方式会如下这样编写代码：

   ```
   var calculateBouns = function(salary,level) {
       if(level === 'A') {
           return salary * 4;
       }
       if(level === 'B') {
           return salary * 3;
       }
       if(level === 'C') {
           return salary * 2;
       }
   };
   // 调用如下：
   console.log(calculateBouns(4000,'A')); // 16000
   console.log(calculateBouns(2500,'B')); // 7500
   ```

   缺点：

   1. 过多的if else判断；
   2. 函数缺乏弹性，复用性差；

   

   **Javascript版本的策略模式**

   ```
   //代码如下：
   var obj = {
           "A": function(salary) {
               return salary * 4;
           },
           "B" : function(salary) {
               return salary * 3;
           },
           "C" : function(salary) {
               return salary * 2;
           } 
   };
   var calculateBouns =function(level,salary) {
       return obj[level](salary);
   };
   console.log(calculateBouns('A',10000)); // 40000
   ```

   **利用策略模式进行数据合法性验证：**

   ```
   var validator = {
   
       // 所有可以的验证规则处理类存放的地方，后面会单独定义
       types: {},
   
       // 验证类型所对应的错误消息
       messages: [],
   
       // 当然需要使用的验证类型
       config: {},
   
       // 暴露的公开验证方法
       // 传入的参数是 key => value对
       validate: function (data) {
   
           var i, msg, type, checker, result_ok;
   
           // 清空所有的错误信息
           this.messages = [];
   
           for (i in data) {
               if (data.hasOwnProperty(i)) {
   
                   type = this.config[i];  // 根据key查询是否有存在的验证规则
                   checker = this.types[type]; // 获取验证规则的验证类
   
                   if (!type) {
                       continue; // 如果验证规则不存在，则不处理
                   }
                   if (!checker) { // 如果验证规则类不存在，抛出异常
                       throw {
                           name: "ValidationError",
                           message: "No handler to validate type " + type
                       };
                   }
   
                   result_ok = checker.validate(data[i]); // 使用查到到的单个验证类进行验证
                   if (!result_ok) {
                       msg = "Invalid value for *" + i + "*, " + checker.instructions;
                       this.messages.push(msg);
                   }
               }
           }
           return this.hasErrors();
       },
   
       // helper
       hasErrors: function () {
           return this.messages.length !== 0;
       }
   };
   ```

   然后剩下的工作，就是定义types里存放的各种验证类了，我们这里只举几个例子：

   ```
   // 验证给定的值是否不为空
   validator.types.isNonEmpty = {
       validate: function (value) {
           return value !== "";
       },
       instructions: "传入的值不能为空"
   };
   
   // 验证给定的值是否是数字
   validator.types.isNumber = {
       validate: function (value) {
           return !isNaN(value);
       },
       instructions: "传入的值只能是合法的数字，例如：1, 3.14 or 2010"
   };
   
   // 验证给定的值是否只是字母或数字
   validator.types.isAlphaNum = {
       validate: function (value) {
           return !/[^a-z0-9]/i.test(value);
       },
       instructions: "传入的值只能保护字母和数字，不能包含特殊字符"
   };
   ```

   使用的时候，首先要定义需要验证的数据集合，然后定义每种数据需要验证的规则类型，代码如下：

   ```
   var data = {
       first_name: "Tom",
       last_name: "Xu",
       age: "unknown",
       username: "TomXu"
   };
   
   validator.config = {
       first_name: 'isNonEmpty',
       age: 'isNumber',
       username: 'isAlphaNum'
   };
   ```

   最后，获取验证结果的代码就简单了：

   ```
   validator.validate(data);
   
   if (validator.hasErrors()) {
       console.log(validator.messages.join("\n"));
   }
   
   ```

   ​	策略模式定义了一系列算法，从概念上来说，所有的这些算法都是做相同的事情，只是实现不同，他可以以相同的方式调用所有的方法，减少了各种算法类与使用算法类之间的耦合。

   

10. ##### 中介者模式

    > 中介者模式（Mediator），用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。

    举个例子：

    ​		比如我们去房屋中介去租房，房屋中介人在租房者和房东出租者之间形成一条中介;租房者并不关心租谁的房，房东出租者也并不关心它租给谁，因为有中介，所以需要中介来完成这场交易。

    ​		中介者模式的作用是解除对象与对象之间的耦合关系，增加一个中介对象后，所有的相关对象都通过中介者对象来通信，而不是相互引用，所以当一个对象发送改变时，只需要通知中介者对象即可。中介者使各个对象之间耦合松散，而且可以独立地改变它们之间的交互。

    

    **实现中介者的列子如下：**

    英雄杀这个游戏，最早的时候，英雄杀有2个人(分别是敌人和自己)；针对这个游戏先使用普通的函数来实现如下：

    比如先定义一个函数，该函数有三个方法，分别是win(赢), lose(输)，和die(敌人死亡)这三个函数；只要一个玩家死亡该游戏就结束了，同时需要通知它的对手胜利了; 代码需要编写如下：

    ```
    function Hero(name) {
        this.name = name;
        this.enemy = null; 
    }
    Hero.prototype.win = function(){
        console.log(this.name + 'Won');
    }
    Hero.prototype.lose = function(){
        console.log(this.name + 'lose');
    }
    Hero.prototype.die = function(){
        this.lose();
        this.enemy.win();
    }
    // 初始化2个对象
    var h1 = new Hero("朱元璋");
    var h2 = new Hero("刘伯温");
    // 给玩家设置敌人
    h1.enemy = h2;
    h2.enemy = h1;
    // 朱元璋死了 也就输了
    h1.die();  // 输出 朱元璋lose 刘伯温Won
    ```

    **现在我们再来为游戏添加队友**

    ​		比如英雄杀有6人一组，那么这种情况下就有队友，敌人也有3个；因此我们需要区分是敌人还是队友需要队的颜色这个字段，如果队的颜色相同的话，那么就是同一个队的，否则的话就是敌人；

    ```
    var players = []; // 定义一个数组 保存所有的玩家
    function Hero(name,teamColor) {
        this.friends = [];    //保存队友列表
        this.enemies = [];    // 保存敌人列表
        this.state = 'live';  // 玩家状态
        this.name = name;     // 角色名字
        this.teamColor = teamColor; // 队伍的颜色
    }
    Hero.prototype.win = function(){
        // 赢了
        console.log("win:" + this.name);
    };
    Hero.prototype.lose = function(){
        // 输了
        console.log("lose:" + this.name);
    };
    Hero.prototype.die = function(){
        // 所有队友死亡情况 默认都是活着的
        var all_dead = true;
        this.state = 'dead'; // 设置玩家状态为死亡
        for(var i = 0,ilen = this.friends.length; i < ilen; i+=1) {
            // 遍历，如果还有一个队友没有死亡的话，则游戏还未结束
            if(this.friends[i].state !== 'dead') {
                all_dead = false; 
                break;
            }
        }
        if(all_dead) {
            this.lose();  // 队友全部死亡，游戏结束
            // 循环 通知所有的玩家 游戏失败
            for(var j = 0,jlen = this.friends.length; j < jlen; j+=1) {
                this.friends[j].lose();
            }
            // 通知所有敌人游戏胜利
            for(var j = 0,jlen = this.enemies.length; j < jlen; j+=1) {
                this.enemies[j].win();
            }
        }
    }
    // 定义一个工厂类来创建玩家 
    var heroFactory = function(name,teamColor) {
        var newPlayer = new Hero(name,teamColor);
        for(var i = 0,ilen = players.length; i < ilen; i+=1) {
            // 如果是同一队的玩家
            if(players[i].teamColor === newPlayer.teamColor) {
                // 相互添加队友列表
                players[i].friends.push(newPlayer);
                newPlayer.friends.push(players[i]);
            }else {
                // 相互添加到敌人列表
                players[i].enemies.push(newPlayer);
                newPlayer.enemies.push(players[i]);
            }
        }
        players.push(newPlayer);
        return newPlayer;
    };
            // 红队
    var p1 = heroFactory("aa",'red'),
        p2 = heroFactory("bb",'red'),
        p3 = heroFactory("cc",'red'),
        p4 = heroFactory("dd",'red');
            
    // 蓝队
    var p5 = heroFactory("ee",'blue'),
        p6 = heroFactory("ff",'blue'),
        p7 = heroFactory("gg",'blue'),
        p8 = heroFactory("hh",'blue');
    // 让红队玩家全部死亡
        p1.die();
        p2.die();
        p3.die();
        p4.die();
    // lose:dd lose:aa lose:bb lose:cc
    // win:ee win:ff win:gg win:hh
    ```

    如上代码：Hero函数有2个参数，分别是name(玩家名字)和teamColor(队颜色)，

    首先根据队颜色来判断是队友还是敌人；同样也有三个方法win(赢)，lose(输)，和die(死亡)；如果每次死亡一个人的时候，循环下该人的队友有没有全部死亡，如果全部死亡了的话，就输了，因此需要循环他们的队友，分别告诉每个队友中的成员他们输了，同时需要循环他们的敌人，分别告诉他们的敌人他们赢了；因此每次死了一个人的时候，都需要循环一次判断他的队友是否都死亡了；因此每个玩家和其他的玩家都是紧紧耦合在一起了。

    

    下面我们可以使用中介者模式来改善上面的demo；

    首先我们仍然定义Hero构造函数和Hero对象原型的方法，在Hero对象的这些原型方法中，不再负责具体的执行的逻辑，而是把操作转交给中介者对象，中介者对象来负责做具体的事情，我们可以把中介者对象命名为playerDirector;

    在playerDirector开放一个对外暴露的接口ReceiveMessage，负责接收player对象发送的消息，而player对象发送消息的时候，总是把自身的this作为参数发送给playerDirector，以便playerDirector 识别消息来自于那个玩家对象。

    ```
    var players = []; // 定义一个数组 保存所有的玩家
    function Hero(name,teamColor) {
        this.state = 'live';  // 玩家状态
        this.name = name;     // 角色名字
        this.teamColor = teamColor; // 队伍的颜色
    }
    Hero.prototype.win = function(){
        console.log("win:" + this.name);   // 赢了
    };
    Hero.prototype.lose = function(){
        console.log("lose:" + this.name); // 输了
    };
     
    Hero.prototype.die = function(){  // 死亡
        this.state = 'dead';
        // 给中介者发送消息，玩家死亡
        playerDirector.ReceiveMessage('playerDead',this);
    }
    // 移除玩家
    Hero.prototype.remove = function(){
        // 给中介者发送一个消息，移除一个玩家
        playerDirector.ReceiveMessage('removePlayer',this);
    };
    // 玩家换队
    Hero.prototype.changeTeam = function(color) {
        // 给中介者发送一个消息，玩家换队
        playerDirector.ReceiveMessage('changeTeam',this,color);
    };
    // 定义一个工厂类来创建玩家 
    var heroFactory = function(name,teamColor) {
        // 创建一个新的玩家对象
        var newHero = new Hero(name,teamColor);
        // 给中介者发送消息，新增玩家
        playerDirector.ReceiveMessage('addPlayer',newHero);
        return newHero;
    };
    var playerDirector = (function(){
        var players = {},  // 保存所有的玩家
            operations = {}; // 中介者可以执行的操作
        // 新增一个玩家操作
        operations.addPlayer = function(player) {
            // 获取玩家队友的颜色
            var teamColor = player.teamColor;
            // 如果该颜色的玩家还没有队伍的话，则新成立一个队伍
            players[teamColor] = players[teamColor] || [];
            // 添加玩家进队伍
            players[teamColor].push(player);
         };
        // 移除一个玩家
        operations.removePlayer = function(player){
            // 获取队伍的颜色
            var teamColor = player.teamColor,
            // 获取该队伍的所有成员
            teamPlayers = players[teamColor] || [];
            // 遍历
            for(var i = teamPlayers.length - 1; i>=0; i--) {
                if(teamPlayers[i] === player) {
                    teamPlayers.splice(i,1);
                }
            }
        };
        // 玩家换队
        operations.changeTeam = function(player,newTeamColor){
            // 首先从原队伍中删除
            operations.removePlayer(player);
            // 然后改变队伍的颜色
            player.teamColor = newTeamColor;
            // 增加到队伍中
            operations.addPlayer(player);
        };
        // 玩家死亡
    	operations.playerDead = function(player) {
            var teamColor = player.teamColor,
            // 玩家所在的队伍
            teamPlayers = players[teamColor];
    
            var all_dead = true;
            //遍历 
            for(var i = 0,player; player = teamPlayers[i++]; ) {
                if(player.state !== 'dead') {
                    all_dead = false;
                    break;
                }
            }
            // 如果all_dead 为true的话 说明全部死亡
            if(all_dead) {
                for(var i = 0, player; player = teamPlayers[i++]; ) {
                    // 本队所有玩家lose
                    player.lose();
                }
                for(var color in players) {
                    if(color !== teamColor) {
                        // 说明这是另外一组队伍
                        // 获取该队伍的玩家
                        var teamPlayers = players[color];
                        for(var i = 0,player; player = teamPlayers[i++]; ) {
                            player.win(); // 遍历通知其他玩家win了
                        }
                    }
                }
            }
    	};
        var ReceiveMessage = function(){
            // arguments的第一个参数为消息名称 获取第一个参数
            var message = Array.prototype.shift.call(arguments);
            operations[message].apply(this,arguments);
        };
        return {
            ReceiveMessage : ReceiveMessage
        };
    })();
    // 红队
    var p1 = heroFactory("aa",'red'),
        p2 = heroFactory("bb",'red'),
        p3 = heroFactory("cc",'red'),
        p4 = heroFactory("dd",'red');
            
        // 蓝队
    var p5 = heroFactory("ee",'blue'),
        p6 = heroFactory("ff",'blue'),
        p7 = heroFactory("gg",'blue'),
        p8 = heroFactory("hh",'blue');
        // 让红队玩家全部死亡
        p1.die();
        p2.die();
        p3.die();
        p4.die();
        // lose:aa lose:bb lose:cc lose:dd 
       //  win:ee win:ff win:gg win:hh
    ```

    ​		我们可以看到；玩家与玩家之间的耦合代码已经解除了，而把所有的逻辑操作放在中介者对象里面处理，某个玩家的任何操作不需要去遍历去通知其他玩家，而只是需要给中介者发送一个消息即可，中介者接受到该消息后进行处理，处理完消息之后会把处理结果反馈给其他的玩家对象。使用中介者模式解除了对象与对象之间的耦合代码; 使程序更加的灵活.

    

**参考：**

​		[深入理解js系列设计模式](https://www.cnblogs.com/TomXu/archive/2011/12/15/2288411.html)	

​		[菜鸟教程-设计模式](https://www.runoob.com/design-pattern/design-pattern-tutorial.html)

