## Promise实现原理

本篇文章主要在于探究 Promise 的实现原理，带领大家一步一步实现一个 Promise , 不对其用法做说明，如果读者还对Promise的用法不了解，可以查看[阮一峰老师的ES6 Promise教程](https://es6.ruanyifeng.com/#docs/promise)。

1. ##### Promise 基本结构

  ```
  构造函数Promise必须接受一个函数作为参数，称该函数为handle，handle又包含resolve和reject两个参数，它们是两个函数。
  new Promise((resolve, reject) => {
   setTimeout(() => {
   	resolve('FULFILLED')
    }, 1000)
  })
  ```



2. ##### 常量及公共方法的定义

  ```
  // 判断变量否为function
  const isFunction = variable => typeof variable === 'function'

  // 定义promise的三种状态
  const PENDING = 'PENDING'
  const FULFILLED = 'FULFILLED'
  const REJECTED = 'REJECTED'
  ```



3. ##### promise的类创建

  - **定义class类**

    ```
    class MyPromise {
      constructor (handle) {
        if (!isFunction(handle)) {
          throw new Error('MyPromise must accept a function as a parameter')
        }
      }
    }
    ```

  - **确定Promise三种状态及resolve，reject方法**

    ```
    class MyPromise {
      constructor (handle) {
        if (!isFunction(handle)) {
          throw new Error('MyPromise must accept a function as a parameter')
        }
        // 添加状态
        this._status = PENDING
        // 添加值
        this._value = undefined
        // 执行handle
        try {
          handle(this._resolve.bind(this), this._reject.bind(this))
        } catch (err) {
          this._reject(err)
        }
      }
      // 添加resovle时执行的函数
      _resolve (val) {
        if (this._status !== PENDING) return
        this._status = FULFILLED
        this._value = val
      }
      // 添加reject时执行的函数
      _reject (err) {
        if (this._status !== PENDING) return
        this._status = REJECTED
        this._value = err
      }
    }
    ```

  - **实现同步的then，catch方法并支持链式编程**

    ```
      class MyPromise {
      	...
        // 添加then方法
        then(onFulfilled, onRejected) {
          const { _value, _status } = this
          // 返回一个新的Promise对象
          return new MyPromise((onFulfilledNext, onRejectedNext) => {
            switch (_status) {
              case FULFILLED:
                let res = onFulfilled(_value);
                onFulfilledNext(res)  // 相当于执行下一个Promise的_resolve方法是
                break
              case REJECTED:
                let err = onRejected(_value);
                onRejectedNext(err)
                break
            }
          })
        }
        // 添加catch方法
        catch(onRejected) {
          return this.then(undefined, onRejected)
        }
    }
    ```

    **这样就实现了最基本的Promise。具体代码参考：index1.html**



4. **Promise异步功能的支持**

  由于 `then` 方法支持多次调用，我们可以维护两个数组，将每次 方法注册时的回调函数添加到数组中，等待执行（异步操作）

  - **`constructor` : 增加执行队列**

    ```
    constructor (handle) {
      if (!isFunction(handle)) {
        throw new Error('MyPromise must accept a function as a parameter')
      }
      // 添加状态
      this._status = PENDING
      // 添加状态
      this._value = undefined
      // 添加成功回调函数队列
      this._fulfilledQueues = []
      // 添加失败回调函数队列
      this._rejectedQueues = []
      // 执行handle
      try {
        handle(this._resolve.bind(this), this._reject.bind(this))
      } catch (err) {
        this._reject(err)
      }
    }
    ```

  - **then方法：添加事件队列，及fulfilled，rejected方法的抽离**

    ```
    // 添加then方法
    then(onFulfilled, onRejected) {
      const { _value, _status } = this
      // 返回一个新的Promise对象
      return new MyPromise((onFulfilledNext, onRejectedNext) => {
        // 封装一个成功时执行的函数
        let fulfilled = value => {
          try {
            let res = onFulfilled(value);
            onFulfilledNext(res)
          } catch (err) {
            onRejectedNext(err)
          }
        }
        // 封装一个失败时执行的函数
        let rejected = value => {
          try {
            let err = onRejected(value);
            onFulfilledNext(err)
          } catch (err) {
            onRejectedNext(err)
          }
        }

        switch (_status) {
          // 当状态为pending时，将then方法回调函数加入执行队列等待执行
          case PENDING:
            this._fulfilledQueues.push(fulfilled)
            this._rejectedQueues.push(rejected)
            break
          case FULFILLED:
            fulfilled(_value)
            break
          case REJECTED:
            rejected(_value)
            break
        }
      })
    }
    ```

    **这样就实现了支持异步的的Promise。具体代码参考：index2.html**



5. #####  参数的类型判断

  **1.Promise 对象的 then 方法接受两个参数：promise.then(onFulfilled, onRejected)**

  **这里涉及到 `Promise` 的执行规则，包括“值的传递”和“错误捕获”机制：**

  - **如果 `onFulfilled` 或者 `onRejected` 是函数且返回一个值 `x，有两种情况`**

    a.若x返回值若不为Promise对象，即x值是新的onFulfilled 或者 onRejected 函数的参数.如下

    ```
    let p1 = new Promise((resolve, reject) => {
    	resolve('success')
    })
    let p2 = p1.then(res => {
        return '这里返回一个普通值'
    })
    p2.then(res => {
      console.log(res) //这里返回一个普通值
    }, err => {
      console.log(err)
    })
    ```



    b.若x返回值若为Promise对象，就会等待该 Promise 对象(即 x )的状态发生变化，才会被调用，并且新的 Promise 状态和 x 的状态相同.如下

    ```
    let p1 = new Promise((resolve, reject) => {
    	resolve()
    })
    let p2 = p1.then(res => {
      // 返回一个Promise对象
      return new Promise((resolve, reject) => {
     	resolve('这里返回一个Promise')
      })
    })
    p2.then(res => {
      console.log(res) //这里返回一个Promise
    })
    ```



  - **如果 onFulfilled 或者onRejected 抛出一个异常 e ，则 p2 必须变为失败（Rejected），并返回失败的值 e.**

    ```
      p1 = new Promise((resolve, reject) => {
        resolve('成功1')
      })
      let p2 = p1.then(res => {
        throw new Error('这里抛出一个异常e')
      })
      p2.then(
        res => { console.log(res) },
        err => {
          console.log(err)
      })  //这里抛出一个异常e
    ```



  - **如果 onFulfilled 不是函数且 p1 状态为成功（Fulfilled）， p2 必须变为成功（Fulfilled并返回p1成功的值.**

    ```
      p1 = new Promise((resolve, reject) => {
        resolve('success')
      })
      let p2 = p1.then('这里的onFulfilled是一个文本')
      p2.then(
        res => { console.log(res) },
        err => { console.log(err) }
      )  //success
    ```



  - **如果 onRejected 不是函数且 p1 状态为失败（Rejected），p2必须变为失败（Rejected） 并返回 p1 失败的值.**

    ```
      p1 = new Promise((resolve, reject) => {
        reject('fail')
      })
      let p2 = p1.then(res => {
        return 'sucess'
      }, '这里的onRejected是一个文本')
      p2.then(
        res => { console.log(res) },
        err => { console.log(err) }
      )  //fail
    ```

  **这时候对then中的fulfilled，rejected的封装的函数进行修改**

  ```
  let fulfilled = value => {
    try {
      if (!isFunction(onFulfilled)) {
        onFulfilledNext(value)
      } else {
        let res = onFulfilled(value);
        if (res instanceof MyPromise) {
          // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
          res.then(onFulfilledNext, onRejectedNext)
        } else {
          //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
          onFulfilledNext(res)
        }
      }
    } catch (err) {
      // 如果函数执行出错，新的Promise对象的状态为失败
      onRejectedNext(err)
    }
  }
  // 封装一个失败时执行的函数
  let rejected = error => {
    try {
      if (!isFunction(onRejected)) {
        onRejectedNext(error)
      } else {
        let res = onRejected(error);
        if (res instanceof MyPromise) {
          // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
          res.then(onFulfilledNext, onRejectedNext)
        } else {
          //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
          onFulfilledNext(res)
        }
      }
    } catch (err) {
      // 如果函数执行出错，新的Promise对象的状态为失败
      onRejectedNext(err)
    }
  }
  ```

  2.**特殊的情况**

  ​	就是当 `resolve` 方法传入的参数为一个 `Promise` 对象时，则该 `Promise` 对象状态决定当前 `Promise` 对象的状态。如下

  ```
  const p1 = new Promise(function (resolve, reject) {
    // ...
  });

  const p2 = new Promise(function (resolve, reject) {
    // ...
    resolve(p1);
  })
  ```

  上面代码中，`p1` 和 `p2` 都是 `Promise` 的实例，但是 `p2` 的`resolve`方法将 `p1` 作为参数，即一个异步操作的结果是返回另一个异步操作。

  注意，这时 `p1` 的状态就会传递给 `p2`，也就是说，`p1` 的状态决定了 `p2` 的状态；

  **我们来修改`_resolve`来支持这样的特性**

  ```
  _resolve(val) {
    const run = () => {
      if (this._status !== PENDING) return
      // 依次执行成功队列中的函数，并清空队列
      const runFulfilled = (value) => {
        let cb;
        while (cb = this._fulfilledQueues.shift()) {
          cb(value)
        }
      }
      // 依次执行失败队列中的函数，并清空队列
      const runRejected = (error) => {
        let cb;
        while (cb = this._rejectedQueues.shift()) {
          cb(error)
        }
      }
      /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
        当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
      */
      if (val instanceof MyPromise) {
        val.then(value => {
          this._value = value
          this._status = FULFILLED
          runFulfilled(value)
        }, err => {
          this._value = err
          this._status = REJECTED
          runRejected(err)
        })
      } else {
        this._value = val
        this._status = FULFILLED
        runFulfilled(val)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run, 0)
  }
  ```

  **Promise就基本实现了，参考：index3.html**



6. **Promise的其它的方法**

  - **`catch` 方法**

    相当于调用 `then` 方法, 但只传入 `Rejected` 状态的回调函数

    ```
    // 添加catch方法
    catch (onRejected) {
      return this.then(undefined, onRejected)
    }
    ```



  - **静态 `resolve` 方法**

    ```
    // 添加静态resolve方法
    static resolve (value) {
      // 如果参数是MyPromise实例，直接返回这个实例
      if (value instanceof MyPromise) return value
      return new MyPromise(resolve => resolve(value))
    }

    ```



  - **静态 `reject` 方法**

    ```
    // 添加静态reject方法
    static reject (value) {
      return new MyPromise((resolve ,reject) => reject(value))
    }

    ```



  - **静态 `all` 方法**

    ```
    // 添加静态all方法
    static all (list) {
      return new MyPromise((resolve, reject) => {
        /**
         * 返回值的集合
         */
        let values = []
        let count = 0
        for (let [i, p] of list.entries()) {
          // 数组参数如果不是MyPromise实例，先调用MyPromise.resolve
          this.resolve(p).then(res => {
            values[i] = res
            count++
            // 所有状态都变成fulfilled时返回的MyPromise状态就变成fulfilled
            if (count === list.length) resolve(values)
          }, err => {
            // 有一个被rejected时返回的MyPromise状态就变成rejected
            reject(err)
          })
        }
      })
    }

    ```



  - **静态 `race` 方法**

    ```
    // 添加静态race方法
    static race (list) {
      return new MyPromise((resolve, reject) => {
        for (let p of list) {
          // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
          this.resolve(p).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        }
      })
    }

    ```



  - **`finally` 方法**

    `finally` 方法用于指定不管 `Promise` 对象最后状态如何，都会执行的操作

    ```
    // 添加静态race方法
    static race (list) {
      return new MyPromise((resolve, reject) => {
        for (let p of list) {
          // 只要有一个实例率先改变状态，新的MyPromise的状态就跟着改变
          this.resolve(p).then(res => {
            resolve(res)
          }, err => {
            reject(err)
          })
        }
      })
    }
    ```



    **这样一个完整的 `Promsie` 就实现了， 具体参考：index.html**
