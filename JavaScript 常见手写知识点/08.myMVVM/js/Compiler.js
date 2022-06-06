class Compiler {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el);
    if (this.$el) {
      // 在$fragment中操作，比this.$el中操作节省很多性能，所以要赋值给fragment
      let $fragment = this.node2Fragment(this.$el);
      this.compileText($fragment.childNodes[0]); // 将模板中的{{}}替换成对应的变量
      this.$el.appendChild($fragment)
    }
  }
  node2Fragment(el) {
    // 将node节点都放到fragment中去
    var fragment = document.createDocumentFragment();
    fragment.appendChild(el.firstChild);// 将el中的元素放到fragment中去,并删除el中原有的，这个是appendChild自带的功能
    return fragment;
  }

  compileText(node) {
    //编译{{xxx}}的值
    var reg = /\{\{(.*)\}\}/ //用来判断有没有vue的双括号的
    if (reg.test(node.textContent)) {
      let matchedName = RegExp.$1;
      node.textContent = this.$vm[matchedName];
      new Watch(this.$vm, matchedName, function (value) {
        node.textContent = value;
      });
    }
  }
}
