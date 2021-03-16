// JavaScript常用八种继承方案

/**
 * 01.原型链继承
 * 核心点：通过prototype继承;
 * 优点:方法简单,父元素的属性和方法;
 * 缺点：实例对引用类型的操作会被篡改；
 */
function Father () {
  this.skill =['js','pyhton']
}
Father.prototype.say = function () {
     return this.skill
}

function Son () {
  this.gender = false
}

Son.prototype = new Father()
// 例子：
let s1 = new Son()
console.log(s1,'------------',s1.say());

let s2 = new Son()

s2.skill.push('node')
console.log('s1-skill:' + s1.skill, '------------------', 's2-skik:' + s2.skill,);
console.log(s1.skill === s2.skill)  // 指向指向相同


/**
 * 02.构造函数继承
 * 核心点：call方法;创建子类实例时调用父元素的构造函数;
 * 优点:每个实例赋值父元素的属性和方法,不会引起数据篡改；
 * 缺点：1.无法继承父元素原型链上的属性/方法；
 *       2.每个实例都创建了父实例的副本,会造成性能浪费；
 */
function Father () {
  this.skill =['js','pyhton']
}
Father.prototype.say = function () {
     return this.skill
}

function Son () {
  this.name ='son'
  Father.call(this)
}
let s1 = new Son()
console.log(s1,'------------',s1.name);
console.log( s1.say);  // 报错
let s2 = new Son()
s2.skill.push('node')
console.log('s1-skill:' + s1.skill, '------------------', 's2-skik:' + s2.skill,);
console.log(s1.skill === s2.skill)  // 指向指向相同


/**
 * 03.组合继承
 * 核心点：1.prototype继承，原型链的方法;2.call方法;创建子类实例时调用父元素的构造函数;
 * 优点:1.每个实例赋值父元素的属性和方法,不会引起数据篡改；2.继承原型链上的方法/属性；
 * 缺点：1.对象实例上有两份属性/方法，a：实例上,b:实例原型上。
 *       2.每个实例都创建了父实例的副本,会造成性能浪费；
 */


function Father () {
  this.skill = ['js', 'pyhton']
}
Father.prototype.say = function () {
  return this.skill
}
// 构造函数继承
function Son () {
  Father.call(this)
}
// 原型链继承
Son.prototype = new Father()
Son.prototype.constructor = Son // Son.prototype的constructor属性，指向自己的构造函数Son

let s1 = new Son()
console.log(s1, '------------', s1.say());
let s2 = new Son()
s2.skill.push('node')
console.log('s1-skill:' + s1.skill, '------------------', 's2-skik:' + s2.skill,);
console.log(s1.skill === s2.skill)  // 指向指向相同


/**
 * 04.原型式
 * 核心点：创建新的构造函数做媒介，将对象的方法指向这个构造函数的原型上
 * 优点: 继承构造函数的方法
 * 缺点：1.原型链继承多个实例的引用类型属性指向相同，存在篡改的可能
 *       2.无法传递参数
 */
function objInherit(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

let person ={
  name:'jack',
  skill: ['js', 'pyhton']
}

let p1 = objInherit(person)
console.log(p1,'-----------', p1.skill);

let p2 = objInherit(person)
p2.skill.push('java')
console.log(p1,p2,p1.skill);
console.log(p2.skill === p1.skill);



/**
 * 05.寄生式继承
 * 核心点：在原型式继承的基础上，增强对象，返回构造函数
 * 优点: 继承构造函数的方法
 * 缺点：1.原型链继承多个实例的引用类型属性指向相同，存在篡改的可能
 *       2.无法传递参数
 */

// ES5中存在Object.create()的方法，能够代替下面的objInherit方法。
function objInherit (obj) {
  function F () { }
  F.prototype = obj
  return new F()
}

function createOther(obj) {
  let clone = objInherit(obj)
  clone.say = function () {
    console.log('say ----------hi');
  }
  return clone
}

let person = {
  name: 'jack',
  skill: ['js', 'pyhton']
}

let p1 = createOther(person)
p1.skill.push('go')
let p2 = createOther(person)
p1.say()
console.log(p1,'------',p2,'-------p2:',p2.skill);



/**
 * 06.寄生组合式继承
 * 核心点：构造模式和寄生模式的混合
 * 优点: 继承构造函数的方法和父类的原型链
 * 缺点：1.写法复杂
 */
function inheritPrototype (Son,Father) {
  let prototypeObj = Object.create(Father.prototype)  // 创建一个父类原型的副本对象
  prototypeObj.constructor = Son   // 弥补将副本构造函数副本缺失
  Son.prototype = prototypeObj  // 将子类的原型指向 父类的原型副本对象
}

function Father (name) {
  this.skill = ['js', 'pyhton']
}

Father.prototype.sayHi = function () {
  console.log(`大家好，我是${this.name}的爸爸`);
}

// 借用构造函数传递增强子类实例属性
function Son (name,age) {
  Father.call(this)
  this.name = name
  this.age = age
}
// 继承父类的原型上的 属性/方法
inheritPrototype(Son, Father);
Son.prototype.sayAge = function () {
  console.log(`大家伙${this.name},今年${this.age}岁`);
}

let p1 = new Son('小明',5)
let p2 = new Son('小红', 4)
console.log(p1,'--------',this.skill);
p1.sayAge()
p1.sayHi()
p1.skill.push('flutter')
console.log(p1.skill, '--------', p1.skill === p2.skill);

/**
 * 07.混合类继承
 * 核心点：class super ，extend的运用
 * 优点: 继承构造函数的方法和父类的原型链
 * 缺点：1.部分低版本浏览器不支持
 */
function SuperClass() {
  this.skill =['es6']
  this.name = 'SuperClass'
}
SuperClass.prototype.toskill =function() {
  console.log(`我的skill：${this.skill}`);
}
function OtherSuperClass() {
  this.do = ['pyhton']
  this.name = 'OtherSuperClass'
}
OtherSuperClass.prototype.todo = function () {
  console.log(`我的do：${this.do}`);
}


function MyClass () {
  SuperClass.call(this)
  OtherSuperClass.call(this)
  this.name = 'MyClass'
}

// 继承一个类
MyClass.prototype = Object.create(SuperClass.prototype);
// 混合其它
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// 重新指定constructor
MyClass.prototype.constructor = MyClass;

// MyClass.prototype.myMethod = function () {
//   // do something
// };

let m1 = new MyClass()
console.log(m1, '----do---', m1.todo(),'----skill----',m1.toskill());


/**
 * 08.类继承
 * 核心点：class super ，extend的运用
 * 优点: 继承构造函数的方法和父类的原型链
 * 缺点：1.部分低版本浏览器不支持
 */


class Rectangle{
  constructor(width,heigt){
    this.width = width
    this.heigth = heigt
  }
  // 取值函数是设置在属性的 Descriptor 对象上的------及constructor上的属性；
  get area(){
    return this.calcArea()
  }

  calcArea(){
    return this.width*this.heigth
  }
}

class Square extends Rectangle{
  constructor(length){
    super(length,length)  // 继承父类的属性方法
    this.name = 'Square'
  }
}

let r1 =new Rectangle(9,7)
console.log(r1);
let s1 = new Square(10)
console.log(s1,s1.calcArea());


// 类的由来 JavaScript 语言中，生成实例对象的传统方法是通过构造函数。
function Point (x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

// 等价于

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString () {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
