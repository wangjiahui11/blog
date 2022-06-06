class Observer {
  constructor(data) {
    this.defineReactive(data); // 将用户自定义的data中的元素都进行劫持观察，从而来实现双向绑定
  }
  defineReactive(data) {
    var dep = new Dep();
    Object.keys(data).forEach(key => {
      var val = data[key];
      Object.defineProperty(data, key, {
        get() {
          if (Watcher) { // 如果当前所获取的这个变量上面有监视器，那么就需要把监视器放到订阅器中等待触发
            if (!Watcher.hasAddedAsSub) { // 对于已经添加到订阅列表中的监视器则无需再重复添加了
              dep.addSub(Watcher); // 将监视器添加到订阅列表中
              Watcher.hasAddedAsSub = true;
            }
          }
          return val;
        },
        set(newVal) {
          if (newVal === val) return;
          val = newVal; // 将vue实例上对应的值(name的值)修改为新的值
          dep.notify();
        }
      })
    });
  }
}
