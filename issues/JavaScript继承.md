## JavaScript继承

##### 什么是继承？

​		继承可以解决编程中代码冗余的问题，是实现代码重用的重要手段之一。继承是软件可重用性的一种表现，新类可以在不增加自身代码的情况下，通过从现有的类中继承其属性和方法，来充实自身内容，这种现象或行为就称为继承。继承最基本的作用就是代码重用，增加软件的可扩性。



##### JavaScript继承核心?

​		**理解原型链继承的核心,也就是说理解prototype和proto**

​		实例对象共享同一个prototype对象，那么从外界看起来，prototype对象就好像是实例对象的原型，而实例对象则好像"继承"了prototype对象一样。



##### 常用继承分类

​		先来个整体印象。如图所示，JS中继承可以按照是否使用object函数（在下文中会提到），将继承分成两部分（Object.create是ES5新增的方法，用来规范化这个函数）。

​		其中，原型链继承和原型式继承有一样的优缺点，构造函数继承与寄生式继承也相互对应。寄生组合继承基于Object.create, 同时优化了组合继承，成为了完美的继承方式。ES6 Class Extends的结果与寄生组合继承基本一致，但是实现方案又略有不同。

![extends](E:\wangjh\web资料\learn\blog\图片及截图\extends.png)

1. **原型链继承**

   核心：将父类的实例作为子类的原型

   ```
   function SuperType() {
       this.name = 'super';
   }
   
   SuperType.prototype.getSuperValue = function() {
       return '我是你爸'
   }
   
   function SubType() {
      this.age='18'
   }
   
   // 这里是关键，创建SuperType的实例，并将该实例赋值给SubType.prototype
   SubType.prototype = new SuperType(); 
   
   SubType.prototype.getSubValue = function() {
       return '我是儿子'
   }
   
   var instance = new SubType();
   console.log(instance.age,'------',instance.name) //18 ------ super
   console.log(instance.getSuperValue()); // '我是你爸'
   ```

   **原型链继承特点：继承原型的属性和原型的方法**

   ![extendPrototype](E:\wangjh\web资料\learn\blog\图片及截图\extendPrototype.png)

   **缺点：多个实例对引用类型的操作会被篡改。**

   ```
   function SuperType(){
     this.colors = ["red", "blue", "green"];
   }
   function SubType(){}
   
   SubType.prototype = new SuperType();
   
   var instance1 = new SubType();
   instance1.colors.push("black");  // 父类的属性被篡改
   alert(instance1.colors); //"red,blue,green,black"
   
   var instance2 = new SubType(); 
   alert(instance2.colors); //"red,blue,green,black"
   ```

   

2. **构造函数继承**

   使用父类的构造函数来增强子类实例，等同于复制父类的实例给子类（不使用原型）

   ```
   function  SuperType(){
       this.color=["red","green","blue"];
   }
   SuperType.prototype.getSuperValue = function() {
       return '我是你爸'
   }
   
   function  SubType(){
       //继承自SuperType
       SuperType.call(this);
   }
   
   var instance1 = new SubType();
   instance1.color.push("black");
   console.log(instance1.color);//"red,green,blue,black"
   console.log(instance1.getSuperValue()); // instance1.getSuperValue is not a function
   
   var instance2 = new SubType();
   console.log(instance2.color);//"red,green,blue"
   
   ```

   **核心**：SuperType.call(this)`，创建子类实例时调用`SuperType`构造函数，于是`SubType`的每个实例都会将SuperType中的属性复制一份。

   **缺点：**

   - 只能继承父类的**实例**属性和方法，不能继承原型属性/方法

   - 无法实现复用，每个子类都有父类实例函数的副本，影响性能

     

3. **组合继承**

   组合上述两种方法就是组合继承。用原型链实现对**原型**属性和方法的继承，用借用构造函数技术来实现**实例**属性的继承。

   ```
   function SuperType(name){
     this.name = name;
     this.colors = ["red", "blue", "green"];
   }
   
   SuperType.prototype.sayName = function(){
     console.log(this.name);
   };
   
   function SubType(name, age){
     // 继承属性
     // 第二次调用SuperType()
     SuperType.call(this, name);
     this.age = age;
   }
   
   // 继承方法  构建原型链
   // 第一次调用SuperType()
   SubType.prototype = new SuperType(); 
   // 重写SubType.prototype的constructor属性，指向自己的构造函数SubType
   SubType.prototype.constructor = SubType; 
   SubType.prototype.sayAge = function(){
       console.log(this.age);
   };
   
   var instance1 = new SubType("Nicholas", 29);
   instance1.colors.push("black");
   console.log(instance1.colors); //"red,blue,green,black"
   instance1.sayName(); //"Nicholas";
   instance1.sayAge(); //29
   
   var instance2 = new SubType("Greg", 27);
   console.log(instance2.colors); //"red,blue,green"
   instance2.sayName(); //"Greg";
   instance2.sayAge(); //27
   
   ```

   ![extendPrototype2](E:\wangjh\web资料\learn\blog\图片及截图\extendPrototype2.png)

   缺点：

   - 第一次调用`SuperType()`：给`SubType.prototype`写入两个属性name，color。
   - 第二次调用`SuperType()`：给`instance1`写入两个属性name，color。

   实例对象`instance1`上的两个属性就屏蔽了其原型对象SubType.prototype的两个同名属性。所以，组合模式的缺点就是在使用子类创建实例对象时，其原型中会存在两份相同的属性/方法。

   

4. **原型式继承**

   利用一个空对象作为中介，将某个对象直接赋值给空对象构造函数的原型。

   ```
   function object(o){
     function F(){}
     F.prototype = o;
     return new F();
   }
   ```

   object()对传入其中的对象执行了一次`浅复制`，将构造函数F的原型直接指向传入的对象。

   ```
   var person = {
       name: "Nicholas",
       friends: ["Shelby", "Court", "Van"]
   };
   // 赋值到对象的构造函数的原型上
   var anotherPerson = object(person);
   anotherPerson.name = "Greg";
   anotherPerson.friends.push("Rob");
   
   var yetAnotherPerson = object(person);
   yetAnotherPerson.name = "Linda";
   yetAnotherPerson.friends.push("Barbie");
   console.log(person.friends);   //"Shelby,Court,Van,Rob,Barbie"
   ```

   ![extendPrototype3](E:\wangjh\web资料\learn\blog\图片及截图\extendPrototype3.png)

   核心：原型式继承的object方法本质上是对参数对象的一个浅复制。
   优点：父类方法可以复用
   缺点：

   - 父类的引用属性会被所有子类实例共享
   - 子类构建实例时不能向父类传递参数

   另外，ES5中存在`Object.create()`的方法，能够代替上面的object方法。

   ```
   var yetAnotherPerson = object(person); 
   等价于
   var yetAnotherPerson = Object.create(person);
   ```

   

5. **寄生式继承**

   核心：在原型式继承的基础上，增强对象，返回该对象

   ```
   function createAnother(original){
     var clone = object(original); // 通过调用 object() 函数创建一个新对象
     clone.sayHi = function(){  // 以某种方式来增强对象(公共的方法)
       console.log("hi");
     };
     return clone; // 返回这个对象
   }
   ```

   函数的主要作用是为构造函数新增属性和方法，以增强函数

   ```
   var person = {
     name: "Nicholas",
     friends: ["Shelby", "Court", "Van"]
   };
   var anotherPerson = createAnother(person);
   anotherPerson.name = "Greg";
   anotherPerson.sayHi(); //"hi"。
   ```

   ![extendPrototype4](E:\wangjh\web资料\learn\blog\图片及截图\extendPrototype4.png)

   缺点（同原型式继承）：

   - 原型链继承多个实例的引用类型属性指向相同，存在篡改的可能。

   - 无法传递参数

     

6. **寄生组合式继承**

   结合借用构造函数传递参数和寄生模式实现继承

   ```
   // 创建对象，将父类的原型绑定到该对象上的原型上，并对原型进行重写，赋值给子类的原型
   function inheritPrototype(subType, superType){
     // 创建对象，创建父类原型的一个副本
     var prototype = Object.create(superType.prototype); 
     // 增强对象，弥补因重写原型而失去的默认的constructor 属性
     prototype.constructor = subType;                    
     // 指定对象，将新创建的对象赋值给子类的原型
     subType.prototype = prototype;                     
   }
   
   // 父类初始化实例属性和原型属性
   function SuperType(name){
     this.name = name;
     this.colors = ["red", "blue", "green"];
   }
   SuperType.prototype.sayName = function(){
     alert(this.name);
   };
   
   // 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
   function SubType(name, age){
     SuperType.call(this, name);
     this.age = age;
   }
   
   // 将父类原型指向子类
   inheritPrototype(SubType, SuperType);
   
   // 新增子类原型属性
   SubType.prototype.sayAge = function(){
     alert(this.age);
   }
   
   var instance1 = new SubType("xyc", 23);
   var instance2 = new SubType("lxy", 23);
   
   instance1.colors.push("2"); // ["red", "blue", "green", "2"]
   instance1.colors.push("3"); // ["red", "blue", "green", "3"]
   ```

   ![img](https://user-gold-cdn.xitu.io/2018/10/30/166c2c0109df5438?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

   ​	这个例子的高效率体现在它只调用了一次`SuperType` 构造函数，并且因此避免了在`SubType.prototype` 上创建不必要的、多余的属性。于此同时，原型链还能保持不变；因此，还能够正常使用`instanceof` 和`isPrototypeOf()`

   **这是最成熟的方法，也是现在库实现的方法**

   

7. **ES6 Class extends**

   核心： ES6继承的结果和寄生组合继承相似，本质上，ES6继承是一种语法糖。但是，寄生组合继承是先创建子类实例this对象，然后再对其增强；而ES6先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。

   ```
   class Rectangle {
       // constructor
       constructor(height, width) {
           this.height = height;
           this.width = width;
       }
       
       // Getter
       get area() {
           return this.calcArea()
       }
       
       // Method
       calcArea() {
           return this.height * this.width;
       }
   }
   
   const rectangle = new Rectangle(10, 20);
   console.log(rectangle.area);
   // 输出 200
   
   -----------------------------------------------------------------
   // 继承
   class Square extends Rectangle {
     constructor(length) {
       super(length, length);
     }
   }
   
   const square = new Square(10);
   console.log(square.calcArea());// 输出 100
   ```

   `extends`继承的核心代码如下，其实现和上述的寄生组合式继承方式一样

   ```
   class A {
   }
   
   class B {
   }
   
   Object.setPrototypeOf = function (obj, proto) {
     obj.__proto__ = proto;
     return obj;
   }
   
   // B 的实例继承 A 的实例
   Object.setPrototypeOf(B.prototype, A.prototype);
   
   // B 继承 A 的静态属性
   Object.setPrototypeOf(B, A);
   
   ```

   ES6继承与ES5继承的异同：
相同点：本质上ES6继承是ES5继承的语法糖
   不同点：
   
   - ES5的继承实质上是先创建子类的实例对象，然后再将父类的方法添加到this上（Parent.call(this)）。
- ES6子类实例的构建，基于父类实例，也就说先创建父类的实例对象this，然后再用子类的构造函数修改this。ES5中不是。

**参考：**

[Javascript继承机制的设计思想（阮一峰）](http://www.ruanyifeng.com/blog/2011/06/designing_ideas_of_inheritance_mechanism_in_javascript.html)

[一篇文章理解js继承](https://segmentfault.com/a/1190000008321085)
[MDN之Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
[MDN之Class](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)



