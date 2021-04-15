//原始数据类型
let isFalse: boolean = false // 布尔

let conut: number = 1 // 数字

let str: string = 'hello ts' //字符串

let noSure: any = '222'  // 任意类型

const sym = Symbol(); //ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。
let obj = {  // symbol 类型
    [sym]: "semlinker",
};

let u: undefined = undefined;
let n: null = null;

// 在 TypeScript 中，可以用 void 表示没有任何返回值的函数：
function warnUser(): void {  // 空值
    console.log("This is my warning message");
}

let list1: number[] = [1, 2, 3]  //数组
let list2: Array<number> = [4, 5, 6]  // 数组的泛型

let tupleType: [string, boolean];  // 元组
tupleType = ["semlinker", true];

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

let dir3: Direction3 = Direction3.NORTH;

//4.异构枚举
enum Enum {
    A,
    B,
    C = "C",
    D = "D",
    E = 8,
    F,
}


// --------------非原始类型----------------

/*
 * 1.在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。必须满足一一对应;
 * 2.一旦定义了任意属性，那么确定属性(name)和可选属性(age)的类型都必须是它的类型的子集：
*/

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





// 可选参数 注意：可选参数必须接在必需参数后面
// 默认参数  firstName: string = 'Cat'
function buildName(firstName: string = 'Cat', lastName?:string) {
    return lastName ? firstName + ' ' + lastName : firstName;
}

function pushList(array: any[], ...items: any[]) {
    items.forEach(function (item) {
        array.push(item);
    });
}

let a = [];
pushList(a, 1, 2, 3);