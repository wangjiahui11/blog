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

   

3. 

