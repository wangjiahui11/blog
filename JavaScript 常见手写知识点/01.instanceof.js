let n =0
function my_instanceof(l,r) {
  let L = l.__proto__
  let R = r.prototype
  while (true) {
    n++
    if(L === null) return false
    if(L === R) return true
    L = L.__proto__
  }
}


my_instanceof (Function, Object)
console.log(`打印次数：${n}`)


/*
  instansof 不能检查基础数据类型;
*/
