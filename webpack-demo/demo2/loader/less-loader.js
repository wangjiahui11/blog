//loader/less-loader

/**
 * callback({
    //当无法转换原内容时，给 Webpack 返回一个 Error
    error: Error | Null,
    //转换后的内容
    content: String | Buffer,
    //转换后的内容得出原内容的Source Map（可选）
    sourceMap?: SourceMap,
    //原内容生成 AST语法树（可选）
    abstractSyntaxTree?: AST
})
 *
 *
 */

const less = require("less");
function loader(source) {
  console.log('执行-less-loader--3');
  const callback = this.async();
  less.render(source, function (err, res) {
    let { css } = res;
    callback(null, css);
  });
}
module.exports = loader;
