class Vue {
  constructor(options) {
    let data = this._data = options.data || undefined;
    this._initData.call(this); // 将data中的数据都挂载到this上去，使得this.name 相当于就是得到了this._data.name
    new Observer(data); // 将data中的数据进行劫持
    new Compiler(options.el, this);
  }
  _initData() {
    // 这个函数的功能很简单，就是把用户定义在data中的变量，都挂载到Vue实例(this)上
    Object.keys(this._data).forEach((key) => {
      Object.defineProperty(this, key, {
        get: () => {
          return this._data[key];
        },
        set: (newVal) => {
          this._data[key] = newVal;
        }
      })
    });
  }
}
