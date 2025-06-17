#                                 js数据类型及判断

1. #### **数据类型：**（原始数据类型和引用数据类型）

   - **基本数据类型**

     ```
     基本类型主要是： Undefined、Boolean、String、Number、Null、Symbol(ES6:表示独一无二的值)；
     var a = "123";
     var b = 12;
     ```

     **特点**：存放在栈中：

     ```
     基本类型存储在栈内存中，数据大小确定，内存空间大小可以分配，按值存放，可直接访问；
     var obj = {}
     ```

   - **复杂数据类型**

     ```
     引用数据类型统称为 Object 对象，主要包括对象、数组、函数、日期和正则
     ```

     **特点**：堆内存中是无序存放：

     ```
     引用类型存放在堆内存中，变量实际上是一个存放在栈内存的指针，这个指针指向堆内存中的地址。每个空间大小不一样，要根据情况进行特定的分配，
     ```

   - **堆内存和栈内存的区别**

     栈内存：用来存放简单的数据类型；

     ![stack类型](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/stack类型.png)

     ```
     var a = 10
     var b = a
     var b =20 
     console.log(a) //10
     ```

     堆内存：用来存放复杂的数据类型；

     ![heap类型](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/heap类型.png)

     ```
     var obj1 = {}
     var obj2 = obj1
     var obj1.name ='tony'
     console.log(obj2.name) //'tony'
     核心：变量保存的其实时一个指针（即引用地址），指针指向的时堆内存的对象
     ```

     参考：[JS中的栈内存堆内存](https://juejin.cn/post/6844903873992196110)

     

2. #### **数据类型的判断**

   - **01.typeof**

     ```
     typeof '12';// string 有效             typeof 1;// number 有效
     typeof Symbol();// symbol 有效         typeof true;//boolean 有效
     typeof undefined;//undefined 有效      typeof null;//object 无效
     typeof [] ;//object 无效               typeof new Function();// function 有效
     typeof new Date();//object 无效        typeof new RegExp();//object 无效
     ```

     **总结：**

     ·     对于基本类型，除 null 以外，均可以返回正确的结果。

     ·     对于引用类型，除 function 以外，一律返回 object 类型。

     ·     对于 null ，返回 object 类型。

     ·     对于 function 返回  function 类型。

     

   - **02.instanceof**

     nstanceof 是用来判断 A 是否为 B 的实例；

     **原理：**

     ```
     function instance_of(L, R) {    //L 表示左表达式，R 表示右表达式
       L = L.__proto__;              // 取 L 的隐式原型
      var O = R.prototype;           // 取 R 的显示原型              
      while (true) { 
        if (L === null) 
          return false; 
        if (O === L)                 // 这里重点：当 O 严格等于 L 时，返回 true 
          return true; 
        L = L.__proto__; 
      } 
     }
     
     ```

     ```
     例子1：
     [] instanceof Object;// true
     
     [] instanceof Object;
     // 为了方便表述，首先区分左侧表达式和右侧表达式
     L = [], R = Object; 
     // 下面根据规范逐步推演
     O = Object.prototype
     L = [].__proto__ = Array.prototype 
     // 第一次判断
     O != L  
     // 循环查找 L 是否还有 __proto__ 
     L = [].prototype.__proto__ = Object.prototype 
     // 第二次判断
     O == L 
     // 返回 true
     ```

     [例子1](![instanceof的原理实例](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/instanceof的原理实例.png))

     **局限性：**instanceof不能检查基本数据类型；

     

   - **03.Object.prototype.toString**

     所有的数据类型都可以用 `Object.prototype.toString` 来检测,而且非常的精准。

     ```
     var arr = []
     Object.prototype.toString.call(arr) == '[object Array]' //true
     
     var func = function() {}
     Object.prototype.toString.call(func) == '[object Function]' //true
     ```

     

   - **04.constructor** 

     constructor 属性返回对创建此对象的数组函数的引用。

     ```
     var aa = [1, 2]
     console.log(aa.constructor === Array) //true
     console.log(aa.constructor === RegExp) //false
     console.log((1).constructor === Number) //true
     ```

     **局限性：**

     ```
     1. null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，这两种类型的数据需要通过其他方式来判断。
     2. 函数的 constructor 是不稳定的，这个主要体现在自定义对象上，当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 Object
     ```

     参考：[数据类型的检测](https://juejin.cn/post/6844903494852296711)

     

3. #### **数据转换**

   数据转换分为显示转换和隐式转换

   - ☀️显示转换：常见的️显式转换方法有：Boolean()、Number()、String()等等

   - 🌛隐式转换：常见的隐式转换方法：四则运算(加减乘除) 、== 、判断语句(if)等

     **显示转换：**

     1. 转换为`Number`类型

        ​	Number(arg) 把给定的值(任意类型)转换成数字（可以是整数或浮点数），它转换的是整个值，而不是部分值；
        ​	parseInt() 、parseFloat()不一样。如果该值不能完全转换为整型或浮点型，则返回NaN。

        ```
        Number("123.1.2.3")       // NaN
        parseInt("123.1.2.3",10)  // 123
        parseFloat("123.1.2.3")   // 123.1
        Number("123.1")           // 123.1
        Number(true)              // 1
        Number(null)              // 0
        Number(undefined)         // NaN
        ```

     2. 转换成`String`类型

        ​	String() 可以把 `null`、`undefined` 转换为字符串，而用 toString() 转换的话，会报错

        ​	null 和 undefined 没有 toString() 方法，会报错 

        ```
        String(null)          // "null"
        String(12+11+true)    // 24
        null.toString()       // error 报错
        (12).toString()       // "12"
        (10).toString(16)     // "a"
        ```

     3. 转换为`Boolean`类型

        Boolean( [value] ) 根据 value 的值返回一个布尔值

        返回 false 的 value 值（共6种）： false、""（空字符串）、0、NaN、null、undefined

        ```
        Boolean(undefined)     // false
        Boolean("")            // false
        Boolean(null)          // false
        Boolean("12345hello")  // true
        Boolean({})            // true
        ```

        

     **隐式转换：**

     1. 转换为`Number`类型；

        - 字符串连接符(+)转成字符串

          ```
          var a = 123
          var n = a + 'helloworld';
          console.log(n)   // '123hellowold'
          
          a = true
          var m = a + 'helloworld'
          console.log(m)   // 'truehelloworld'
          ```

     2. 转换成`String`类型

        - `自增自减运算符` ++/--

        - `加减乘除求余算数运算符` +-*/%

          ```
          var a = '100'
          var b = a--
          var c = a/2
          console.log(b) // 100
          console.log(a) // 99
          console.log(c) // 49.5
          ```

        - `关系运算符` > < >= <= == != === !===

          1. 当关系运算符一边有字符串时，会将其数据类型使用Number转换，再做比较；

          2. 当两边都是字符串时，则都转成Number，注意：此时不是转成对应的数字，而是按照字符串对应的的unicode编码转成数字

          3. 多个字符从左往右进行比较

             ```
             console.log('10' > 3) // true 先转成数字10再比较
             console.log('3' > '10') // true
             
             console.log('3'.charCodeAt()) // 51
             console.log('10'.charCodeAt()) // 49
             
             console.log('abc' > 'b') // false 先比较a和b，a和b不等，直接false
             console.log('abc' > 'ade') // false，先比较aa，相等，继续比较db，得出结果
             console.log('b'.charCodeAt()) // 98
             console.log('d'.charCodeAt()) // 100
             ```

     3. 转换为`Boolean`类型

        数据在逻辑判断和逻辑运算之中会隐式转换为Boolean类型

        - Boolean转换参考上述ToBoolean(argument)说明, 以下这几种数据经过Boolean转换，会转成false，+0、-0、NaN、undefined、null、""、document.all(); 复杂数据类型经过Boolean转换后都是true，如：[]、{}

        - 逻辑非运算符！ 逻辑非运算中，会将数据先做Boolean转换，然后取反

          ```
          var a = undefined
          console.log(!a) // true 先Boolean(a) => false; 再取反 !false => true
          ```

     参考：

     [JavaScript 数据类型转换](https://segmentfault.com/a/1190000006750889)

     [隐式转换](https://juejin.cn/post/6844903880015216653#heading-8)

     

   **== 抽象相等比较**

   这种比较分为两大类，

   - 类型相同

   - 类型不同 相同的就不说了,隐式转换发生在不同类型之间。规律比较复杂，规范比较长，这里也不列举了，[大家可以查看抽象相等算法](http://yanhaijing.com/es5/#104)。简单总结一句，相等比较就不想+运算那样string优先了，是以number优先级为最高。概括而言就是，都尽量转成number来进行处理，这样也可以理解，毕竟比较还是期望比较数值。那么规则大概如下：
      对于x == y

     1. 如果x,y均为number，直接比较

        ```
        1 == 2 //false
        ```

     2. 如果存在对象，ToPrimitive() type为number进行转换，再进行后面比较

        ```
        var obj1 = {
            valueOf:function(){
            return '1'
            }
        }
        1 == obj2  //true
        //obj1转为原始值，调用obj1.valueOf()
        //返回原始值'1'
        //'1'toNumber得到 1 然后比较 1 == 1
        [] == ![] //true
        //[]作为对象ToPrimitive得到 ''  
        //![]作为boolean转换得到0 
        //'' == 0 
        //转换为 0==0 //true
        ```

     3. 存在boolean，按照ToNumber将boolean转换为1或者0，再进行后面比较

        ```
        //boolean 先转成number，按照上面的规则得到1  
        //3 == 1 false
        //0 == 0 true
        3 == true // false
        '0' == false //true 
        ```

     4. 如果x为string，y为number，x转成number进行比较

        ```
        //'0' toNumber()得到 0  
        //0 == 0 true
        '0' == 0 //true 
        ```

   

