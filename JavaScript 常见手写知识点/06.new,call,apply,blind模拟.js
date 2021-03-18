
/**
 * 01.模拟new关键字
 * 在JavaScript中， 使用new关键字后， 意味着做了如下4件事：
 * 1.创建一个新的空对象 {}
 * 2.设置这个对象原型指向构造函数， 即上例中的obj.__proto = Person.prototype
 * 3.执行构造函数， 当this关键字被提及的时候， 使用新创建的对象的属性。
 * 4.返回新创建的对象（除非构造函数中返回的是“无原型”）。
 */


// new 关键字用来创建一个类（模拟类）的实例对象。 实例化对象之后， 也就继承了类的属性和方法。 例如：
function Person (name, age) {
    this.name = name;
    this.age = age;
}
var person = new Person('james', 18);
console.log(person.name, person.age);
person.getName();

// 在以上代码中 var person = new Person('james', 18); 中的new关键字做了些什么呢？用伪代码来模拟其执行的过程如下：

// new Person('james', 18) = {
//     var obj = {};
//     obj.__proto__ = Person.prototype;
//     var res = Person.call(obj, 'james', 18);
//     return typeof res === 'object' ? res : obj;
// }



/**
 * 02.模拟call方法
 * 核心点：改变函数的调用对象,this的指向；
 */

//实现一个call方法：
Function.prototype.myCall = function (context,...args) {
    var context = context || window; //此处没有考虑context非object情况
    context.fn = this  // 谁调用谁就是this,这里指的是Person函数
    let result = context.fn(...args);
    delete context.fn;
    return result;
};
// -------------实例------------------------
function Person (name, age) {
    this.name = name;
    this.age = age;
}
let o = {}
Person.myCall(o)
console.log(o);


/**
 * 03.模拟apply方法
 * 核心点：改变函数的调用对象
 * 区别：知识改变传参的方式[]
 */

//实现一个apply方法：
Function.prototype.myApply = function (context, args=[]) {
    var context = context || window; //此处没有考虑context非object情况
    context.fn = this  // 谁调用谁就是this,这里指的是Person函数
    let result = context.fn(...args);
    delete context.fn;
    return result;
};
// -------------实例------------------------
function Person (name, age) {
    this.name = name;
    this.age = age;
}
let o = {}
Person.myApply(o,['will',22])
console.log(o);


/**
 * 04.模拟bind方法
 * 核心点：改变函数的调用对象.执行闭包
 * 区别：调用后执行
 */

//实现一个bind方法：
Function.prototype.myBind = function (context, args = []) {
    var context = context || window; //此处没有考虑context非object情况
    context.fn = this  // 谁调用谁就是this,这里指的是Person函数

    function fn1() {
        let result = context.fn(...args);
        delete context.fn;
        return result;
    }
    return fn1
};
// -------------实例------------------------
function Person (name, age) {
    this.name = name;
    this.age = age;
}
let o = {}
Person.myBind(o, ['will', 22])()
console.log(o);
