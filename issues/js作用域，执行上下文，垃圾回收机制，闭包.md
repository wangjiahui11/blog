##  js作用域，执行上下文，垃圾回收机制，闭包

#### 作用域

------

​	 在JavaScript中，我们可以将作用域定义为一套规则这套规则用来管理引擎如何在当前作用域以及嵌套的子作用域中根据标识符名称进行变量查找。

大白话：作用域规定了如何查找变量，也就是确定当前执行代码对变量的访问权限。

- JavaScript中只有全局作用域与函数作用域(局部作用域）。

  **全局作用域**

  ​	a.最外层环境变量和函数具有全局作用域；如：a，outer；

   	b.未定义直接赋值的变量自动声明为全局的作用域；

  ​	c.window对象的属性具有全局作用域；

  **局部作用域**

  ​	函数作用域,是指声明在函数内部的变量a

  ```
  var a = "a"; 
  function outer(){    
  	b ='未声明的变量'   
  	var c= 'c'
   } 
  outer(); // 这里只能访问 a  全局
  console.log(a) // 全局
  console.log(window.name)  // 全局
  ```

- ES6 之前 JavaScript 没有块级作用域,只有全局作用域和函数作用域。

  特点：块级作用域可通过新增命令let和const声明，所声明的变量在指定块的作用域外无法被访问；

  ```
  {let a = 10;var b = 1;}
  a // ReferenceError: a is not defined.
  b // 1
  ```



#### 作用域链	

------

​	 作用域链，是由当前环境与上层环境的一系列变量对象组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问；

```
var color = "blue"; 
function chabngeColor(){    
	var anotherColor = "red"; 
    function swapColors(){        
        var tempColor = anotherColor;        
        anotherColor = color;        
        color = tempColor;   // 这里可以访问 color、anotherColor 和 tempColor   
    } 
    swapColors();  // 这里可以访问 color 和 anotherColor      
 } 
changeColor(); // 这里只能访问 color  全局
```

​	![作用域链](https://github.com/wangjiahui11/blog/blob/main/图片及截图/作用域链.png)

上述作用域链中包含 3个对象：

swapColors()的变量对象

changeColor()的变量对象

全局变量对象。

swapColors()的局部环境开始时会先在自己的 变量对象中搜索变量和函数名，如果搜索不到则再搜索上一级作用域链。changeColor()的作用域链只包含两个对象：它自己的变量对象和全局变量对象。这也就是说，它不能访问 swapColors()的 环境。 

**简单理解：搜索变量时，一层一层向上寻找（即先从自己的执行环境中查找，然后依次往上），直到找到全局作用域还是没找到，就宣布放弃。这种一层一层的关系，就是作用域链 。**



#### 作用域与执行上下文区别	

------

​	许多开发人员经常混淆作用域和执行上下文的概念，误认为它们是相同的概念，但事实并非如此。	

​	我们知道JavaScript属于解释型语言，JavaScript的执行分为：解释和执行两个阶段,这两个阶段所做的事并不一样：

##### 解释阶段：

- 词法分析
- 语法分析
- 作用域规则确定

##### 执行阶段：

- 创建执行上下文
- 执行函数代码
- 垃圾回收

​	![js代码执行的过程](E:\wangjh\web资料\learn\blog\图片及截图\js代码执行的过程.png)

​	**作用域在解析的阶段已经确定了，执行上下文则是在函数执行之前确定；**

​	作用域和执行上下文之间最大的区别是： **执行上下文在运行时确定，随时可能改变；作用域在定义时就确定，并且不会改变**。



参考文章：

[深入理解JavaScript作用域和作用域链](https://juejin.cn/post/6844903797135769614#heading-7)

[前端基础进阶（四）：详细图解作用域链与闭包](https://segmentfault.com/a/1190000012646221)

[彻底明白作用域、执行上下文](https://segmentfault.com/a/1190000013915935)



#### 垃圾回收机制

------

​		垃圾回收又称为 GC(Garbage Collecation)。编写 JavaScript 程序时，开发者不需要手工跟踪内存的使用情况，只要按照标准写 JavaScript 代码，JavaScript 程序运行所需内存的分配以及无用内存的回收完全是自动管理。JavaScript 中自动垃圾回收机制的原理为：

```
找出那些不再使用的变量（打标），然后释放其占用的内存（清除）。
垃圾收集器会按照固定的时间间隔(或预定的收集时间)周期性地执行此操作
```

标识无用变量的策略通常有两个：**标记清除** 和 **引用计数** 。

###### 标记清除

标记清除(mark-and-sweep) 是 JavaScript 中最常用的垃圾回收方式。其执行机制如下：

- 当变量进入环境时，就将其标记为“进入环境”
- 当变量离开环境时将其标记为“离开环境”

逻辑上，永远不能释放进入环境的变量所占用的内存，因为执行流进入相应的环境时，可能会用到它们。
 标记变量的方式有很多种，可以使用标记位的形式记录变量进入环境，也可单独为“进入环境”和“离开环境”添加变量列表来记录变化。

标记清除采用的收集策略为：

- JavaScript中的垃圾收集器运行时会给**存储在内存中的所有变量**都加上标记；
- 然后去掉环境中的变量以及被环境中的变量引用的变量的标记；
- 此后，再被加上标记的变量被视为准备删除的变量；
- 最后，垃圾收集器完成内存清除，销毁那些带标记的值并回收其占用的内存空间。

2008年之前，IE、Firefox、Opera、Chrome 和 Safari 的 JavaScript实现使用的均为 标记清除式的垃圾回收策略，区别可能在垃圾收集的时间间隔。



###### 引用计数

引用计数(reference counting) 是另一种垃圾收集策略。引用计数的本质是 **跟踪记录每个值被引用的次数**。其执行机制如下：

- 当声明一个变量并将一个引用类型值赋值给该变量时，这个值的引用次数为1；
- 若同一个值(变量)又被赋值给另一个变量，则该值的引用次数加1；
- 但是如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数减1；
- 当这个值的引用次数为0时，则无法再访问这个值，就可回收其占用的内存空间。

垃圾收集器下次运行时，会释放那些引用次数为零的值所占用的内存。
 引用计数存在一个致命的问题： **循环引用**。循环引用是指，对象 A 中包含一个指向对象 B 的指针，而对象 B 中也包含一个指向对象 A 的引用。下面的代码就是标准的循环引用的例子：

```
function cycleRefernce() {
    var objectA = new Object();
    var objectB = new Object();
    
    objectA.someOtherObject = objectB;
    objectB.anotherObject = objectA;
}
```

上述例子中 objectA 和 objectB 通过各自属性相互引用。按照引用计数的策略，两个对象的引用次数均为 2。若采用标记清除策略，函数执行完毕，对象离开作用域就不存在相互引用。但采用引用计数后，函数执行完，两个对象的引用次数永不为0，会一直存尊内存中，若多次调用，导致大量内存得不到回收。

参考：[JavaScript 垃圾回收机制](https://juejin.cn/post/6844903858972409869#heading-4)



#### 闭包

------

**闭包：闭包就是有权访问另一个函数作用域的变量的函数。**

在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。

```
function foo() {
    var a = 20;
    var b = 30;

    function bar() {
        return a + b;
    }

    return bar;
}

var bar = foo();
bar()
```

​	上面的例子，首先有执行上下文foo，在foo中定义了函数bar，而通过对外返回bar的方式让bar得以执行。当bar执行时，访问了foo内部的变量a，b。因此这个时候闭包产生。

**闭包的两个作用；**

- 读取函数内部的变量，
- 让变量的值始终保持在内存中。

**缺点**

- 闭包会使得函数中的变量都被保存在内存中，内存消耗很大，导致内存泄漏;
- 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。

**内存空间的释放**

函数的作用域及其所有的变量会在函数执行结束之后销毁。但是在创建了闭包之后，这个函数的作用域会一个保存到闭包不存在为止。

```
function handler() {
    let ele = document.getElementById('app')
    ele.onclick = function() {
        console.log(ele.id)
    }
}
```

上述代码中`onClick`事件创建了一个闭包，保存了对于外部`ele`的引用，使得其引用数至少为1，因此无法被回收。我们可以通过改造代码来将其释放。

```
function handler() {
    const ele = document.getElementById('app')
    const id = ele.id
    ele.onclick = function() {
        console.log(id)
    }
    ele = null
}
```

​	上述代码中，即使闭包不直接引用`ele`，包含函数的活动对象中也仍然会保留一个引用，因此我们有必要手动将`ele`变量设置为`null`。这样就能够解除对DOM 对象的引用，顺利地减少其引用数，确保正常回收其占用的内存。

​	由于闭包的这种特性会使得其携带包含它函数的作用域，因此会比其他函数占用更多的内存，在过度使用闭包的情况下可能会导致内存占用过多。

**this的问题**

例子一：

```
　　var name = "The Window";
　　var object = {
　　　　name : "My Object",
　　　　getNameFunc : function(){
　　　　　　return function(){
　　　　　　　　return this.name;
　　　　　　};
　　　　}
　　};
　　alert(object.getNameFunc()());
```

匿名函数的执行环境具有全局性，通常我们会使用匿名函数来创建闭包，因此此时的`this`对象通常会指向`window`。

例子二：

```
　　var name = "The Window";
　　var object = {
　　　　name : "My Object",
　　　　getNameFunc : function(){
　　　　　　var that = this;
　　　　　　return function(){
　　　　　　　　return that.name;
　　　　　　};
　　　　}
　　};
　　alert(object.getNameFunc()());
```

缓存`obj`内部的`this`来达到访问`obj`内部`name`属性的目的。

