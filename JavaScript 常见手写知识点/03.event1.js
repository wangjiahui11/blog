//  基础版的发布者订阅者模式 --针对单个事件回调
class Event{
  constructor(){
    this.eventList = {}
  }
  // 监听
  $on(key,fn){
    this.eventList[key] = fn
    return this
  }
  // 触发
  $emit(key,...arg){
    if (this.eventList.hasOwnProperty(key)) {
      let  fn = this.eventList[key]
      console.log('on 中的',arg);
      fn(arg)
    }else{
      console.log('执行失败');
    }
    return this
  }
  // 触发一次
  $once(key,fn){
    let cb = (arg)=>{
      fn.apply(this, arg)
      this.$off(key)
    }
    this.$on(key,cb)
    return this
  }
  // 取消监听
  $off(key,cb){
    if (this.eventList.hasOwnProperty(key)) {
      delete this.eventList[key]
      cb&&cb()
    }
  }
}

let eventBus = new Event()

// eventBus.$on('a',function test(arg) {
//   console.log('on调用成功','参数是:',...arg);
// })
// eventBus.$emit('a',1,2,3,4)
// eventBus.$off('a',function off(params) {
//     console.log('删除成功');
// })
// eventBus.$emit('a', 1, 2, 3, 4)
eventBus.$once('b', function test (...arg) {
  console.log('on调用成功', '参数是:',arg);
})
eventBus.$emit('b', 1, 2, 3, 4)
eventBus.$emit('b', 5, 6, 7, 8)
