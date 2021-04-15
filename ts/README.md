## TypeScript知识汇总

### 一、TypeScript 是什么

> TypeScript 是一个开源的编程语言，它是 JavaScript 的一个超集，本质上是在javaScript的基础上添加静态类型定义构建而成。
>
> 类型提供了一种描述对象形状的方法。可以帮助提供更好的文档，还可以让 TypeScript 验证你的代码可以正常工作。

#### 1.1 TypeScript 与 JavaScript 的区别

| TypeScript                                     | JavaScript                                 |
| ---------------------------------------------- | ------------------------------------------ |
| JavaScript 的超集用于解决大型项目的代码复杂性  | 一种脚本语言，用于创建动态网页             |
| 可以在编译期间发现并纠正错误                   | 作为一种解释型语言，只能在运行时发现错误   |
| 强类型，支持静态和动态类型                     | 弱类型，没有静态类型选项                   |
| 最终被编译成 JavaScript 代码，使浏览器可以理解 | 可以直接在浏览器中使用                     |
| 支持模块、泛型和接口                           | 不支持模块，泛型或接口                     |
| 社区的支持仍在增长，而且还不是很大             | 大量的社区支持以及大量文档和解决问题的支持 |

#### 1.2 获取 TypeScript

命令行的 TypeScript 编译器可以使用 [npm](https://www.npmjs.com/) 包管理器来安装。

##### 1.安装 TypeScript

```shell
$ npm install -g typescript
复制代码
```

##### 2.验证 TypeScript

```shell
$ tsc -v 
# Version 4.0.2
复制代码
```

##### 3.编译 TypeScript 文件

```shell
$ tsc helloworld.ts
# helloworld.ts => helloworld.js
复制代码
```

当然，对刚入门 TypeScript 的小伙伴来说，也可以不用安装 `typescript`，而是直接使用线上的 [TypeScript Playground](https://www.typescriptlang.org/play/) 来学习新的语法或新特性。通过配置 **TS Config** 的 Target，可以设置不同的编译目标，从而编译生成不同的目标代码。

下图示例中所设置的编译目标是 ES5：

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5db52f7a4d664d93a72a3da6e6a92ae0~tplv-k3u1fbpfcp-zoom-1.image)

（图片来源：[www.typescriptlang.org/play）](https://www.typescriptlang.org/play）)

#### 1.3 典型 TypeScript 工作流程

![img](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dea0cbad55b246a8a7e65aec57273ade~tplv-k3u1fbpfcp-zoom-1.image)

如你所见，在上图中包含 3 个 ts 文件：a.ts、b.ts 和 c.ts。这些文件将被 TypeScript 编译器，根据配置的编译选项编译成 3 个 js 文件，即 a.js、b.js 和 c.js。对于大多数使用 TypeScript 开发的 Web 项目，我们还会对编译生成的 js 文件进行打包处理，然后在进行部署。

#### 1.4 TypeScript 初体验

新建一个 `hello.ts` 文件，并输入以下内容：

```typescript
function greet(person: string) {
  return 'Hello, ' + person;
}

console.log(greet("TypeScript"));
```

然后执行 `tsc hello.ts` 命令，之后会生成一个编译好的文件 `hello.js`：

```javascript
"use strict";
function greet(person) {
  return 'Hello, ' + person;
}
console.log(greet("TypeScript"));
```

​		观察以上编译后的输出结果，我们发现 `person` 参数的类型信息在编译后被擦除了。TypeScript 只会在编译阶段对类型进行静态检查，如果发现有错误，编译时就会报错。而在运行时，编译生成的 JS 与普通的 JavaScript 文件一样，并不会进行类型检查。

### 二、TypeScript 基础

#### 2.1 Boolean 类型

```ts
let isDone: boolean = false;
let createdByNewBoolean: Boolean = new Boolean(1);
```

#### 2.2 Number 类型

```js
var count:string = 6;
```

#### 2.3 String 类型

```ts
let myName: string = 'Tom';
```

#### 2.4 Symbol 类型

```ts
// ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。
const sym = Symbol();

let obj = {
    [sym]: "value"
};

console.log(obj[sym]); // "value"
```

#### 2.5 void 类型

> 在 TypeScript 中，可以用 `void` 表示没有任何返回值的函数

```ts
function alertName(): void {
    alert('My name is Tom');
}
```

声明一个 `void` 类型的变量没有什么用，因为你只能将它赋值为 `undefined` 和 `null`：

```ts
let unusable: void = undefined;
```

#### 2.6 Null 和 Undefined

```ts
let u: undefined = undefined;
let n: null = null;
```

#### 2.6 any

但如果是 `any` 类型，则允许被赋值为任意类型。

```ts
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
```

**任意值的属性和方法**

在任意值上访问任何属性都是允许的：

```ts
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
```

也允许调用任何方法：

```ts
let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');
```

可以认为，**声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值**。

#### 2.7 类型推导

> 如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

```ts
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

#### 2.8 联合类型

> 联合类型（Union Types）表示取值可以为多种类型中的一种。

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

**访问联合类型的属性或方法**

> 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们**只能访问此联合类型的所有类型里共有的属性或方法**：

```ts
function getLength(something: string | number): number {
    return something.length;
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

#### 2.8 对象类型-接口(interface)

> 在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。

**基础版**

```ts
interface Person {  // 名称通常大写
    name: string;
    age: number;
}

let tom: Person = {
    name: 'Tom',
    age: 25
};
```

**综合版interface**

```
/**
 * 1.在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。必须满足一一对应;
 * 2.一旦定义了任意属性，那么确定属性(name)和可选属性(age)的类型都必须是它的类型的子集：
**/

interface Person {
    readonly id: number; // 可读属性
    name: string; // 必填属性
    age?: number; // 可选属性
    [propName: string]: string | number; // 任意属性[可多个值]   
}

let tom: Person = {
    id:122,
    name: 'Tom',
    age: 25,
    gender: 'male',
    skill:'go'
};
```

#### 2.9 数组类型

```ts
/**
 * 1.「类型 + 方括号」来表示数组；
 * 2. Array<elemType> 来表示数组
 * 3. 用接口表示数组
**/

let list1: number[] = [1, 2, 3]  //数组
let list2: Array<number> = [4, 5, 6]  // 数组的泛型
interface NumberArray {
    [index: number]: number;
}
let list3: NumberArray = [1, 1, 2, 3, 5];
```

#### 2.10 函数的类型

> 在 JavaScript 中，有两种常见的定义函数的方式——函数声明（Function Declaration）和函数表达式（Function Expression）：

```ts
// 函数声明
function sum(x: number, y: number): number {
    return x + y;
}
// 函数表达式
let mySum = function (x: number, y: number): number {
    return x + y;
};

//接口定义
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}

// 可选参数 注意：可选参数必须接在必需参数后面
// 默认参数  firstName: string = 'Cat'
function buildName(firstName: string = 'Cat', lastName?:string) {
    return lastName ? firstName + ' ' + lastName : firstName;
}

// 剩余参数 ES6 中，可以使用 ...rest 的方式获取函数中的剩余参数（rest 参数）：
function pushList(array: any[], ...items: any[]) {
    items.forEach(item =>array.push(item)
}

let a = [];
pushList(a, 1, 2, 3);
```

### 三、TypeScript 进阶

#### 3.1 元组

> 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

```ts
let tom: [string, number] = ['Tom', 25];
tom[0] = 'Tom';
tom[1] = 25;
```

#### 3.2枚举

> 枚举（Enum）类型用于取值被限定在一定范围内的场景，比如方位只东南西北，颜色限定为红绿蓝等。

```
//1.数字枚举
enum Direction {
    EAST,
    SOUTH,
    WEST,
    NORTH
}
let dir: Direction = Direction.NORTH; //3

//2.字符串枚举
enum Direction2 {
    NORTH = "NORTH",
    SOUTH = "SOUTH",
    EAST = "EAST",
    WEST = "WEST",
}
let dir2: Direction2 = Direction2.NORTH; //NORTH

//3.常量枚举
const enum Direction3 {
    NORTH,
    SOUTH,
    EAST,
    WEST,
}

let dir3: Direction3 = Direction3.NORTH; // 0

//4.异构枚举
enum Enum {
    A,
    B,
    C = "C",
    D = "D",
    E = 8,
    F,
}

// 5.外部枚举
declare const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];
```

#### 3.3 类

> 类（Class）：定义了一件事物的抽象特点，包含它的属性和方法

**TypeScript 中类的用法**（**public private 和 protected**）

TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 `public`、`private` 和 `protected`。

- `public` 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 `public` 的
- `private` 修饰的属性或方法是私有的，不能在声明它的类的外部访问
- `protected` 修饰的属性或方法是受保护的，它和 `private` 类似，区别是它在子类中也是允许被访问的

`public` 

```
class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';
console.log(a.name); // Tom
```

`private` 

注意：使用 `private` 修饰的属性或方法，在子类中也是不允许访问的：

```
class Animal {
  private name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name);
a.name = 'Tom';

// index.ts(9,13): error TS2341: Property 'name' is private and only accessible within class 'Animal'.
// index.ts(10,1): error TS2341: Property 'name' is private and only accessi
```

`protected` 

```
class Animal {
  protected name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}
```

**readonly**

只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。

```ts
class Animal {
  readonly name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';

// index.ts(10,3): TS2540: Cannot assign to 'name' because it is a read-only property.
```

**抽象类**

`abstract` 用于定义抽象类和其中的抽象方法。

- 抽象类是不允许被实例化的;
- 抽象类是不允许被实例化的;

```ts
abstract class Animal {
  public name;
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class Cat extends Animal {
  public sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}

let cat = new Cat('Tom');
```

#### 3.4 类和接口

- 类实现接口

  > 实现（implements）是面向对象中的一个重要概念。一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成接口（interfaces），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

  ```
  // 公共的报警系统
  interface Alarm {
      alert(): void;
  }
  
  class Door {
  }
  // 防盗门继承公共的报警系统的接口
  class SecurityDoor extends Door implements Alarm {
      alert() {
          console.log('SecurityDoor alert');
      }
  }
  // 车继承公共的防盗系统的接口
  class Car implements Alarm {
      alert() {
          console.log('Car alert');
      }
  }
  ```

- **接口继承接口**

  ```
  interface Alarm {
      alert(): void;
  }
  
  interface LightableAlarm extends Alarm {
      lightOn(): void;
      lightOff(): void;
  }
  ```

  `LightableAlarm` 继承了 `Alarm`，除了拥有 `alert` 方法之外，还拥有两个新方法 `lightOn` 和 `lightOff`。

- **接口继承类**

  常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可以的：

  ```
  class Point {
      x: number;
      y: number;
      constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
      }
  }
  
  interface Point3d extends Point {
      z: number;
  }
  
  let point3d: Point3d = {x: 1, y: 2, z: 3};
  ```

  声明 `class Point` 时，除了会创建一个名为 `Point` 的类之外，同时也创建了一个名为 `Point` 的类型（实例的类型）。

  简单的理解：它既是一个类，也是一个接口；

  所以 `Point` 可当做一个类来用（使用 `new Point` 创建它的实例）：

  ```
  class Point {
      x: number;
      y: number;
      constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
      }
  }
  
  const p = new Point(1, 2);
  ```

  也可以将`Point` 当做一个类型来用（使用 `: Point` 表示参数的类型）：

  ```ts
  class Point {
      x: number;
      y: number;
      constructor(x: number, y: number) {
          this.x = x;
          this.y = y;
      }
  }
  
  function printPoint(p: Point) {
      console.log(p.x, p.y);
  }
  
  printPoint(new Point(1, 2));
  ```

#### 3.4 泛型

> 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

- **基础实例**

  ```
  function createArray<T>(length: number, value: T): Array<T> {
      let result: T[] = [];
      for (let i = 0; i < length; i++) {
          result[i] = value;
      }
      return result;
  }
  
  createArray<string>(3, 'x'); // ['x', 'x', 'x']
  ```

  上例中，我们在函数名后添加了 `<T>`，其中 `T` 用来指代任意输入的类型，在后面的输入 `value: T` 和输出 `Array<T>` 中即可使用；

  即在使用过程中，确定数据类型，保证后面的数据类型 的一致性；

- **泛型接口**

  ```ts
  // 泛型的接口来定义函数的形状：
  interface CreateArrayFunc {
      <T>(length: number, value: T): Array<T>;
  }
  
  let createArray: CreateArrayFunc;
  createArray = function<T>(length: number, value: T): Array<T> {
      let result: T[] = [];
      for (let i = 0; i < length; i++) {
          result[i] = value;
      }
      return result;
  }
  
  createArray(3, 'x'); // ['x', 'x', 'x']
  
  // 泛型参数提前到接口名上：
  interface CreateArrayFunc<T> {
      (length: number, value: T): Array<T>;
  }
  
  let createArray: CreateArrayFunc<any>;
  createArray = function<T>(length: number, value: T): Array<T> {
      let result: T[] = [];
      for (let i = 0; i < length; i++) {
          result[i] = value;
      }
      return result;
  }
  
  createArray(3, 'x'); // ['x', 'x', 'x']
  ```

- **泛型参数默认值**

  ```ts
  function createArray<T = string>(length: number, value: T): Array<T> {
      let result: T[] = [];
      for (let i = 0; i < length; i++) {
          result[i] = value;
      }
      return result;
  }
  ```

  

#### 3.5 声明合并

> 如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型：

- **函数合并**

  ```
  function reverse(x: number): number;
  function reverse(x: string): string;
  // 相当于
  function reverse(x: number | string): number | string {
    
  }
  ```

- **接口合并**

  ```ts
  interface Alarm {
      price: number;
  }
  interface Alarm {
      weight: number;
  }
  
  // 等价于
  interface Alarm {
      price: number;
      weight: number;
  }
  ```

#### 3.6 断言

> 类型断言（Type Assertion）可以用来手动指定一个值的类型。

##### 1.**用途四个方面**

- **联合类型断言**

  ```
  interface Cat {
      name: string;
      run(): void;
  }
  interface Fish {
      name: string;
      swim(): void;
  }
  
  function isFish(animal: Cat | Fish) {
      if (typeof (animal as Fish).swim === 'function') {
          return true;
      }
      return false;
  }
  ```

  `(animal as Fish).swim()` 这段代码隐藏了 `animal` 可能为 `Cat` 的情况，将 `animal` 直接断言为 `Fish` 了，而 TypeScript 编译器信任了我们的断言，故在调用 `swim()` 时没有编译错误。

  但注意如果传入参数是Cat类型的变量任然会报错；由于Cat上没有swim的方法；	

- **父类断言更具体的子类**

  参数的类为是比较抽象的父类 `Error`，这样的话这个函数就能接受 `Error` 或它的子类作为参数了。

  - 类型类时

    ```
    class ApiError extends Error {
        code: number = 0;
    }
    class HttpError extends Error {
        statusCode: number = 200;
    }
    
    function isApiError(error: Error) {
        if (error instanceof ApiError) {
            return true;
        }
        return false;
    }
    ```

    上面的例子中，确实使用 `instanceof` 更加合适，因为 `ApiError` 是一个 JavaScript 的类，能够通过 `instanceof` 来判断 `error` 是否是它的实例。

  - 类型为接口时

    ```
    interface ApiError extends Error {
        code: number;
    }
    interface HttpError extends Error {
        statusCode: number;
    }
    
    function isApiError(error: Error) {
        if (typeof (error as ApiError).code === 'number') {
            return true;
        }
        return false;
    }
    ```

- **任意类型转换any**

  上面的例子中，我们需要将 `window` 上添加一个属性 `foo`，但 TypeScript 编译时会报错，提示我们 `window` 上不存在 `foo` 属性。

  此时我们可以使用 `as any` 临时将 `window` 断言为 `any` 类型：

  ```
  (window as any).foo = 1;
  ```

  需要注意的是，将一个变量断言为 `any` 可以说是解决 TypeScript 中类型问题的最后一个手段。

  **它极有可能掩盖了真正的类型错误，所以如果不是非常确定，就不要使用 `as any`。**

  总之，**一方面不能滥用 `as any`，另一方面也不要完全否定它的作用，我们需要在类型的严格性和开发的便利性之间掌握平衡**（这也是 [TypeScript 的设计理念](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals)之一），才能发挥出 TypeScript 最大的价值。

- **any转换任意类型**

  目的：在日常的开发中，我们不可避免的需要处理 `any` 类型的变量，如果断言成一个精确的类型，可以方便了后续的操作：

  ```
  function getCacheData(key: string): any {
      return (window as any).cache[key];
  }
  
  interface Cat {
      name: string;
      run(): void;
  }
  
  const tom = getCacheData('tom') as Cat;
  tom.run();
  ```

##### 2.非空断言的使用

> 当类型检查器无法断定类型时，一个新的后缀表达式操作符 `!` 可以用于断言操作对象是非 null 和非 undefined 类型；

```typescript
// 忽略 undefined 和 null 类型
function myFunc(maybeString: string | undefined | null) {
  // Type 'string | null | undefined' is not assignable to type 'string'.
  // Type 'undefined' is not assignable to type 'string'. 
  const onlyString: string = maybeString; // Error
  const ignoreUndefinedAndNull: string = maybeString!; // Ok
}
```

#### 3.7声明文件

> 当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。
>
> 使用declare进行声明

参考：https://ts.xcatliu.com/basics/declaration-files.html

### 四、参考资源

- [TypeScript 入门教程](https://ts.xcatliu.com/)
- [一份不可多得的 TS 学习指南（1.8W字）](https://juejin.cn/post/6872111128135073806#heading-3)

- [TypeScript Handbook（中文版）](https://zhongsp.gitbooks.io/typescript-handbook/content/)

- [深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)