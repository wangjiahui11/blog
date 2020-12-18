## js作用域，执行上下文，闭包，垃圾回收机制

### 作用域

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

​	![作用域链](E:\wangjh\web资料\learn\blog\图片及截图\作用域链.png)

上述作用域链中包含 3个对象：

swapColors()的变量对象

changeColor()的变量对象

全局变量对象。

swapColors()的局部环境开始时会先在自己的 变量对象中搜索变量和函数名，如果搜索不到则再搜索上一级作用域链。changeColor()的作用域链只包含两个对象：它自己的变量对象和全局变量对象。这也就是说，它不能访问 swapColors()的 环境。 

**简单理解：搜索变量时，一层一层向上寻找（即先从自己的执行环境中查找，然后依次往上），直到找到全局作用域还是没找到，就宣布放弃。这种一层一层的关系，就是作用域链 。**



### 作用域与执行上下文区别	

------

​	许多开发人员经常混淆作用域和执行上下文的概念，误认为它们是相同的概念，但事实并非如此。	

​	我们知道JavaScript属于解释型语言，JavaScript的执行分为：解释和执行两个阶段,这两个阶段所做的事并不一样：

#### 解释阶段：

- 词法分析
- 语法分析
- 作用域规则确定

#### 执行阶段：

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