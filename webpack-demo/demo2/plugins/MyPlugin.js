//plugins/MyPlugin.js
class MyPlugin {
  constructor(options) {
    console.log("Plugin被创建了", options);
    this.options = options;
  }
  apply(compiler) {
    //注册完成的钩子
    compiler.hooks.done.tap("MyPlugin", (compilation) => {
      console.log("compilation done");
    });
    compiler.hooks.run.tapAsync("MyPlugin", (compilation, callback) => {
      setTimeout(() => {
        console.log("compilation run");
        callback()
      }, 1000)
    });
    compiler.hooks.emit.tapPromise("MyPlugin", (compilation) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("compilation emit");
          resolve();
        }, 1000)
      });
    });
  }
}

module.exports = MyPlugin;
