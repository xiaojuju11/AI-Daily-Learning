function toString() {
  const O = ToObject(this)
  // {
  //   x: dasdas
  //   h: dadas,
  //   [[class]]: String
  // }
  const class = O.[[class]]
}

// console.log(toString.call(undefined));
