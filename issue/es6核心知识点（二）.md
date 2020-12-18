1. ##### Proxy 和 Reflect

   - **Proxy**

     - 简述

       ```
       Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，提供了一种机制，可以对外界的访问进行过滤和改写。
       ```

     - 基本用法

       ```
       /*  语法：
       	1.new Proxy()表示生成一个Proxy实例
        	2.target：目标对象，
        	3.handle：拦截的行为 参数是一个对象
       * /
       var proxy = new Proxy(target, handler);
       实例1：
       var person = {
         name: "张三"
       };
       var proxy = new Proxy(person, {
         get(target, key,receiver) {
           return target[key];
         },
         set(target, key, value, receiver){
            console.log(`设置名称${value}`);
            target[key] =value
          	 return true;
         }
       });

       proxy.time // undefined
       proxy.name // 张三
       proxy.name ='李四' // 设置名称李四
       proxy.name //李四

       prxoy 还支持13中方法：具体参考https://es6.ruanyifeng.com/#docs/proxy
       ```



   - **Reflect**

     - **简述**

       ```
       ES6新增加的api
       目的：
           1.将对象上的方法放在Reflect上，并以静态方法的形式存在，无论Proxy怎么修改，Reflect都能获取的到默认行为；

           2.修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。

           3.让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
           4.Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
       ```

     - **基本用法**

       ```
       // Poxy和Reflect一起使用
       var obj = new Proxy({}, {
         get (target, key, receiver) {
           return Reflect.get(target, key, receiver);
         },
         set (target, key, value, receiver) {
           return Reflect.set(target, key, value, receiver);
         }
       })
       // get方法： Reflect.get(target, name, receiver)
       var myObject = {
         foo: 1,
         bar: 2,
         get baz() {
           return this.foo + this.bar;
         },
       }
       Reflect.get(myObject, 'foo') // 1
       Reflect.get(myObject, 'bar') // 2
       Reflect.get(myObject, 'baz') // 3
       Reflect.get(myObject, 'jack') // undefined
       注意：Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。
       ```

     - **静态方法**

       ```
       Reflect对象一共有 13 个静态方法。

       Reflect.apply(target, thisArg, args)
       Reflect.construct(target, args)
       Reflect.get(target, name, receiver)
       Reflect.set(target, name, value, receiver)
       Reflect.defineProperty(target, name, desc)
       Reflect.deleteProperty(target, name)
       Reflect.has(target, name)
       Reflect.ownKeys(target)
       Reflect.isExtensible(target)
       Reflect.preventExtensions(target)
       Reflect.getOwnPropertyDescriptor(target, name)
       Reflect.getPrototypeOf(target)
       Reflect.setPrototypeOf(target, prototype)
       ```

     - **实例观察者模式**

       ```
       观察者模式（Observer mode）指的是函数自动观察数据对象，一旦数据有变化，函数就会自动执行。
       let hero = {
         name: '赵云',
         equipment: ['马', '长枪']
       }

       const handler = {
         set(target, key, value, receiver) {
           //内部调用对应的 Reflect 方法
           const result = Reflect.set(target, key, value, receiver);
           //执行观察者队列
           observableArray.forEach(item => item());
           return result;
         }
       }

       //初始化Proxy对象，设置拦截操作
       const createProxy = (obj) => new Proxy(obj, handler);

       //初始化观察者队列
       const observableArray = new Set();

       const heroProxy = createProxy(hero);

       //将监听函数加入队列
       observableArray.add(() => {
         console.log(heroProxy.name，'set参数');
       });

       heroProxy.name = "黄忠";
       // --> 黄忠
       ```

2. ##### Promise

   - **简述**

     ```
     定义：
     	Promise是一个抽象异步处理对象及对其进行各种操作的对象；
         最早的异步操作采用回调函数，会导致回调地狱形成，promise提供一种异步编程的处理方案；
     目的：作用主要是解决地狱回调问题.
     Promise有两大特性:
         1.对象的状态不受外界影响；三种状态：pending(进行中)，fulfilled（成功），rejected（失败）
         2.状态的改变是不可逆的；
           pending变为fulfilled   resolve(成功)
           pending变为rejected    reject(失败)
     ```

     ![pronise三种状态.png](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/pronise%E4%B8%89%E7%A7%8D%E7%8A%B6%E6%80%81.png?raw=true)

     ![Promise状态.png](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/Promise%E7%8A%B6%E6%80%81.png?raw=true)

   - **基本用法**

     ```
     Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。
     resolve:状态从“未完成”变为“成功”（即从 pending 变为 resolved）
     reject:状态从“未完成”变为“失败”（即从 pending 变为 rejected）

     const promise = new Promise((resolve, reject) =>{
       // ... some code
       if (/* 异步操作成功 */){
         resolve(value);
       } else {
         reject(error);
       }
     });

     例子:
     let p1 = new Promise((resolve, reject) => {
       resolve(1);
       console.log(2);
     })
     promise.then(r => {
       console.log(r);
     });
     // 2 1
     ```

   - **then, catch,finally**

     ```
        then:then方法是定义在原型对象Promise.prototype上的,它有两个参数resolved(必填),rejected(选填)
        then返回的是一个新的promise的对象（链式编程的原因），当then的回调函数完成之后，会将返回值作为第二个参数传递到下一个回调函数；
        new Promise((resolve, reject) => {
           resolve(1);
         }).then(r=> {
           console.log(r);
           throw  new Error('fail')
         }).then(
         res=>{console.log('succes',res)},
         err=>{console.log('succes',err)}
         );//1,2
         catch:Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，

         例子1:
         p.then((val) => console.log('fulfilled:', val))
         .catch((err) => console.log('rejected', err));
         // 等同于
         p.then((val) => console.log('fulfilled:', val))
         .then(null, (err) => console.log("rejected:", err));

        例子2：
        const promise = new Promise(function(resolve, reject) {
           reject(new Error('test'));
         });
         promise.catch(function(error) {
           console.log(error);
         }); //Error: test

         finally：不管Promise最后的状态是什么都要执行此操作；
         特点：a.不接受任何参数；b.不改变promise的状态，
     ```


         例子1：
         // resolve 的值是 2
         Promise.resolve(2).then(
         (result) => {console.log('result:',result)},
         (err) => {console.log('err:',err)}
         )

         // resolve 的值是 2
         Promise.resolve(2).finally((res) => {console.log(res)})

     ```

   - **Promise chain链式编程**

     [参考promise迷你书](http://liubin.org/promises-book/#promise-chain)

   - **Promise.resolve() Promise.reject()**

     ```
     resolve:
         Promise.resolve('foo')
         // 等价于
         new Promise(resolve => resolve('foo'))
     例子1：
     	Promise.resolve('foo').then(r=>{console.log(r)}) // foo

     rejected：
         const p = Promise.reject('出错了').catch( (s) =>{console.log(s)});
         // 等同于
         const p = new Promise((resolve, reject) => reject('出错了'))
         p.then(null, function (s) {console.log(s)});

      例子1：
     	Promise.resolve('foo').then(null, function (s) {console.log(s)});
     ```



   - **Promise.all(),Promise.race(),Promise.allSettled() ,Promise.any()**

     ```
     all：将多个Promise包装成一个Promise
     	const p = Promise.all([p1, p2, p3]);
     	1.只有状态 p1,p2,p3... 全部转换成fulfilled， promise.all的状态才会转换成fulfilled,此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
     	2.只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个rejected参数会传递p的回调函数；

     例子1：
     	let p1 = new Promise((resolve,reject) =>{resolve(1)})
     	let p2 = new Promise((resolve,reject) =>{resolve(2)})
     	let p3 = new Promise((resolve,reject) =>{resolve(3)})
     	//(3) [1, 2, 3]
     	const p = Promise.all([p1, p2, p3]).then(result=>{console.log(result)})

     race:将多个Promise包装成一个Promise
     	const p = Promise.all([p1, p2, p3]);
     	Promse.race就是赛跑的意思，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态

     例子2：
     	let p1 = new Promise((resolve, reject) => {
         	setTimeout(() => { reject('failed1')},1000)
         })
     	let p2 = new Promise((resolve, reject) => {
     		setTimeout(() => { reject('failed2')},500)
     	})
     	let p3 = new Promise((resolve, reject) => {
     		setTimeout(() => { resolve('success')},2000)
     	})

         Promise.race([p1, p2]).then(
             result => {console.log(result)},
             err => {console.log(err)}
         ) //failed2

     ```

   -

3. **async和await**

   3. - **含义**

        ```
        ES7引入了async和await 目的：使得异步操作变得更加方便。它就是 Generator 函数的语法糖。

        想较比于 Generator，Async 函数的改进在于下面四点：
            1.内置执行器。Generator 函数的执行必须依靠执行器，而 Aysnc 函数自带执行器，调用方式跟普通函数的调用一样
            2.更好的语义。async 和 await 相较于 * 和 yield 更加语义化
            3.更广的适用性。co 模块约定，yield 命令后面只能是 Thunk 函数或 Promise对象。而 async 函数的 await 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）
            4.返回值是 Promise。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用

        ```

      - **async 用法**

        ```
        Async—声明一个异步函数(async function someName(){...})
        特点：
            1.async函数内部的返回值会成为回调函数的参数，返回是一个Promise对象；
            2.async必须等到内部所有await命令后面的 Promise 对象执行完，才会发生状态改变；即asyns异步执行完，才执行then方法的回调函数；
            3.异步函数内部可以使用await;

        常见的写法：
        // 函数声明
        async function foo(){}

        // 函数表达式
        const foo = aysnc function(){}

        // 箭头函数
        const foo = aysnc ()=>{}

        // 对象的方法
        let obj={ aysnc ()=>{} }
        obj.foo.then(()=>{console.log(11111111)})

        例子1:
            async function f() {
              return 'hello world';
            }
            f().then(v => console.log(v))

        例子2：
            function a() {
              return new Promise((resolve, reject) => {
                setTimeout(() => { resolve(1) }, 1000)})
            }
            function b() {
              return new Promise((resolve, reject) => {
                setTimeout(() => { resolve(2) }, 2000)})
            }
            async function getData(text) {
                let a1 = await a()
                let b1 = await b()
                console.log('getData执行了')
                return text+'-----a：'+ a1 +'------b:'+b1
            }

            getData('async').then(console.log)

        例子3：
            async function f() {
              // return 123;
              // 等同于
              return await 123;
            }

            f().then(v => console.log(v)) //123
        ```

      - **await 的用法**

        ```
        Await—暂停异步的功能执行(var result = await someAsyncCall();)
        特点：
            1.只能在async函数内部使用
            2.await命令后面是一个 Promise 对象，返回该对象的结果。如果不是，就直接返回对应的值。
            3.在async函数中，若有多个await函数，若其中一个内部有函数状态改变为 reject 时，接下来的函数将不再执行；async 函数的状态也将变更为reject。

        例子1：
            async function asyncFn1 () {
                return await Promise.resolve('hello async')
            }
            asyncFn1().then(res => console.log(res))

        例子2：
            async function asyncFn2 () {
                return await 123
            }
            asyncFn2().then(res => console.log(res))

        例子3：
          	async function asyncFn3 () {
                await Promise.reject('error')
                return await Promise.resolve('hello async') // 不会执行
            }
            asyncFn3().then(
                res => {console.log(res)},
                err => {console.log(err)}
            )

        ```



      - **await/async如何捕获错误**

        ```
        基本处理错误有两种方法：
        1.try...catch，await后面的Promise对象回调函数是reject时，JavaScript 会抛出一个可以被捕获的错误
        2.await someFn.then(v => [null, v], err => [err, null])，使用then()的第二个参数捕获错误；

        例子1：
            async function run() {
                try {
                   return await Promise.reject(new Error("Oops!"));
                } catch (error) {
                  console.log(error.message) // "Oops!"
                }
            }
            run();

        例子2：

            async function throwAnError() {
                throw new Error("Oops!");
            }
            async function noError() {
                return 42;
            }

            async function run() {
                // The `.then(v => [null, v], err => [err, null])` pattern
                // 你可以使用数组解构来匹配err和返回值

                // 处理reject的数据
                let [err1, res1] = await throwAnError().then(
                    v => [null, v],
                    err => [err, null]
                );
                console.log(err1, res1) // Error: Oops!,4
                if (err1 != null) {
                    err1.message; // 'Oops'
                }

                // 处理resolve的数据
                let [err2, res2] = await noError().then(v => [null, v], err => [err, null]);
                console.log(err2, res2) // null,4
            }
            run()

         总结：第一种会遇到多个await函数，使用多个try...catch;这种代码并不简洁；
         	  第二种每一个地方都少不了if (err != null) ，代码极度重复，而且容易漏掉；

         解决方案：抽离一个公共方法，await-to-js 优雅写法
         例子3：
          /* 方法抽取 */
          const to = async (promise) => {
            let [err, res] = await promise.then(v => [null, v], err => [err, null]);
            if (err != null) { err.message; }
            return [err, res]
          };

          async function throwAnError() {
            throw new Error("Oops!");
          };

          async function noError() {
            return 42;
          }

          async function run() {
            // The `.then(v => [null, v], err => [err, null])` pattern
            // 你可以使用数组解构来匹配err和返回值
            let [err1, res1] = await to(throwAnError())
            console.log(err1, res1) // null,4
            let [err2, res2] =await to(noError())
            console.log(err2, res2) // null,4
          }
          run()
        ```

      - **async /await/Promise的执行顺序**

        ```
            在工作中 async 的应用情况更加多种，因为其看似同步的处理异步操作，解决了不断回调的问题，增加了代码的可阅读性。 async 虽然看似同步操作，但是它式非阻塞的，接下来将 async、 Promise 和 setTimeout 结合，查看一下它的执行顺序；

        例子1:
            async function asyncFn1 () {
                console.log('asyncFn1 start')
                await asyncFn2()
                console.log('async1 end')
            }

            async function asyncFn2 () {
                console.log('asyncFn2')
            }

            console.log('script start')

            setTimeout(function () {
                console.log('setTimeout')
            }, 0)

            asyncFn1()

            new Promise((resolve) => {
                console.log('Promise')
                resolve()
            }).then(() => {
                console.log('Promise.then')
            })
            console.log('script end')

         最终在控制台中的打印结果为：
            script start
            asyncFn1 start
            asyncFn2
            Promise
            script end
            Promise.then
            async1 end
            setTimeout

        注意： Promise.then优先级应该要高于setTimeout，个人理解为Promise为微任务优先于宏任务
        ```

      - **promise的实现原理**

        [参考：promise的实现原理](https://github.com/wangjiahui11/blog/issues/3)



        其他参考文章：

        [如何优雅地处理 Async / Await 的异常？](https://juejin.cn/post/6844903895748050958#heading-2)

        [event loop一篇文章足矣](https://www.jianshu.com/p/de7aba994523)

        [理解Async和Await](https://juejin.cn/post/6844903773911908359#heading-1)

4. ###### Iterator和for ... of 循环

   - **Iterator**

     ```
     	JavaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了Map和Set。
     	遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作；
     	三个作用：a、提供统一的访问接口。2、数据结构成员能按照某种次序排序。3、iteration 接口主要为了for...of 遍历操作；
     	ES6 规定，默认的 Iterator 接口部署在数据结构的Symbol.iterator属性，或者说，一个数据结构只要具有Symbol.iterator属性，就可以认为是“可遍历的”
     	原生具备 Iterator 接口的数据结构如下。
         Array
         Map
         Set
         String
         TypedArray
         函数的 arguments 对象
         NodeList 对象

     ```

   - **for ... of 循环**

     ES6 借鉴 C++、Java、C# 和 Python 语言，引入了`for...of`循环，作为遍历所有数据结构的统一的方法。

     换句话说、只有具备`Symbol.iterator`属性，才具备Iterator方法，即可以用for.. . of调用它；

     ```
     1.数组
         const arr = ['red', 'green', 'blue'];
         for(let v of arr) {
           console.log(v); // red green blue
         }
     2.Set 和 Map 结构
         var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
         for (var e of engines) {  // Gecko  Trident Webkit
           console.log(e);
         }

         var es6 = new Map();
     	es6.set("edition", 6);
     	es6.set("committee", "TC39");
     	for (var [name, value] of es6) {
           console.log(name + ": " + value);
         } // edition: 6  committee: TC39
     3.类似数组的对象
         // 字符串
         let str = "hello";
         for (let s of str) {
           console.log(s); // h e l l o
         }
     4.对象  for...of结构不能直接使用，会报错，必须部署后才能使用
         let es6 = {
           edition: 6,
           committee: "TC39",
           standard: "ECMA-262"
         };
         for (let [key.value] of Object.entries(es6)) {
           console.log([key.value]);
           // ["edition", 6] ["committee", "TC39"]  	["standard", "ECMA-262"]
         }
     ```



5. ###### Generator函数

   - **基本概念**

     ```
     	Generator 函数是 ES6 提供的一种异步编程解决方案，
     	语法上：是一个状态机，封装了多个内部状态。执行 Generator 函数会返回一个遍历器对象
     	形式上：Generator 一个普通函数，有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式。



     ```

   - **基本用法**

     ```
     	由于 Generator 函数返回的遍历器对象，只有调用next方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。
     	function *gen () {
           yield 1
           yield 2
           return 3
         }

         const g = gen()   // Iterator对象
         g.next() // {value: 1, done: false}
         g.next() // {value: 2, done: false}
         g.next() // {value: 3, done: true}
     ```



   - **next的参数**

     ```
     yield表达式本身没有返回值，或者说总是返回undefined。
         function *gen () {
           var x = yield 'hello world'
           var y = x / 2
           return [x, y]
         }
     第一种情况：无参数// yield 返回值为undefined
         const g = gen()
         g.next()    // {value: 'hello world', done: false}
         g.next()    // {value: [undefined, NaN], done: true}
      	备注：var x = yield 'hello world' 返回值为undefined， y:NAN

     第二种情况：next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。
         const g = gen()
         g.next()    // {value: 'hello world', done: false}
         g.next(10)    // {value: [10, 5], done: true}
     ```

   - **for...of**

     ```
     	for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。
     function* foo() {
       yield 1;
       yield 2;
       yield 3;
       yield 4;
       yield 5;
       return 6;
     }

     for (let v of foo()) {
       console.log(v);
     }
     // 1 2 3 4 5
     ```

   - **作为对象属性的Generator函数**

     ```
     let obj = {
       * gen () {}
     }
     // 也可以完整的写法
     let obj = {
       gen: function *gen () {}
     }
     构造函数
     class F {
       * gen () {}
     }
     ```

   - **this问题**

     ```
     例子1：
         function F () {
           this.a = 1
         }
         const f = new F()  // 1.创建f实例，2、this指向这个实例。3、原型赋予这个实例对象。

     例子2：
         function *Gen () {
           yield this.a = 1
         }
         Gen.prototype.say = function () {
           console.log('keith')
         }
         const g = new Gen()
         g.a      // undefined
         g.say()  // 'keith'

     	原因：调用Generator函数会返回遍历器对象，而不是实例对象，因此无法获取到this指向的实例对象上的私有属性和方法。
     	解决方法：这个遍历器对象可以继承Generator函数的prototype原型对象上的属性和方法(公有属性和方法)。

     ```

   - Generator异步的实例应用

     **前言**

     ```
     ES6 诞生以前，异步编程的方法，大概有下面四种。
     - 回调函数
     - 事件监听
     - 发布/订阅
     - Promise 对象
     ```

   - **回调Callback**

     ```
     fs.readFile('/etc/passwd', 'utf-8', function (err, data) {
       if (err) throw err;
       console.log(data);
     });
     上面代码中，readFile函数的第三个参数，就是回调函数，也就是任务的第二段。等到操作系统返回了/etc/passwd这个文件以后，回调函数才会执行
     ```

   - **Promise**

     ```
     回调过多会导致:"回调函数地狱"（callback hell）。
     fs.readFile(fileA, 'utf-8', function (err, data) {
       fs.readFile(fileB, 'utf-8', function (err, data) {
           fs.readFile(fileC, 'utf-8', function (err, data) {
             fs.readFile(fileD, 'utf-8', function (err, data) {

             });
           });
       });
     });

     Promsie的解决方案：
         var readFile = require('fs-readfile-promise');

         readFile(fileA).then(function (data) {
            console.log(data.toString());
            return readFile(fileB);
         }).then(function () {
           console.log(data.toString());
           return readFile(fileC);
         }).then(function (data) {
           console.log(data.toString());
           return readFile(fileD);
         })

     ```

   - **Generator函数**

     **协程**

     ```
     "协程"（coroutine）:多个线程互相协作，完成异步任务。
     function* asyncJob() {
       // ...其他代码
       var f = yield readFile(fileA);
       // ...其他代码
     }
     	可以理解：asyncJob相当于一个协程，当运行到yield时候，此时停止，将执行权将交给其他协程。即调用next的方法；
     ```

     **协程运用**

     ```
     例子一：协程的 Generator 函数实现
         function* gen(x) {
           var y = yield x + 2;
           return y;
         }

         var g = gen(1);
         g.next() // { value: 3, done: false }
         g.next() // { value: undefined, done: true }

     例子二：Generator 函数的数据交换
         function* gen(x){
           var y = yield x + 2;
           return y;
         }

         var g = gen(1);
         g.next() // { value: 3, done: false }
         g.next(2) // { value: 2, done: true } // 参数2，作为上个阶段异步任务的返回结果；

     例子三：Generator 函数的处理错误
         function* gen(x){
           try {
             var y = yield x + 2;
           } catch (e){
             console.log(e);
           }
           return y;
         }

         var g = gen(1);
         g.next();
         g.throw('出错了'); // 出错了

     ```

   - **Thunk**

     ```
     Thunk 函数是自动执行 Generator 函数的一种方法。

     传值调用
         f(x + 5)
         // 传值调用时，等同于
         f(6)
     传名调用
         f(x + 5)
         // 传名调用时，等同于
         (x + 5) * 2

      Trunk函数的目的：针对传名调用来的；
      	编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。
      	function f(m) {
           return m * 2;
         }
         f(x + 5);

         // 等同于
         var thunk = function () {
           return x + 5;
         };

         function f(thunk) {
           return thunk() * 2;
         }
     ```

   - **co 模块**

     ```
     用于 Generator 函数的自动执行。
         var gen = function* () {
           var f1 = yield readFile('/etc/fstab');
           var f2 = yield readFile('/etc/shells');
           console.log(f1.toString());
           console.log(f2.toString());
         };
         var co = require('co');

         co(gen).then(function (){
           console.log('Generator 函数执行完成');
         });
     co函数返回一个Promise对象，因此可以用then方法添加回调函数。 也就是说不用调用next的方法；
     ```

6. **Class**

   - **简介**

     ```
     生成实例对象的传统方法是通过构造函数
         function Point(x, y) {
           this.x = x;
           this.y = y;
         }
         Point.prototype.toString = function () {
           return '(' + this.x + ', ' + this.y + ')';
         };
         var p = new Point(1, 2);

     es6的class可以理解成一种语法糖，目的让对象原型写法更加清晰；
         class Point {
         // 对相应这es5的point构造函数
           constructor(x, y) {
             this.x = x;
             this.y = y;
           }
     	  //类似于的prototype属性上面方法。
           toString() {
             return '(' + this.x + ', ' + this.y + ')';
           }
         }

     ```

   - **静态方法**

     ```
     通常类中定义的方法，都会被实例继承 如果加static关键字，就表示该方法不会被实例继承，而是直接通过类来调用
     class Foo {
       static classMethod() {
         return 'hello';
       }
     }
     Foo.classMethod() // 'hello'
     var foo = new Foo();
     foo.classMethod()
     // TypeError: foo.classMethod is not a function
     ```

   - **实例属性新写法**

     ```
     义在类的最顶层。
     class foo {
       bar = 'hello';
       baz = 'world';
     }
     等价于
     class foo {
       constructor() {
          bar = 'hello';
       	baz = 'world';
       }
     }
     ```



   - **静态属性**

     ```
     静态属性指的是 Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。
         // 老写法
         class Foo {
           // ...
         }
         Foo.prop = 1;

         // 新写法
         class Foo {
           static prop = 1;
         }
     ```

   - **Class继承**

     - **简介**

       ```
       Class 可以通过extends关键字实现继承，
       class A {
         constructor() {
           this.name = 'A'
         }
         hello() {
           console.log('hello world');
           return 'A'
         }
       }
       class B extends A {
         constructor() {
           super();
           this.name = 'myfather is'
         }
         hello(){
          	return this.name + ' ' + super.hello(); // hello()
         }
       }
       let a = new A() // A
       a.hello() //hello world
       let b = new B() // B
       b.hello() //myfather is A
       ```

     - **super 关键字**

       ```
       	super关键字：既可以当作函数使用，也可以当作对象使用。在这两种情况下，它的用法完全不同。

       	第一种情况，super作为函数调用时，代表父类的构造函数。
           class A {
             constructor() {
               console.log(new.target.name);
             }
           }
           class B extends A {
             constructor() {
               super();
             }
           }
           new A() // A
           new B() // B
           注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。作为函数时，只能在构造函数内部；
           第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；即指向A.prototype；
           class A {
             constructor() {
               this.x = 1;
             }
             print() {
               console.log(this.x);
             }
           }

           class B extends A {
             constructor() {
               super();
               this.x = 2;
             }
             m() {
               super.print();
             }
           }

           let b = new B();
           b.m() // 2
           注意：b.m() 相当于调用A.prototype.print,但这个this指的时当前的B的实例对象；


       ```

     - **类的 prototype 属性和proto属性**

       ```
       	Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。
       	（1）子类的__proto__属性，表示构造函数的继承，总是指向父类。
       	（2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
       	class A {
           }

           class B extends A {
           }
           B.__proto__ === A // true
           B.prototype.__proto__ === A.prototype // true

       ```

       整体关系图：

       ![class-_proto_.png](https://github.com/wangjiahui11/blog/blob/main/%E5%9B%BE%E7%89%87%E5%8F%8A%E6%88%AA%E5%9B%BE/class-_proto_.png?raw=true)

     - **实例的`__proto__`方法**

       ```
       	子类实例的__proto__的__proto__指向父类的__proto__。也就说子类实例的原型的原型指向父类实例的原型
       	class A {
           }

           class B extends A {
           }

           const a = new A();
           const b = new B();
       	a.__proto__=A.prototype // TRUE
       	b.__proto__=B.prototype  // TRUE
           b.__proto__.__proto__ ===B.prototype.__proto__===A.prototype=== a.__proto__  // true

       ```

7. **Module 语法**

   - **简介**

     ```
     ES6 之前 javascript 一直没有属于自己的模块规范，所以社区制定了 CommonJs规范， Node 从 Commonjs 规范中借鉴了思想于是有了 Node 的 module，而 AMD 异步模块 也同样脱胎于 Commonjs 规范，之后有了运行在浏览器上的 require.js
     ```

   - **export 和 import**

     ```
     	01.export命令用于规定模块的对外接口，一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。
     	02.import命令加载这个模块。

     	export 语法：
             // 写法一
             export var m = 1;
             // 写法二
             var m = 1;
             export {m};

             import { m }
             // 写法三
             var n = 1;
             export {n as m};a

         import 语法：
             import {m}
             import {m as n}


         export default 语法： -- 目的:import时候不需要知道加载的的变量或者函数名称
             // 默认输出
             let add = 'add'
             export default add { // 输出 }
             等同于
             export { add as default} { // 输出 }

             import add from 'crc32'; // 输入
             等同于
             import {default as add} from 'crc32'; // 输入

     	export 与 import 的复合写法
     		如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
             简写：
             export { foo, bar } from 'my_module';
             // 可以简单理解为
             import { foo, bar } from 'my_module';
             export { foo, bar };

          整体导入：
          	除了加载某个输入值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。
              // 混合导出 module.js
              let a = 1
              export { a }
              const b = 2
              export { b }
              export let c = 3
              export default [1, 2, 3]

             // 混合导入 main.js
             import defaultExport, { a, b, c as newC} from 'module'; //defaultExport: [1, 2, 3]  a: 1  b: 2  newC: 3
             import defaultExport, * as name from 'module'; //defaultExport: [1, 2, 3]  name: { a: 1, b: 2, c: 3 }
             import * as name from 'module'; // name: { a: 1, b: 2, c: 3, default: [1, 2, 3] }


     ```

   - **moduel加载的实现**

     - [ ] 参考：https://juejin.cn/post/6844903810775678989#heading-12

8.
