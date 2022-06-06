
let Watcher = null; // 用来表明有没有监视器实例
// Dep 即订阅者
class Dep { // 把与一个变量相关的监听器都存在subs这个变量中
  constructor() {
    this.subs = [];
  }
  notify() {
    // 执行所有与变量相关的回调函数
    this.subs.forEach(sub => sub.update());
  }
  addSub(sub) {
    // 添加与变量相关的订阅回调
    this.subs.push(sub);
  }
}
// 观察者
class Watch {
  constructor(vue, exp, cb) {
    this.vue = vue;
    this.exp = exp;
    this.cb = cb;
    this.hasAddedAsSub = false; // 有没有被添加到Dep中的Subscriber中去，有的话就不需要重复添加
    this.value = this.get(); // 得到当前vue实例上对应表达式exp的最新的值
  }
  get() {
    Watcher = this; // 将当前实例watch放入到Watcher中
    var value = this.vue[this.exp];
    Watcher = null; // 将Watcher置空，让给下一个值
    return value;
  }
  update() {
    let value = this.get();
    let oldVal = this.value;
    if (value !== oldVal) {
      this.value = value;
      this.cb.call(this.vue, value); // 将于此变量相关的回调函数全部执行掉
    }
  }
}
