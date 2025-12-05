function myinstanceof(L, R) {
  if (typeof(L) !== 'object' && typeof(L) !== 'function' || L == null) {
    return false
  }

  while (L.__proto__ !== null) { // Object.prototype.__proto__ == null
    if (L.__proto__ === R.prototype) {
      return true
    }
    L = L.__proto__
  }
  return false
}

// console.log(myinstanceof([], Array) );// true
// console.log(myinstanceof([], Object) );// true
console.log(myinstanceof(null, Object) );// false


