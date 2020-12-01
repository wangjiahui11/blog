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

   - 简述

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

     ![pronise三种状态](C:\Users\wangj\Desktop\react-study\pronise三种状态.png)

     ![Promise的状态变化](E:\wangjh\web资料\learn\blog\图片及截图\Promise状态.png)

   - 基本用法

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

     

   - Promise.all(),Promise.race(),Promise.allSettled() ,Promise.any()

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

   - **含义**

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

     

   - await/async如何捕获错误

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

     

   - promise的实现原理

     ```
     111
     ```

   - 

     参考文章：

     [如何优雅地处理 Async / Await 的异常？](https://juejin.cn/post/6844903895748050958#heading-2)

     [event loop一篇文章足矣](https://www.jianshu.com/p/de7aba994523)

     [理解Async和Await](https://juejin.cn/post/6844903773911908359#heading-1)

4. 

