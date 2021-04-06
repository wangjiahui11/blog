## js执行机制

- #### 前言

  说起js执行机制，大家都知道很面试中常常被问到的高频面试，什么是js执行机制呢；

  通常回答是：js单线程，event loop（事件循环） 宏任务，微任务。

  那什么是线程，什么是线程，进程和线程的区别；微任务和宏任务的区别？包括node的运行机制又是什么呢？

  大致分为以下这样的步骤来帮助我们由广入深更加清晰的了解JS运行机制

  - 进程和线程

  - 浏览器的进程线程，浏览器渲染进程（重点）

  - Event Loop、宏任务(macrotask)微任务(microtask)

  - 例子分析

  - NodeJS的运行机制

    

- #### 进程与线程

  1. **什么是进程**

     **进程**：`CPU`资源分配的最小单位

     **简单理解**：电脑运行中的程序，即单例独立运行且拥有自己资源的运行中的程序；

     ```
     	现代操作系统都是可以同时运行多个任务的，比如：用浏览器上网的同时还可以听音乐。对于操作系统来说，一个任务就是一个进程，比如打开一个浏览器就是启动了一个浏览器进程，打开一个 Word 就启动了一个 Word 进程。
     ```

  2. **什么是线程**

     **线程**：`CPU`调度的最小单位；

     **简单理解**：线程`就是程序中的一个执行流，一个`进程`可以有多个`线程；

     ```
     有些进程同时不止做一件事，比如 Word，它同时可以进行打字、拼写检查、打印等事情。在一个进程内部，要同时做多件事，就需要同时运行多个“子任务”，我们把进程内的这些“子任务”称为线程。
     ```

     **单线程**：一个进程中只有一个执行流，即程序执行时，是按照一定循序执行的；

     **多线程**：一个进程中有多个执行流，即在一个程序中可以同时运行多个不同的`线程`来执行不同的任务

  3. **进程和线程的区别；**

     进程是操作系统分配资源的最小单位，线程是程序执行的最小单位

     一个进程由一个或多个线程组成，线程可以理解为是一个进程中代码的不同执行路线

     进程之间相互独立，但同一进程下的各个线程间共享程序的内存空间(包括代码段、数据集、堆等)及一些进程级的资源(如打开文件和信号)

  4. **多进程和多线程**

     多进程：多进程指的是在同一个时间里，同一个计算机系统中运行两个或两个以上的进程；如同时打开浏览器查资料和听歌；

     多线程：程序(进程)中包含多个执行流；即一个程序中同时运行多个不同的线程来执行不同的任务；

- #### js为什么时单线程

  ​	**JS的单线程，与它的用途有关。**

  ​	JS脚本语言，主要目的是用户交互和操作Dom元素；多线程会带来很复杂的问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

  ```
  还有人说js还有Worker线程，对的，为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程是完全受主线程控制的，而且不得操作DOM 
  所以，这个标准并没有改变JavaScript是单线程的本质
  ```

  

- #### 浏览器进程

  > 浏览器内核是多线程,  浏览器里面不仅只有解释JavaScript的，还包括很多其它的引擎。

  ##### **浏览器包含哪些进程**

  为了简化理解，这里仅列举主要进程。

  - **Browser 进程**：浏览器的主进程，只有一个。

    - 负责浏览器界面的显示与交互；
    - 各个页面的管理，创建和销毁其他进程；
    - 网络的资源管理、下载等。

  - **渲染进程**：也称为浏览器**渲染进程**或**浏览器内核**，内部是多线程的。主要负责页面渲染，脚本执行，事件处理等。

  - **第三方插件进程**：每种类型的插件对应一个进程，仅当使用该插件时才创建。

  - **GPU 进程**：最多一个，用于 3D 绘制等。

    

  #### **浏览器内核（渲染进程）**

  前面说了这么多的进程，对普通前端操作来说，最重要的还是渲染进程。

  **浏览器的渲染进程是多线程的**，页面的渲染，JS的执行，事件的循环等，都在这个进程内执行。

  渲染进程通常由以下常驻线程组成：

  1. ##### **GUI 渲染线程**

     ​		负责渲染浏览器界面，解析 HTML、CSS，构建 DOM tree和 render tree，布局和绘制等。当界面需要重绘（repaint）或由于某种操作引发回流（reflow）时，该线程就会执行。

  2. ##### **JS 引擎线程**

     ​	也称为 JS 内核，负责解析 JavaScript 脚本，运行代码。

     - **JavaScript 是单线程的**。

       ​		JavaScript 为什么是单线程的？这与它的用途有关。JavaScript 作为浏览器脚本语言，主要用途是与用户互动以及操作 DOM。这也决定了它只能是单线程的，否则会带来很复杂的同步问题。想想一下，如果 JavaScript 同时有连个线程，一个线程在某个 DOM 节点上添加内容，另一个线程删除了这个 DOM 节点，这时浏览器应该以哪个线程为准呢？所以，为了避免复杂性，JavaScript 从一开始就是单线程。

     - **GUI 渲染线程 与 JS 引擎线程是互斥的**。

       ​		由于 JavaScript 可以操作 DOM，如果在修改元素属性的同时渲染界面（即 JavaScript 引擎线程和 GUI 渲染线程同时运行），那么渲染线程前后获得的元素数据就可能会不一致。因此，为了防止渲染出现不可预期的结果，浏览器设置 GUI 渲染线程与 JS 引擎为互斥的关系。当 JS 引擎执行时，GUI 线程被挂起，GUI 更新被保存在一个队列中，等到 JS 引擎线程空闲时立即被执行。

     - **JS 阻塞页面加载**。

       ​		由于 GUI 渲染线程与 JS 引擎线程是互斥的，当浏览器在执行 JavaScript 的时候，GUI 渲染线程会被保存在一个队列中，直到 JS 程序执行完成，才会接着执行。因此如果 JS 执行时间过长，就会造成页面的渲染不连贯，导致页面渲染加载阻塞。

  3. ##### 事件触发线程

     ​	当一个事件被触发时，该线程会把事件添加到待处理队列的队尾，等待 JS 引擎处理。这些事件可以是当前执行的代码块，如定时任务；也可以是来自浏览器内核的其他线程，如：鼠标点击、Ajax异步请求等。但由于 JS 是单线程的，这些事件都需要排队等待 JS 引擎处理。

  4. ##### 定时触发器线程

     ​	`setTimeout` 和 `setInterval` 所在的线程。浏览器定时计数器并不是由 JS 引擎计数的，因为 JS 是单线程的，如果处于阻塞线程状态就会影响计时的准确，所以通过单独的线程来计时并触发定时更为合理。

  5. ##### 异步 http 请求线程

     ​	XMLHttpRequest 在建立连接后，通过浏览器新开一个线程请求，一旦检测到状态变更并且设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中，等待 JS 引擎空闲时处理。

     

  ##### Browser 进程和 Renderer 进程的通信过程

  打开浏览器的一个 tab 页时，我们看下其中的大致过程：

  - Browser 进程收到用户请求，通过网络下载获取页面内容，然后将该任务通过RendererHost接口传递给 Renderer 进程；
  - Renderer 进程的 Renderer 接口收到消息，简单解释后，交给 GUI 渲染线程开始渲染；
    - GUI 渲染线程接收请求，加载网页并渲染网页，这个过程中可能需要 Browser 进程获取资源和 GPU 进程来帮助渲染，也可能会有 JS 引擎线程操作 DOM（可能造成回流并重绘）；
    - 最后 Renderer 进程将结果传递给 Browser 进程；
  - Browser 进程接收到结果，并将结果绘制出来。

  ![browser进程于Render进程通讯](E:\wangjh\web资料\learn\blog\图片及截图\browser进程于Render进程通讯.png)

  到这里应该对浏览器的运作有一定理解了，我们再来看下浏览器是怎么渲染页面的。

  

  ##### 浏览器的渲染流程

  ![渲染流程图](E:\wangjh\web资料\learn\blog\图片及截图\渲染流程图.png)

  1. 解析 HTML 文件，生成 DOM tree（可能会被CSS和JS的加载执行阻塞）；
  2. 解析 CSS 文件以及样式元素中的样式数据，生成 CSS Rules。
  3. 构建 render tree：根据 DOM tree 和 CSS Rules 来构建 render tree，它可以让浏览器按照正确的顺序绘制内容。
  4. 布局（layout / reflow）：计算各元素尺寸、位置。
  5. 绘制（paint）：绘制页面像素信息。显示在屏幕上。

  

  **渲染阻塞**

  ​		当浏览器遇到一个 script 标记时，DOM 构建将暂停，直至脚本完成执行，然后继续构建DOM。每次去执行JavaScript脚本都会严重地阻塞DOM树的构建，如果JavaScript脚本还操作了CSSOM，而正好这个CSSOM还没有下载和构建，浏览器甚至会延迟脚本执行和构建DOM，直至完成其CSSOM的下载和构建。

  所以，script 标签的位置很重要。实际使用时，可以遵循下面两个原则：

  **CSS 优先：引入顺序上，CSS 资源先于 JavaScript 资源。**
  **JS置后：我们通常把JS代码放到页面底部，且JavaScript 应尽量少影响 DOM 的构建。**

  当解析html的时候，会把新来的元素插入dom树里面，同时去查找css，然后把对应的样式规则应用到元素上，查找样式表是按照从**右到左**的顺序去匹配的。

  例如： div p {font-size: 16px}，会先寻找所有p标签并判断它的父标签是否为div之后才会决定要不要采用这个样式进行渲染）。
  所以，我们平时写CSS时，尽量用id和class，千万不要过渡层叠。

  

  **Reflow(回流)和Repaint（重绘）** 

  1. `Reflow` : 元素的盒模型或者布局发生了变化，浏览器需要重新计算其大小和位置。

  2. `Repaint` : 当一个元素的外观发生改变，但没有改变布局,重新把元素外观绘制出来的过程，叫做重绘。

     我们可以发现 `Reflow` 对应的是渲染过程中的第四步，而 `Repaint` 对应的是渲染过程的第五步。直白一点说就是当 `DOM` 被修改后需要重新计算渲染树 `render tree` 的一部分或者全部的时候，我们就需要 `Reflow`，而如果元素的修改不影响渲染树，那么只要 `Repaint` 就可以了。回流必将引起重绘，重绘不一定会引起回流。

     display:none 会触发 `Reflow` ，visibility: hidden属性并不算是不可见属性，只引发`Repaint` 

     显而易见，`Reflow` 的成本要比 `Repaint` 高得多，`DOM Tree` 里的每个结点都会有 `reflow`方法，一个结点的 `reflow` 很有可能导致子结点，甚至父点以及同级结点的 `reflow`。

  

- #### js引擎执行机制

  ​		由于js的**运行环境**是单线程的，一些异步操作还是需要借助于浏览器这个宿主来实现。这里简单的一个图来描述`js`运行的时候的流程。主要运用了浏览器的**js引擎线程和事件触发线程**，有时候开启网络服务和定时器也会用到其他的线程。

  ![js引擎部分](E:\wangjh\web资料\learn\blog\图片及截图\js引擎部分.png)

  首先要知道，JS分为同步任务和异步任务

  同步任务：都在主线程上执行，会形成一个`执行栈`；

  异步任务：主线程之外，事件触发线程管理着一个`任务队列`，只要异步任务有了运行结果，就在`任务队列`之中放一个事件回调

  一旦`执行栈`中的所有同步任务执行完毕，系统就会读取`任务队列`，将可运行的异步任务，添加到执行栈中执行，直至异步任务读取完成；

  我们来看一段简单的代码

  ```
  let setTimeoutCallBack = function() {
    console.log('我是定时器回调');
  };
  let httpCallback = function() {
    console.log('我是http请求回调');
  }
  
  // 同步任务
  console.log('我是同步任务1');
  
  // 异步定时任务
  setTimeout(setTimeoutCallBack,1000);
  
  // 异步http请求任务
  ajax.get('/info',httpCallback);
  
  // 同步任务
  console.log('我是同步任务2');
  
  ```

  上述代码执行过程

  JS是按照顺序从上往下依次执行的，这段代码时的执行环境就是主线程（执行栈）

  ​	step1 执行`console.log('我是同步任务1')`

  ​	step2 执行到`setTimeout`时，会移交给`定时器线程`，通知`定时器线程` 1s 后将回调交给`事件触发线程`处理，`事件触发线程`收到后会把它加入事件队列中等待执行

  ​	step3 执行http请求，会移交给`异步http请求线程`发送网络请求，请求成功后将 `httpCallback` 这个回调交由事件触发线程处理，`事件触发线程`收到后会把它加入事件队列中等待执行

  ​	step4  执行`console.log('我是同步任务2')`

  ​	step5  主线程执行栈中执行完毕，`JS引擎线程`已经空闲，开始向`事件触发线程`发起询问，询问`事件触发线程`的事件队列中是否有需要执行的回调函数，如果有将事件队列中的回调事件加入执行栈中，开始执行回调，如果事件队列中没有回调，`JS引擎线程`会一直发起询问，直到有为止

  

  到了这里我们发现，浏览器上的所有线程的工作都很单一且独立，非常符合单一原则

  **定时触发线程**：只管理定时器且只关注定时不关心结果，定时结束就把回调扔给事件触发线程

  **异步http请求线程**：只管理http请求同样不关心结果，请求结束把回调扔给事件触发线程

  **事件触发线程**：只关心异步回调入事件队列

  **JS引擎线程**：只会执行执行栈（主线程）中的事件，执行栈中的代码执行完毕，就会读取事件队列中的事件并添加到执行栈中继续执行，这样反反复复就是我们所谓的**事件循环(Event Loop)**

  
  
- #### 宏任务(macrotask) & 微任务(microtask)

  浏览器的事件循环依靠已事件队列，但是一个进程中不止一个事件队列，大致可以分为`macro task`和`micro task`，常见的宏任务和微任务分别包括：

  - **macro task（宏任务）：**
    - setTimeout
    - setInterval
    - I/O
    - script代码块
  - **micro task**（微任务）
    - nextTick
    - callback
    - Promise
    - process.nextTick
    - MutationObserver
  **主要部分：** 事件队列在同步队列执行完后，首先会执行nextTick，等nextTick执行完成后，然后会先执行**micro task**， 等**micro task**队列空了之后，才会去执行**macro  task**，如果中间添加了**micro task**加入了**micro task**队列，会继续去执行**micro task**队列，然后再回到**macro  task**队列。js引擎存在**monitoring process进程**， 会不停的监听`task queue`（事件队列）

  ![maco和mico task](E:\wangjh\web资料\learn\blog\图片及截图\maco和mico task.png)

- #### 图解完整的Event Loop

  ![Event Loop](E:\wangjh\web资料\learn\blog\图片及截图\Event Loop.png)

  > **一段代码块就是一个宏任务**。所有一般执行代码块的时候，也就是程序执行进入主线程了，主线程会根据不同的代码再分微任务和宏任务等待主线程执行完成后，不停地循环执行。
  >
  > 主线程（宏任务） =>  微任务  => 宏任务 => 主线程

  

- #### 案例分析

  ```
  <script>
      async function async1() {
        console.log('async1 start');
        await async2();
        console.log('async1 end');
      }
      async function async2() {
        console.log('async2');
      }
      console.log('script start');
      setTimeout(function() {
          console.log('setTimeout');
      }, 0);
  	async1();
      new Promise(function(resolve) {
          console.log('promise1');
          resolve();
        }).then(function() {
          console.log('promise2');
      });
  	console.log('script end');
  </script>   
  ```

  1. 整个代码块作为一个宏任务，进入主线程

  2. 看到函数申明但没有执行，遇到函数console.log执行，输出`script start`

  3. 遇到`setTimeout()` ，把它的回调函数放入宏任务（setTimeout1）。

     |   宏任务    | 微任务 |
     | :---------: | :----: |
     | setTimeout1 |        |

  4. 遇到执行`async1()`, 进入`async`的执行上下文之后，遇到`console.log`输出`async1 start`

  5. 然后遇到`await async2()`，由于`()`的优先级高，所有先执行`async2()`，进入`async2()`的执行上下文。

  6. 看到`console.log`输出`async2`，之后没有返回值，结束函数，返回`undefined`，返回`async1`的执行上下文的`await undefined`，由于`async`函数使用`await`后得语句会被放入一个回调函数中，所以把下面的放入微任务中。

     |   宏任务    |          微任务           |
     | :---------: | :-----------------------: |
     | setTimeout1 | async1=> awati 后面的语句 |

  7. 结束`async1`,返回全局上下文，遇到`Promise`构造函数，里面的函数**立马执行**， 输出`promise1`, 之后的回调函数进入微任务

     |   宏任务    |          微任务           |
     | :---------: | :-----------------------: |
     | setTimeout1 | async1=> awati 后面的语句 |
     |             | new Promise() => 后的then |

  8. 执行完Promise()，遇到console.log,输出`script end`,这里一个宏任务代码块执行完毕。

  9. 在主线程执行的过程中，**事件触发线程**会一直监听异步事件，当异步事件处理完成后，把它的回调函数放入事件队列，等待执行。

  10. 主线程现在空闲下来后，执行事件队列中的微任务，然后继续向下执行，遇到`new Promise()`后面的回调函数，执行代码，输出`promise2`(这里2个微任务的优先级，**promise高于async**)。

  11. 看到`async1`中`await`后面的回调函数，执行代码，输出`async1 end`

      |   宏任务    | 微任务 |
      | :---------: | :----: |
      | setTimeout1 |   空   |

  12. 此时微任务中的队列为空，开始执行队列中的宏任务，进入一个新的代码块。遇到`console.log`，输出`setTimeout`

  13. 执行完成，最后结果为

  ```
  script start => async1 start => async2 => promise1 => script end => async1 end => promise2  => setTimeout
  ```

  

- #### 总结

  1. JavaScript运行环境是单线程，不管什么代码，什么框架的异步代码，都是利用宿主对象（Node，浏览器）的其他线程来通过事件循环机制实现
  2. 我们一般说的运行和执行是不一样的，JavaScript的运行环境是JavaScript解析引擎，执行环境比如node，浏览器。
  3. JavaScript解析引擎会监听事件循环机制，把异步任务放入事件队列。

  

参考

1. [Tasks, microtasks, queues and schedules - 重点推荐阅读](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly)

2. [聊聊 JavaScript 与浏览器的那些事 - 引擎与线程](https://zhuanlan.zhihu.com/p/32751855)

3. [前端文摘：深入解析浏览器的幕后工作原理](https://www.cnblogs.com/lhb25/p/how-browsers-work.html)

4. [浏览器进程？线程？傻傻分不清楚！](https://www.imweb.io/topic/58e3bfa845e5c13468f567d5)

5. [从输入cnblogs.com到博客园首页完全展示发生了什么](https://www.cnblogs.com/iovec/p/7904416.html)

6. [前端必读：浏览器内部工作原理](https://www.cnblogs.com/wyaocn/p/5761163.html)

7. [什么是 Event Loop？](http://www.ruanyifeng.com/blog/2013/10/event_loop.html)

8. [JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

9. [单线程与多线程的区别](https://blog.csdn.net/u012134199/article/details/46290465)

10. [浏览器的运行机制—2.浏览器都包含哪些进程？](https://www.jianshu.com/p/1e455a9226ce)

11. [从浏览器多进程到JS单线程，JS运行机制最全面的一次梳理](https://juejin.im/post/6844903553795014663#heading-25)

12. [「前端进阶」从多线程到Event Loop全面梳理](https://juejin.im/post/6844903919789801486#heading-4)

13. [Js基础知识（四） - js运行原理与机制](https://segmentfault.com/a/1190000013119813)

14. [这一次，彻底弄懂 JavaScript 执行机制](https://juejin.im/post/6844903512845860872)

15. [前端性能优化：细说浏览器渲染的重排与重绘](https://juejin.im/post/6844903641816514573)

16. [10分钟看懂浏览器的渲染过程及优化](https://juejin.im/post/6844903877314101255)

17. [干货十分钟读懂浏览器渲染流程](https://juejin.cn/post/6844903565610188807#heading-5)

18. [浏览器渲染过程](https://www.clloz.com/programming/front-end/js/2019/04/25/how-browser-work-2/#Reflow_Repaint)

19. [一次搞懂js运行机制](https://juejin.cn/post/6844904050543034376#heading-21)

    

