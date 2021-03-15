// 基础版的promise仅支持同步操作;

// 状态status：pending（进行中）、fulfilled（已成功）和rejected（已失败）
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class myPromise {
  constructor(handle) {
    this._value = null
    this._status = PENDING
    try {
      handle(this._resolve.bind(this), this._reject.bind(this))
    } catch (err) {
      this._reject(err)
    }
  }
  _resolve (value) {
    if (this._status !== PENDING) return
    const run = () => {
      this._status = FULFILLED
      this._value = value
    }
    run()
  }
  _reject (value) {
    if (this._status !== PENDING) return
    const run = () => {
      this._status = REJECTED
      this._value = value
    }
    run()
  }
  then (onFULFILLED, onREJECTED) {
    return new myPromise((onNextFULFILLED, onNextREJECTED) => {
      switch (this._status) {
        case FULFILLED:
          let res = onFULFILLED(this._value)
          onNextFULFILLED(res)
          break;
        case REJECTED:
          let err = onREJECTED(this._value)
          onNextREJECTED(err)
          break;
        default:
          break;
      }
    })

  }
  catch (onREJECTED) {
    return this.then(undefined, onREJECTED)
  }
  static resolve (val) {
    return new myPromise((resolve, reject) => { resolve(val) })
  }
  static reject (err) {
    return new myPromise((resolve, reject) => { reject(err) })
  }
}

let p = new myPromise((resolve, reject) => {
  resolve('要返回的数据可以任何数据例如接口返回数据');
});
p.then((res) => {
  console.log(res, 'then方法的结果')
  throw new Error('error')
}).catch(err => {
  console.log('错误信息', err)
})

let p2 = myPromise.resolve('promise.resolve方法')
p2.then(res => { console.log(res) })

let p3 = myPromise.reject('promise.reject方法')
p3.catch(e => { console.log(e); return 1111 }).catch(e => { console.log(e) })
