var LRUCache = function(capacity) {
  this.data = {}
  this.keyArr = []
  this.max = capacity
};

LRUCache.prototype.get = function(key) {
  const index = this.keyArr.indexOf(key)
  if (index !== -1) {
    this.keyArr.splice(index, 1)
    this.keyArr.push(key)
    return this.data[key]
  }
  return -1
};

LRUCache.prototype.put = function(key, value) {
  const index = this.keyArr.indexOf(key)
  if (index !== -1) {
    this.keyArr.splice(index, 1)
  }
  this.data[key] = value
  this.keyArr.push(key)

  if (this.max < this.keyArr.length) {
    const oldKey = this.keyArr.shift()
    delete this.data[oldKey]
  }
};



let lRUCache = new LRUCache(2);  // {data: {}}
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
console.log(lRUCache.get(1)); // 1
lRUCache.put(3, 3);

console.log(lRUCache);
