# 原型与原型链

​	JavaScript 中，万物皆对象！但对象也是有区别的。分为普通对象和函数对象，Object ，Function 是JS自带的函数对象。

​	怎么区分？其实很简单，凡是通过 new Function() 创建的对象都是`函数对象`，其他的都是`普通对象`。Function Object 也都是通过 New Function()创建的。



#### 构造函数

​	构造函数可用来创建特定类型的对象。像Object和Array这样的原生构造函数，在运行时会自动出现在执行环境中。

`	每个构造函数(constructor)都有一个原型对象(prototype), 原型对象都包含一个指向构造函数的指针, 而实例(instance)都包含一个指向原型对象的内部指针(__proto__).`

```
function Person() {

}
var person = new Person();
person.name = 'will';
console.log(person.name) // will
```

#### prototype

每个构造函数都有一个 prototype 属性，就是我们经常在各种例子中看到的那个 prototype ，比如：

那这个函数的 prototype 属性到底指向的是什么呢？是这个函数的原型吗？

其实，函数的 prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的**实例**的原型，也就是这个例子中的 person1 和 person2 的原型。

那什么是原型呢？你可以这样理解：每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型，每一个对象都会从原型"继承"属性。

让我们用一张图表示构造函数和实例原型之间的关系：

![prototype1](E:\wangjh\web资料\learn\blog\图片及截图\prototype1.png)

在这张图中我们用 Object.prototype 表示实例原型。

#### __proto__

这是每一个JavaScript对象(除了 null )都具有的一个属性，叫__proto__，这个属性会指向该对象的原型。

```
function Person() {

}
var person = new Person();
console.log(person.__proto__ === Person.prototype); // true
```

于是我们更新下关系图：

![prototype2](E:\wangjh\web资料\learn\blog\图片及截图\prototype2.png)



##### constructor

指向实例倒是没有，因为一个构造函数可以生成多个实例，但是原型指向构造函数倒是有的，这就要讲到第三个属性：constructor，每个原型都有一个 constructor 属性指向关联的构造函数。

```
function Person() {

}
console.log(Person === Person.prototype.constructor); // true
```

于是我们更新下关系图：

![prototype3](E:\wangjh\web资料\learn\blog\图片及截图\prototype3.png)

综上我们已经得出：构造函数，原型，实例之间的三角关系；

```
function Person() {

}

var person = new Person();

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true
// 顺便学习一个ES5的方法,可以获得对象的原型
console.log(Object.getPrototypeOf(person) === Person.prototype) // true
```



**完整的原型链**

![prototype4](E:\wangjh\web资料\learn\blog\图片及截图\prototype4.png)

上面图形得到

```
function Foo() {

}
var f1 = new Foo();
f1.__proto__ = Foo.prototype
Foo.prototype.__proto__ = Object.prototype
Object.prototype.__proto__ = null
```

参考：[原型链](https://juejin.cn/post/6844903989088092174#heading-1)



#### this的指向

例子1：

```
var o = {
    a:10,
    b:{
        a:12,
        fn:function(){
            console.log(this.a); //12   
            console.log(this); // b对象 
		}
    }
}
o.b.fn();
```

 例子2：

```
var o = {
  a:10,
  b:{
   a:12,
   fn:function(){
      console.log(this.a); //undefined
      console.log(this); //window   
	}
  }
}
var j = o.b.fn;
j();
```

**总结：this永远指向的是调用它的对象（谁调用指向谁）；**



**当this碰到return时：**

​		如果返回值是一个对象(null除外)，那么返回的该对象，如果返回值不是一个对象，那么返回该函数的实例。

```
function fn(){
  this.num = 1;
}
var a = new fn(); 
console.log(a.num); //1

function fn(){
    this.num = 1;
    return {
      num:2
    }
}
var a = new fn(); 
console.log(a.num); //2

function fn(){
    this.num = 1;
    return undefined
}
var a = new fn(); 
console.log(a.name); //1

```

**箭头函数**

​	先看箭头函数和普通函数的重要区别：

> 1、没有自己的`this`、`super`、`arguments`和`new.target`绑定。
> 2、不能使用`new`来调用。
> 3、没有原型对象。
> 4、不可以改变`this`的绑定。
> 5、形参名称不能重复。

​	众所周知，ES6 的箭头函数是可以避免 ES5 中使用 this 的坑的。**箭头函数的 this 始终指向函数定义时的 this，而非执行时。**

箭头函数需要记着这句话：“箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则`this`的值则被设置为全局对象。”

例子1：

```
var name = 'window';
var student = {
    name: 'will',
    doSth: function(){
        var arrowDoSth = () => {
           console.log(this.name);
        }
        arrowDoSth();
    },
    arrowDoSth2: () => {
        console.log(this.name);
    }
}
student.doSth(); // 'will'
student.arrowDoSth2(); // 'window'
```

​	其实就是相当于箭头函数外的`this`是缓存的该箭头函数上层的普通函数的`this`。如果没有普通函数，则是全局对象（浏览器中则是`window`）。

例子2：

```
var student = {
    name: 'will',
    doSth: function(){
        console.log(this.name);
        return () => {
            console.log('arrowFn:', this.name);
        }
    }
}
var person = {
    name: 'person',
}
student.doSth().call(person); // 'will'  'arrowFn:' 'will'
student.doSth.call(person)(); // 'person' 'arrowFn:' 'person'
```

**注意：无法通过`call`、`apply`、`bind`绑定箭头函数的`this`(它自身没有`this`)。而`call`、`apply`、`bind`可以绑定缓存箭头函数上层的普通函数的`this`。**



**new关键字**

​	new用于新建一个对象，例如：

```
function Man() {}
var m = new Man();
```

这就有要说另一个面试经典问题：new 的过程了

下面的代码用js模拟了new操作：

```
function newObj(Fun,arguments) {
    var o = {};
    if (Fun &amp;&amp; typeof Fun === "function") {
        o.__proto__ = Fun.prototype;
        Fun.apply(o, arguments);
        return o;
    }
}
```

从代码中可以看出，首先新建一个对象o，然后修改**proto**指向Fun.prototype，然后以o为上下文(context)执行Fun函数，最后返回o。因为对象的**proto**设置是在new操作中的，所以导致了以下现象

1. 创建一个空对象 o;

2. 将新创建的空对象的隐式原型指向其构造函数的显示原型。

3. 使用 call 改变 this 的指向

4. 如果无返回值或者返回一个非对象值，则将 o返回作为新对象；如果返回值是一个新对象的话那么直接直接返回该对象。

   

#### call、apply、bind方法详解

​	call、apply和bind是Function对象自带的三个方法，都是为了改变函数体内部 this 的指向。bind不会立即调用，其他两个会立即调用

```
var obj = {}//定义一个空的对象

function f(x,y){

    console.log(x,y)

    console.log(this) //this是指obj

}
f.apply(obj,[1,2]) //后面的值需要用[]括起来

f.call(obj,1,2) //直接写

f.bind(obj,1,2)（）//调用
```

**应用：**

A.利用apply()求最大值

​	var arr =[2,6,8,3,4,9,7,23,56,889]; 

​	console.log(Math.max.apply({},arr))

B.   检查数据类型；

​	Object.prototype.toString.call(12)



参考：[this、apply、call、bind 详情](https://juejin.cn/post/6844903496253177863#heading-12)