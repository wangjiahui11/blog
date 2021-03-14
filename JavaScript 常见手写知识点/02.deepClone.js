//基础版的深克隆
function clone(o) {
  if(typeof o !=='object' && typeof o !='function'){
    return o
  }else{
    let res = Array.isArray(o) ? []:{}
    for (const key in o) {
      res[key] = typeof o[key] === 'object' ? o[key] : clone(o[key])
    }
    return res
  }
}


let obj = {
  a: 1,
  b: [2, 3],
  c: {
    num1: 4,
    num2: 5
  }
}

let obj1 = clone(obj)
console.log(obj1, obj.b === obj1.b)
