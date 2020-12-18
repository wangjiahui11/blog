// 方法一
function checkType (content, Type) {
  return Object.prototype.toString.call(content) === `[object ${Type}]`
}
const flag = checkType('hello', 'String');

export { checkType }

// 将方法写在util对象上
function checkTypes (Type) {
  return function (content) {
    return Object.prototype.toString.call(content) === `[object ${Type}]`
  }
}
const util = {};
const types = ['String', 'Number', 'Boolean'];
types.forEach(type => {
  util['is' + type] = checkTypes(stype);
});

export { util }
