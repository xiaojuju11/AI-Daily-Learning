var LRUCache = function(capacity) {
  this.map = new Map()
  this.max = capacity
};

LRUCache.prototype.get = function(key) {
  if (this.map.has(key)) {
    const val = this.map.get(key)
    this.map.delete(key)
    this.map.set(key, val)
    return val
  }
  return -1
};

LRUCache.prototype.put = function(key, value) {
  if (this.map.has(key)) {
    this.map.delete(key)
  }
  this.map.set(key, value)
  if (this.map.size > this.max) {
    const oldkey = this.map.keys().next().value
    this.map.delete(oldkey)
  }
};



let lRUCache = new LRUCache(2);  // {data: {}}
lRUCache.put(1, 1); 
lRUCache.put(2, 2); 
console.log(lRUCache.get(1)); // 0
lRUCache.put(3, 3);
// lRUCache.put(4, 4);
// console.log(lRUCache.get(1)); // -1
// console.log(lRUCache.get(3)); // 3
// console.log(lRUCache.get(4)); // 4


console.log(lRUCache);
