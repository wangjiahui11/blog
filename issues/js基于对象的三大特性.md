## js基于对象的三大特性

#### 基本概述

 	 Javascript基于对象的三大特征和C++，Java面向对象的三大特征一样，都是封装(encapsulation)、继承(inheritance )和多态(polymorphism )。只不过实现的方式不同，其基本概念是差不多的。其实除三大特征之外，还有一个常见的特征叫做抽象(abstract)，这也就是我们在一些书上有时候会看到面向对象四大特征的原因了。



#### 一、封装性

  	封装就是把抽象出来的**数据**和**对数据的操作（方法）**封装在一起，数据被保护在内部，程序的其它部分只有通过被授权的操作(成员方法)，才能对数据进行操作。

　 **JS封装只有两种状态，一种是公开的，一种是私有的。**

​	例子1：

```
function Person(name,age){
    this.name=name;         //公开
    var age=age;            //私有
    this.show1=function(){ //公开
       console.log(this.name+" "+age);
    }
    function show2(){      //把函数私有化
       console.log("你好"+this.name+" "+age);
    }
}
var p1 = new Person('will', 20); 
console.log(p1.name + " is " +p1.age); //will is undefined
p1.show1();//will 20
p1.show2();//VM302:1 Uncaught TypeError: p1.show2 is not a function(…)
```

**封装的目的：**	

- 对象内部的变化对外界是透明的,不可见，这种做法使对象之间低耦合,便于维护升级,团队协作开发。
- 开发者不用过多关心内部如何实现，只需关注方法的用途和如何调用，让开发变得更加简单。



#### 二、继承性

​		继承可以解决代码复用，让编程更加靠近人类思维。当多个类存在相同的属性(变量)和方法时，可以从这些类中抽象出父类，在父类中定义这些相同的属性和方法，所有的子类不需要重新定义这些属性和方法，只需要通过继承父类中的属性和方法。

```
/**
 * 简单的es5原型继承
 * @constructor
 */
var A=function () {
}
A.prototype={name:"gcy"};

var B=function () {
};
B.prototype=new A();

var b=new B();
console.log(b.name); //gcy

/**
 * e6继承实现demo
 */
class People{
    constructor(name){
        this.name=name;
    }
    getName(){
        return this.name;
    }
}

class Black extends People{
    constructor(name){
        super(name);
    }
    speak(){
        return " i am black";
    }
}
var peo=new Black("gcy");

console.log(peo.getName()+' says '+peo.speak());
```

其实原型继承方式写法很多。我认为还是理解原型链机制比较重要,关键就是理解prototype和__proto__

具体参考：[JavaScript继承]()



#### 三、多态

​		**概念：多态是指一个引用(类型)在不同情况下的多种状态。也可以理解成：多态是指通过指向父类的引用，来调用在不同子类中实现的方法。**

```
/**
     * 多态的实现案例
     * @param animal
     */
    var makeSound=function (animal) {
        animal.sound();
    }
    var Duck=function () {
    }
    var Dog=function () {
    }
    Duck.prototype.sound=function () {
        console.log("嘎嘎嘎")
    }
    Dog.prototype.sound=function () {
        console.log("旺旺旺")
    }
    makeSound(new Duck());
    makeSound(new Dog());
```

​	下面这个例子就说明了,一个动物能否实现叫声,只取决于makeSound,不针对某种类型的对象。不同动物不同叫声，即叫声有多种状态。

