### 前言
es6当前前端必备技能，内容较多，工作中很多特性了用不上，掌握核心点才是关键
![es6核心知识点](https://user-images.githubusercontent.com/33975307/99338507-4962ac00-28bf-11eb-8e30-f26f93cb9a73.png)
####  一、开发环境的配置
2015 年 6 月，ECMAScript 6 正式通过，成为国际标准。目前有一些兼容性问题；

具体参考： [点击查看ES6 的支持](https://kangax.github.io/compat-table/es6/)

解决方案：Bable转换器---Babel 是一个广泛使用的 ES6 转码器，可以将 ES6 代码转为 ES5 代码；

在命令行中：
`	$ npm install --save-dev @babel/core babel-preset-es2015 babel-preset-latest
`
配置//.babelrc文件如下
	{
    	"presets": ["es2015", "latest"],
    	"plugins": []
	}

#### 二、核心知识点

1. ##### **let和const**

   - **let的特性**

     - l声明变量，只在块级有效 ---在代码块以外调用会报错，var是全局的变量

       ```
       {let a = 10;var b = 1;}
       a // ReferenceError: a is not defined.
       b // 1
       ```

     - 不存在变量提升（var会对变量提升）

       ```
       // var 的情况
       console.log(foo); // 输出undefined
       var foo = 2;
       
       // let 的情况
       console.log(bar); // 报错ReferenceError
       let bar = 2;
       ```

     - 暂时性死区（在使用let声明之前，该变量时不可用的）

       ```
       if (true) {
         // TDZ开始
         tmp = 'abc'; // ReferenceError
         console.log(tmp); // ReferenceError
       
         let tmp; // TDZ结束
         console.log(tmp); // undefined
       
         tmp = 123;
         console.log(tmp); // 123
       }
       // 隐秘的暂时性死区，y没有定义
       function bar(x = y, y = 2) {
         return [x, y];
       }
       
       bar(); //Uncaught ReferenceError: Cannot access 'y' before initialization
       ```

     - 不重复声明

   - **为什么需要块级作用域？**

     ```
     第一场景 内层变量可能覆盖外层变量；
     var tmp = new Date();
     function f() {
       console.log(tmp);
       if (false) {
         var tmp = 'hello world';
       }
     }
     f(); // undefined
     第二种场景，用来计数的循环变量导致内存泄漏。
     var s = 'hello';
     for (var i = 0; i < s.length; i++) {
       console.log(s[i]);
     }
     console.log(i); // 5
     
     ```

   - **const的特性**

     - 基本用法  ——其他特性和let一致；

       ```
       // 简单数据类型
       const PI = 3.1415;
       PI = 3;// TypeError: Assignment to constant variable.
       
       const foo = {};
       // 为 foo 添加一个属性，可以成功
       foo.prop = 123;
       foo={} // TypeError: "foo" is read-only
       ```

     - 本质上内存地址所保存的数据不可变 

       1.简单类型的数据，值指向那个内存地址，即等同于常量；

       2.复杂数据类型，变量固定的指向指针，保证指针指向不变；

       

   - **ES6 声明变量的六种方法**

     ES6中有6中变量声明：var , function, let ,const ,class ,export

2. ##### **解构赋值**

   - **定义**：ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构）。

   - **条件**：具备遍历器（Iterator）就是这样一种机制，Array，Object，Map，Set这样才能进行遍操作；

   - **解构方式**：完全结构，部分解构，解构失败

     ```
     1.数组（按顺序进行解构）
     	let [a, b, c] = [1, 2, 3];
     	let [x, , y] = [1, 2, 3];
     	let [foo] = [];//undefined
     	let [e, f = 'b'] = ['a']; // 默认值 e='a', f='b'
     2.对象（根据key值进行解构）
     	let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
     	let { foo } = { foo: 'aaa', bar: 'bbb' };
     	let { baz } = { foo: 'aaa', bar: 'bbb' };//undefined
     	let {x, y = 5} = {x: 1};// 默认值 x : 1,y : 5
     	// 变量和属性名不一致时
     	let { first: f, last: l } =  { first: 'hello', last: 'world' };
     	注意点：针对已定义的变量，js会理解为代码块，解决方法：采用（）方式
     	let x;  {x} = {x: 1};  // SyntaxError: syntax error
     	let x;  ({x} = {x: 1}); // 正确
     3.字符串 
     	const [a, b, c, d, e] = 'hello';//转换成类似Array
     	let {length : len} = 'hello';;//转换成类似Object
     4.布尔和数值（先将等号右边转换成对象，再通过对象将toSting方法解构）
     	let {toString: s} = 123;//s === Number.prototype.toString // true
     5.函数参数
         function add([x, y]){return x + y;}
         add([1, 2]); // 3
         function move({x = 0, y = 0} = {}) {return [x, y]; } // 默认值
     	move({x: 3}); // [3, 0]
     
     ```

   - 用途

     1.值交换

     2.函数返回多个值

     3.函数定义（默认值和参数）

     4.提取 JSON 数据

3. ##### 字符串

   - **字符串遍历接口Iterator**（for...of，for...in ）

   - **模板字符串 ``**

     ```
     function fn() {
       return "Hello";
     }
     let name = 'wjh'
     
     `foo ${fn()} ${name}`
     ```

   - **标签模板**

     ```
     /* “标签”指的就是函数  
     	tag`A ${ a + b } B ${ a * b }`;
       	模板字符串里面纯字符串转换成TAG([A,B,''],a,b)
     */
     
     let a = 5;
     let b = 10;
     
     tag`Hello ${ a + b } world ${ a * b }`;
     // 等同于
     tag(['Hello ', ' world ', ''], 15, 50);
     function tag(s, v1, v2) {
       console.log(s[0],'-',s[1],'-',s[2],'-',v1,'-',v2);
       return "OK";
     }
     ```

   - ##### 字符串的新增方法

     ```
     1.includes(), startsWith(), endsWith() 是否含有 返回布尔
         let s = 'Hello world!';
         s.startsWith('Hello') // true  -- 起始位置
         s.endsWith('!') // true   -- 结束位置
         s.includes('o') // true  -- 是否含有 
     2.repeat() --重复次数
     	'hello'.repeat(2) // "hellohello"
     3.padStart padEnd 补全功能
         'x'.padStart(4, 'ab') // 'abax'
         'x'.padEnd(4, 'ab') // 'xaba'
     	
     4.tirm(),trimStart(),trimEnd() // 去掉空格  返回新的字符串，原来的字符串不改变
         cnst s = '  abc  ';
         s.trim() // "abc"
         s.trimStart() // "abc  "
         s.trimEnd() // "  abc"
     5.replaceAll (不能使用正则)
     	'aabbcc'.replace('b', '_')  // 'aa_bcc'
     	'aabbcc'.replace(/b/g, '_')  // 'aa__cc'
     	// 等价于
     	'aabbcc'.replaceAll('b', '_')  // 'aa__cc'
     	
     ```

4. ##### **数值（新增几个方法）**

   ```
   // Number.isFinite() 判断一个数值是否是有限
   	Number.isFinite(15); // true Number.isFinite(Infinity); // false
   // Number.isNaN()   检查一个数值是都NaN
   	Number.isNaN(NaN) // true  Number.isNaN(15) // false
   // parseInt parseFloat 个全局的方法重写
       Number.parseInt('12.34') // 12
       Number.parseFloat('123.45#') // 123.45
   ```

5. ##### **函数**

   - **函数的默认值**

     ```
     // 基本用法
     function log(x, y = 'World') {
       console.log(x, y);
     }
     log('Hello', 'China') // Hello China
     
     // 解构默认值
     function foo({x, y = 5}={}) {
       console.log(x, y);
     }
     foo({x: 1, y: 2}) // 1 2
     
     // ------------区别：----------------
     // 写法一  参数默认值为空对象，设置解构赋值的默认值；
     function m1({x = 0, y = 0} = {}) {
       return [x, y];
     }
     
     // 写法二  函数参数具体属性的对象，没有设置默认的参数
     function m2({x, y} = { x: 0, y: 0 }) {
       return [x, y];
     }
     // x 有值，y 无值的情况
     m1({x: 3}) // [3, 0]
     m2({x: 3}) // [3, undefined]
     
     // 作用域问题
     let x = 1;
     function f(y = x) {
       let x = 2;
       console.log(y);
     }
     f() // 1
     上面代码中，函数f调用时，y = x形成一个单独的作用域。
     这个作用域里面，变量x本身没有定义，指向外层的全局变量x。
     函数调用时，函数体内部的局部变量x影响不到默认值变量x。
     ```

   - **rest参数**

     ```
     // rest 参数（形式为...变量名），用来获取函数的多于参数，该变量将多余的参数存于数组中。
     function add(...values) {
       let sum = 0;
       for (var val of values) {
         sum += val;
       }
       return sum;
     }
     add(2, 5, 3) // 10
     ```

   - **箭头函数**

     ```
     var sum = (num1, num2) => num1 + num2;
     // 等同于
     var sum = function(num1, num2) {
       return num1 + num2;
     };
     // 如果多于一段代码也可以用{}包裹起来
     var sum = (num1, num2) => { let a=11;return num1 + num2; }
     
     // 如果返回的是个对象 需要用（）包裹起来
     let getItem = id => ({ id: id, name: "Temp" });
     注意点：
         1.箭头函数的this，指向所在区域所在的对象，而不是使用时的对象
         2.不可以当作构造函数，不可以使用new命令
     	3. 不可以用arguments对象，可以用 rest 参数代替。
     	this的问题：
     	function Timer() {
           this.s1 = 0;
           this.s2 = 0;//this => Timer 这个函数
           // 箭头函数
           setInterval(() => this.s1++, 1000);
           // 普通函数
           setInterval(function () {
             this.s2++; // this 最后window调用它，即window
           }, 1000);
         }
         var timer = new Timer();
         setTimeout(() => console.log('s1: ', timer.s1), 3100);
         setTimeout(() => console.log('s2: ', timer.s2), 3100);
         // s1: 3
     ```

6. ##### **数组的扩展**

   - **扩展运算符**

     ```
     // 与rest的逆运算，将数组转换成带逗号的序列参数 
     console.log(...[1, 2, 3]) // 1 2 3
     
     function push(array, ...items) { // rest 将序列参数转换成数组
       array.push(...items);  // 将数组转换成序列参数
     }
     function add(x, y) {return x + y;}
     const numbers = [4, 38];
     add(...numbers) // 42 // 将数组转换成序列参数
     扩展运算符应用
     a.复制数组
         const a1 = [1, 2];
         const a2 = [...a1];// 写法一
         const [...a2] = a1;// 写法二
     b.合并数组
         const arr1 = ['a', 'b'];
         const arr2 = ['c'];
         const arr3 = ['d', 'e'];
     	[...arr1, ...arr2, ...arr3] // ES6 的合并数组
     c.解析数组
         const [first, ...rest] = [1, 2, 3, 4, 5];
         first // 1
         rest  // [2, 3, 4, 5]
     d.字符串转数组
         [...'hello']     // [ "h", "e", "l", "l", "o" ]
     ```

   -    **Array.form()**

     ```
     用于将类似数组的对象（array-like object）和可遍历（iterable）的对象转换成---数组
     类似数组
     let arrayLike = {
         '0': 'a',
         '1': 'b',
         '2': 'c',
         length: 3
     };
     // ES6的写法
     let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
     
     // 可接受第二参数，类似于map的方法
     Array.from([1, 2, 3], (x) => x * x)
     ```

   - **Array.of()**

     ```
     Array.of方法用于将一组值，转换为数组。
     Array.of(3, 11, 8) // [3,11,8]
     ```

   - **数组实例的 copyWithin()**

     ```
     [1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]
     ```

   - **数组实例的 find() 和 findIndex()**

     ```
     [1, 4, -5, 10].find((n) => n < 0)  // -5
     [1, 5, 10, 15].findIndex((value, index, arr)=> value > 9) // 2
     ```

   - **数组实例的 fill()** 

     ```
     ['a', 'b', 'c'].fill(7) // [7, 7, 7]
     ['a', 'b', 'c'].fill(7, 1) // // ['a', 7, 7]
     ['a', 'b', 'c'].fill(7, 1, 2) // // ['a', 7, 'c']
     ```

   - ##### **数组实例的 entries()，keys() 和 values()**

     ```
     for (let index of ['a', 'b'].keys()) {
       console.log(index); // 0 1
     }
     
     for (let elem of ['a', 'b'].values()) {
       console.log(elem);// a b
     }
     
     for (let [index, elem] of ['a', 'b'].entries()) {
       console.log(index, elem); // 0,a  1,b
     }
     ```

   - **数组实例的 includes()**

     ```
     // ----------数组中是否含有----------
     [1, 2, 3].includes(2)     // true
     [1, 2, 3].includes(4)     // false
     [1, 2, NaN].includes(NaN) // true
     [1, 2, 3].includes(3, 1);  // false
     ```

   - **数组实例的 flat()，flatMap()**

     ```
     Array.prototype.flat()用于将嵌套的数组“拉平”，变成数组,返回一个新数组，对原数据没有影响。
         [1, 2, [3, 4]].flat() // [1, 2, 3, 4]
         [1, 2, [3, [4, 5]]].flat(2) // [1, 2, 3, 4, 5]
         [1, [2, [3]]].flat(Infinity) // [1, 2, 3] // 拉平嵌套的数组
     flatMap()方法对原数组的每个成员执行一个函数，对返回值组成的数组执行flat()方法。返回一个新数组，不改变原数组。
         [2, 3, 4].flatMap((x) => [x, x * 2])   // [2, 4, 3, 6, 4, 8]
     ```

   - **数组空位**（目前规则目前还不怎么统一）

7. ##### **对象的扩展和新增方法**

   - **对象的扩展**

     - 对象的简洁语法

       ```
       ES6 允许直接写入变量和函数，作为对象的属性和方法。
       const foo = 'bar';
       const baz = {foo};  // 变量作为属性
       baz // {foo: "bar"}
       
       const o = {
         method() {  // 函数直接作为对象的方法 
           return "Hello!";
         }
       };
       ```

     - 对象的表达式

       ```
       ES6 允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。
       let propKey = 'foo';
       let obj = {
         [propKey]: true,
         ['a' + 'bc']: 123
       };
       ```

     - 方法的name属性

       ```
       对象的方法也是函数，即name返回的是函数名称
       const person = {
         sayName() {
           console.log('hello!');
         },
       };
       person.sayName.name   // "sayName"
       ```

     - 可枚举和遍历

       ```
       ES6 一共有 5 种方法可以遍历对象的属性。
       （1）for...in
       	for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。
       （2）Object.keys(obj)
       	Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
       （3）Object.getOwnPropertyNames(obj)
       	Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。
       （4）Object.getOwnPropertySymbols(obj)
       	Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名。
       （5）Reflect.ownKeys(obj)
       	Reflect.ownKeys返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。
       	总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用for...in循环，而用Object.keys()代替。
       ```

     - super关键字

       ```
       this关键字总是指向函数所在的当前对象(调用的对象)，关键字super，指向当前对象的原型对象。
       const proto = {
         foo: 'hello'
       };
       const obj = {
         foo: 'world',
         find() {
           return super.foo;
         }
       };
       Object.setPrototypeOf(obj, proto);
       obj.find() // "hello"
       ```

     - 对象的扩展运算符

       ```
       对象的扩展运算符（...）用于取出参数对象的所有可遍历属性，拷贝到当前对象之中。
       let z = { a: 3, b: 4 };
       let n = { ...z };
       n // { a: 3, b: 4 }
       // 数组为特殊对象处理
       let foo = { ...['a', 'b', 'c'] };
       foo // {0: "a", 1: "b", 2: "c"}
       // 字符串类似数组对象
       {...'hello'} // {0: "h", 1: "e", 2: "l", 3: "l", 4: "o"}
       
       let aClone = { ...a };
       // 等同于
       let aClone = Object.assign({}, a);
       ```

   - **对象的新增方法**

     - **Object.is()**

       ```
       ES5 比较两个值有缺陷 == 会进行数据转换， === 严格匹配模式 NaN不能与本身，-0 与+0相等
       ES6 新增Object.is()方法 同值相等的算法；
       Object.is('foo', 'foo')// true
       Object.is({}, {})// false
       ```

     - **Object.assign()**

       ```
       Object.assign()方法用于对象的合并，将源对象的所有可枚举属性，复制到目标对象（target）
       const target = { a: 1 };
       const source1 = { b: 2 };
       const source2 = { c: 3 };
       Object.assign(target, source1, source2);
       target // {a:1, b:2, c:3}
       
       注意点：
       1.Object.assign()方法实行的是浅拷贝，而不是深拷贝。拷贝是指针
           const obj1 = {a: {b: 1}};
           const obj2 = Object.assign({}, obj1);
           obj1.a.b = 2;
           obj2.a.b // 2	
        2.数组的处理---会把数组视为对象。
           Object.assign([1, 2, 3], [4, 5])   // [4, 5, 3]
       ```

     - **Object.getOwnPropertyDescriptors()** 

       ```
       ES2017 引入了Object.getOwnPropertyDescriptors()方法，返回指定对象所有自身属性（非继承属性）的描述对象。
       const obj = {
         foo: 123,
       };
       
       Object.getOwnPropertyDescriptors(obj)
       // { 
       //    foo:{ value: 123,
       //      writable: true,
       //      enumerable: true,
       //      configurable: true
       //    },
       // }
       ```

     - **proto属性，Object.setPrototypeOf()，Object.getPrototypeOf()**

       ```
       _proto_ 读取或设置原型链prototype的值 （所有浏览器（包括 IE11）都部署了这个属性。）
       Object.setPrototypeOf(object, prototype) 设置原型链prototype的值
       Object.getPrototypeOf(object);           获取原型链prototype的值
       ```

     - **Object.keys()，Object.values()，Object.entries()**

       ```
       	Object.keys配套的Object.values和Object.entries，作为遍历一个对象的补充手段，供for...of循环使用。
           var obj = { foo: 'bar', baz: 42 };
           Object.keys(obj) // ["foo", "baz"]
           Object.values(obj) // ["bar", 42]
           Object.entries(obj) // [ [ 'foo', 'abc' ] ]
       
           let {keys, values, entries} = Object;
           let obj = { a: 1, b: 2, c: 3 };
           for (let key of keys(obj)) {
             console.log(key); // 'a', 'b', 'c'
           }
            // 等效于
           for(let key in obj){
             console.log(key); // 'a', 'b', 'c'
           }
           for (let value of obj) {
             console.log(value); // 1, 2, 3
           }
           for (let [key, value] of entries(obj)) {
             console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
           }
       注意：
           for in 一般用来遍历对象的key值；
           for of 一般用来遍历数组/set/map/字符串等具有迭代器的集合；可以正确响应break、continue和return语句
       ```

8. ##### Symbol

   - **概述**

     ```
     原因：ES5 的对象属性名都是字符串，这容易造成属性名的冲突，如果能保证属性名时独一无二的就好了，故引入symbol；
     简介：Symbol是一种原始数据类型，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。
     ```

   - **基本用法**

     ```
     Symbol 值通过Symbol函数生成。
     let s = Symbol();
     typeof s  // "symbol"
     Symbol还可以接受一个参数，用来对symbol实例进行描述；
     let s1 = Symbol('foo');
     s1 // Symbol(foo)
     s1.toString() // "Symbol(foo)"
     注意事项：
     symbol不能进行隐式转换但可以进行显式转换
     可以转换成boolean类型，但不能转换number类型
     ```

   - **作为对象的属性的symbol**

     ```
     let mySymbol = Symbol();
     
     // 第一种写法
     let a = {};
     a[mySymbol] = 'Hello!';
     
     // 第二种写法
     let a = {
       [mySymbol]: 'Hello!'
     };
     
     // 以上写法都得到同样结果
     a[mySymbol] // "Hello!
     
     注意symbol作为属性时，不能使用点运算符；
     ```

   - **属性名的遍历**

     ```
       let a1=Symbol.for('abc');
       let obj={
         [a1]:'123', 
         'abc':345,
         'c':456
       };
       console.log('obj',obj); // obj  {abc: 345, c: 456, Symbol(abc): "123"}
       
       // 注意：对象中，symbol 做属性值，通过 for in 和 for of 拿不到属性值
       for(let [key,value] of Object.entries(obj)){
         console.log('let of',key,value); // abc 345 // c 456
       }
       
       // Object.getOwnPropertySymbols()方法的示例，可以获取所有 Symbol 属性名。
       Object.getOwnPropertySymbols(obj).forEach(function(item){ // api 结果是数组
         console.log(obj[item]); // 123
       })
       
       // Reflect.ownKeys()方法可以返回所有类型的键名，包括常规键名和 Symbol 键名。
       Reflect.ownKeys(obj).forEach(function(item){ // api 返回数组包含symbol和非symbol
         console.log('ownkeys',item,obj[item]); // abc 345 c 456 Symbol(abc) 123
       })
     
     ```

   - **Symbol.for()，Symbol.keyFor()**

     ```
     有时候我们希望的到相同的symbol值，Symbol.for()接受一个参数，然后搜索有没以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局。
         Symbol.for("bar") === Symbol.for("bar")// true
         Symbol("bar") === Symbol("bar")// false
     symbol没有登记机制，但symbol.for()有，是全局环境的 可以通过Symbol.keyFor()查找
     Symbol.keyFor()方法返回一个已登记的 Symbol 类型值的key。
         let s1 = Symbol.for("foo");
         Symbol.keyFor(s1) // "foo"
     ```

   - 

9. ##### Set和Map的数据结构

   - **Set 和WeakSet**

     - **Set**

       ```
       Set类似于数组，但是成员的值都是唯一的，没有重复的值。
       基本用法：
           const s = new Set();
           [2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
           for (let i of s) {
             console.log(i); // 2 3 5 4
           }
       
           [...new Set(Array)] 等价于 Array.from(new Set(Array)); //数组去重操作
           [...new Set('ababbc')].join('') //字符串去重操作
       
       Set的属性和方法
           属性：constructor构造函数 size 成员总数
           方法：add添加，has是否含有，delete删除，clear清除
       	let s = new Set();
           s.add(1).add(2).add(2);// 注意2被加入了两次
           s.size // 2
           s.has(1) // true
           s.has(3) // false
           s.delete(2);
           s.has(2) // false
       遍历操作
           keys，values，entries，forEach
           Set中没有健名 故值和健都是都是同一值
           let set = new Set(['red', 'green', 'blue']);
           for (let item of set.keys()) {
             console.log(item);
           }   
       
           for (let item of set.values()) {
             console.log(item);
           } // red  green  blue
       
           for (let item of set.entries()) {
             console.log(item);
           }  // ["red", "red"]  ["green", "green"] ["blue", "blue"]
       ```

       

     - **WeakSet**

       ```
       WeakSet 结构与 Set 类似，也是不重复的值的集合。区别在于WeakSet 的成员只能是对象；
       注意：垃圾回收机制不考虑weakSet对该对象的引用用；
       用法：
       	const ws = new WeakSet(); 
       	//可以接受一个数组或类似数组的对象作为参数。且成员必须是数组或者对象；
       	const a = [[1, 2], [3, 4]];
       	const ws = new WeakSet(a); //WeakSet {[1, 2], [3, 4]}
       	const ws = new WeakSet([3, 4]);
       	// Uncaught TypeError: Invalid value used in weak set(…)
       方法：add has delete
           const ws = new WeakSet();
           const obj = {};
           const foo = {};
           ws.add(window);
           ws.add(obj);
           ws.has(window); // true
           ws.has(foo);    // false
           ws.delete(window);
           ws.has(window);    // false
       注意： weakSet 没有size属性，无法遍历操作的；
       ```

   - **Map 和 WeakMap**

     - **Map**

       ```
       简述：Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串；包括对象，各种数据作为键包括对象
       基本用法：
           const m = new Map();
           const o = {p: 'Hello World'};
       
           m.set(o, 'content')
           m.get(o) // "content"
       
           m.has(o) // true
           m.delete(o) // true
           m.has(o) // false
       //  接受一个数组作为参数，数组中成员必须是键值对的数组
           const map = new Map([
             ['name', '张三'],
             ['title', 'Author']
           ]);
       
           map.size // 2
           map.has('name') // true
           map.get('name') // "张三"
       Map的属性和方法
           属性：constructor构造函数 size 成员总数
           方法：add添加，has是否含有，delete删除，clear清除
           const m = new Map();
           const hello = function() {console.log('hello');};
           m.set(hello, 'Hello ES6!') // 键是函数
           m.get(hello)  // Hello ES6!
           m.has(hello) // true
           m.delete(hello)
           m.has(hello) // false
       遍历操作：
           keys，values，entries，forEach
           const map = new Map([
             ['F', 'no'],
             ['T',  'yes'],
           ]);
       
           for (let key of map.keys()) {
             console.log(key);     // "F" "T"
           }
       
           for (let value of map.values()) {
             console.log(value);   // "no" "yes" 
           }
       
           for (let [key, value] of map.entries()) {
             console.log(key, value);  // "F" "no"  "T" "yes"
           }
           // 等同于使用map.entries()
           for (let [key, value] of map) {
             console.log(key, value);  // "F" "no"  "T" "yes"
       	}
       	
       ```

     - **WeakMap**

       ```
       WeakMap结构与Map结构类似，也是用于生成键值对的集合。区别只接受对象（null除外）做为键值名；
       基本用法：
           const wm1 = new WeakMap();
           const key = {foo: 1};
           wm1.set(key, 2);
           wm1.get(key) // 2
       没有遍历操作（即没有keys()、values()和entries()方法），也没有size属性。
       WeakMap只有四个方法可用：get()、set()、has()、delete()，不支持clear方法
       ```

   
