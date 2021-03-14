//  基础版的发布者订阅者模式 --针对多个事件回调
class Event{
  constructor(){
      this.eventList={}
  }
  $on(key,fn){
    // 不含有生成数组,并插入函数
    if(this.eventList.hasOwnProperty(key)){
      this.eventList[key].push(fn)
    }else{
      this.eventList[key]=[fn]
    }
  }
  $emit(key,...arg){
    if (this.eventList.hasOwnProperty(key)){
      let fns =this.eventList[key]
      fns.forEach(fn => {
        fn(arg)
      });
    }else{
      console.log('不含有此方法')
    }
  }
  $once(key,fn){
    // if (this.eventList.hasOwnProperty(key)) return
    let cb = (arg)=>{
      fn(arg)
      this.$off(key, cb)  // 移除对应的回调函数。this的指向指向创建的对象eventBus
    }
    this.$on(key,cb)
  }
  /**
   * 参数：
   * key：移除的事件名
   * fn：监听器
   * cb：回调函数

   * 用法：
   * 移除自定义事件监听器。
   * 如果没有提供参数，则移除所有的事件监听器；
   * 如果只提供了事件，则移除该事件所有的监听器；
   * 如果同时提供了事件与回调，则只移除这个回调的监听器。
   */

  $off(key,fn,cb){
    if(!this.eventList.hasOwnProperty(key)) return
    if(fn && typeof fn === 'function'){
      let index = this.eventList[key].indexOf(fn)
      console.log(index,'$off');
      if(index === -1) return
      this.eventList[key].splice(index,1)
      console.log(this.eventList[key],'方法');
    }else{
      delete this.eventList[key]
    }
    cb && cb()
  }
}


let test1 = function(arg) {
  console.log('调用成功test1', '参数是:', arg);
}
let test2 = function (arg) {
  console.log('调用成功test2', '参数是:', arg);
}
let test3 = function (arg) {
  console.log('调用成功test3', '参数是:', arg);
}

let eventBus = new Event()

// ----------------验证 $off 移除的指定事件的函数-------------
eventBus.$on('a', test1)
eventBus.$on('a', test2)
eventBus.$emit('a',1,2,3,4)
eventBus.$off('a',test1)
eventBus.$emit('a', 1, 2, 3, 4)


// ----------------验证 $once函数-------------

// eventBus.$once('b', test3)
// eventBus.$emit('b', 1, 2, 3, 4)
// eventBus.$emit('b', 5, 6, 7, 8)
