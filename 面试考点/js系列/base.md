# var ，let ,const
- 面试回答：
第一，先从作用域开始，它最主要的区别在于作用域规则不同。var声明的变量是函数作用域或者全局作用域，而let和const是块级作用域。块级作用域的引入解决了过去VR在if语句或者for循环中容易造成变量泄露的问题，让代码更健壮。
第二，提升行为，你可以说var存在变量提升，它的声明会提到作用域顶部，并且初始化为undefined。这就意味着在声明前访问它，就不会报错，但是会得到一个undefined。
相比之下呢， let和const不存在变量提升，它们有暂时性死区的特性，在声明语句出现之前访问它，会直接抛出错误ReferenceError，这是一种更安全、更符合预期的行为。
第三，赋值和声明规则来看，var既既可以重复声明，也可以重新赋值。let 不能在同一个作用域中重复声明，但它可以重新赋值。而 const 是最严格的，既不能重新声明，也不能重新赋值。对于 const，需要强调的是，当它用于声明对象或数组这些引用类型时，它保证的是变量的引用的不变。而对象内部的属性是可变的。

- var：可声明提升、可重复声明、挂在 window、无块级作用域
- let：块级作用域、不可重复声明、不会成为window的属性(减少全局变量的污染)、暂时性死区TDZ、可赋值修改
- const：块级作用域、不可重复声明、不会成为window的属性(减少全局变量的污染)、暂时性死区TDZ、声明后不能重赋值，，但是可以修改引用类型的内部属性

1. 优先使用 const
   - 增强代码可预测性，避免意外修改。
2. 当变量需要重新赋值时，使用 let
   - 例如：循环计数器、状态切换。
3. 告别 var
   - 在现代 JS 项目中，应避免使用 var。


# 数据类型
- 原始类型（number, string, boolean, null, undefined, symbol, bigint）值类型
变量直接存储数据的值，赋值拷贝的是数据的值，存储在栈中。
- 引用类型（object, array, function，日期，正则）引用类型
变量存储的是数据的引用（内存地址），而不是数据本身。赋值拷贝的是数据的引用，数据本身存储在堆中。

- JavaScript 永远是 按值传递 (pass by value)
- 值类型：传递 值的副本
- 引用类型：传递 引用的副本

# 说说 js 中的类型判断
面试回答：先讲数据类型，再讲类型判断
- 是什么：
typeof：能准确识别除了null以外的所有原始类型；对null存在bug,这是因为 JS 诞生时的一个设计失误：null的二进制表示全是 0，而所有对象的二进制前三位都是 0，于是typeof就把null错认为对象了.对引用类型，只有函数能被typeof准确识别，其他引用类型一律被贴上"object"的标签。
instanceof:原理：沿着对象的原型链往上找，看看能不能找到某个构造函数的原型。准确判断引用类型，不能判断基础类型。并且会受到原型链修改的影响。
Object.prototype.toString.call(arr)：能准确识别所有类型，包括null和undefined，不受原型链修改的影响，兼容性好，从 ES3 到 ES6 都支持。统一返回`[object 类型名]`格式的字符串。
constructor：利用实例的 constructor 属性指向其构造函数来判断类型。缺点：constructor 属性可以被篡改；null 和 undefined 没有 constructor，访问会报错，稳定性差，不推荐用于类型校验。
Array.isArray()：只能判断数组，不能判断其他引用类型

# 浅拷贝和深拷贝
- 浅拷贝 (SHALLOW COPY)：
1.  创建一个新对象
2.  复制原始对象的 第一层 属性
3.  如果属性是值类型，复制 值
4.  如果属性是引用类型，复制 内存地址

一、浅拷贝（只拷第一层）
1.对象：{...obj}、Object.assign({}, obj)
2.数组：[...arr]、slice()、concat()
3.特点：嵌套对象仍共用原引用，改嵌套数据会影响原数据

- 深拷贝 (DEEP COPY)：
1.  创建一个新对象
2.  递归地 复制所有层级的属性
3.  所有引用类型属性都会被 重新创建
4.  新旧对象 完全独立，互不干扰

二、深拷贝（全层级新引用，互不干扰）
- structuredClone(obj) 原生 ES2022+，支持 Date/Map/Set/RegExp 循环引用；不支持函数，Symbol，老浏览器不兼容。
- JSON.parse(JSON.stringify(obj)) 兼容性最强；丢函数 / Symbol/undefined，Date 变字符串、不支持循环引用。
- lodash.cloneDeep(obj) 项目常用，功能最全，需引入 lodash 库。

- 手写深拷贝（核心思路）
1.原始类型直接返回
2.数组 / 对象新建容器，递归遍历拷贝
3.用WeakMap处理循环引用，单独兼容 Date/RegExp

function deepClone(obj, hash = new WeakMap()) {//WeakMap 相当于备忘录，记下 “这个对象我已经拷贝完了，不要再重复拷贝
  if (obj === null || typeof obj !== 'object') return obj;
  if (hash.has(obj)) return hash.get(obj); // 处理循环引用  // 如果备忘录里有这个对象，直接返回之前拷贝好的副本

  let cloneObj = Array.isArray(obj) ? [] : {};
  hash.set(obj, cloneObj); // 存入哈希表

  for (let key in obj) {//拿到所有可枚举属性名
    if (Object.prototype.hasOwnProperty.call(obj, key)) {//`hasOwnProperty` 只保留 obj 自己身上的属性，过滤掉原型链继承的属性
      cloneObj[key] = deepClone(obj[key], hash); // 递归
    }
  }
  return cloneObj;
}
深拷贝用 WeakMap 存储已经拷贝的对象，处理循环引用；弱引用特性，不会造成内存泄漏。
- **for in 拿键（key），遍历对象；**
- **for of 拿值（value），遍历数组。**
这个基础版深拷贝，先用判断处理 null 和原始类型；再用 WeakMap 记录已经拷贝过的对象，解决循环引用。然后区分数组和对象创建容器，遍历自身属性递归拷贝。
缺点：只能处理普通对象数组，不支持 Date、RegExp、Map、Set 等特殊内置对象。

# 数组的常用方法
# 核心分类
- 迭代方法: forEach, map, filter, reduce...
- 修改原数组 (Mutator): push, pop, splice...
- 返回新数组 (Non-mutating): slice, concat, map...

- map() ： 转换数组，创建新数组，返回值: 一个等长的新数组，改变原数组?: 否 (Non-mutating)
- filter() ：筛选数组，创建新数组，一个新的、长度不定的数组，改变原数组?: 否 (Non-mutating)
- reduce() ：汇总/累加数组元素 ，返回单个汇总值 (The "Reducer")，改变原数组?: 否 (Non-mutating)
注意initialValue对空数组的影响
arr.reduce(callback,initialValue)
callback(accumulator, currentValue, currentIndex, array), 其中：
accumulator 累加器，初始值为 initialValue
currentValue 当前元素
currentIndex 当前元素的索引值
array 原始数组

const array = [1, 2, 3, 4];
const initialValue = 0;
const sum = array.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue
);
console.log(sum); // 输出：10

- splice(start, deleteCount, ...itemsToInsert)： 原地修改数组 (增 / 删 / 改)，返回值: 被删除元素的数组，改变原数组?: 是 (Mutator Method) 
1. 增：
const months = ['Jan', 'March', 'April', 'June'];
// 在索引 1 的位置，删除 0 个元素，插入 'Feb'
months.splice(1, 0, 'Feb');
console.log(months); // 输出：["Jan", "Feb", "March", "April", "June"]
2. 删：
// 假设数组为：["Jan", "Feb", "March", "April", "June"]
// 从索引 3 的位置，删除 1 个元素
const removedItem = months.splice(3, 1);
console.log(months);      // 输出：["Jan", "Feb", "March", "June"]
console.log(removedItem); // 输出：["April"]

# map vs forEach
- map():会返回一个新的数组，用于数据转换，可以链式调用arr.map(...).filter(...)
- forEach():返回 undefined，用于无返回值的操作，不能链式调用

# slice vs splice
- slice(start, end)：返回一个新的数组，不改变原数组(切片，返回数组的浅拷贝片段，不会改变原数组)
- splice(start, deleteCount, ...itemsToInsert)：原地修改数组，返回被删除元素的数组（会改变原数组）

# 遍历
- for in ：遍历对象的可枚举属性，包括原型链上的属性，hasOwnProperty() 可以过滤掉原型链上的属性, 但是不能遍历 Symbol 类型的属性
- Object.keys() ：返回对象的所有可枚举的字符串属性名，不包括原型链上的属性
- Object.getOwnPropertyNames() ：返回对象的所有属性名，包括原型链上的属性
- Object.getOwnPropertySymbols() ：返回对象的所有 Symbol 类型的属性名，包括原型链上的属性
- Reflect.ownKeys() ：返回对象的所有属性名，包括原型链上的属性

# 谈谈 js 中的类型转化机制
- 是什么 
显示类型转换：人为将一种类型转换成另一种类型 
隐式类型转换：js 引擎在执行运算或者判断语句时，将两种不同类型的值转为相同类型

- 特点

1. 显示类型的方法：

2. 隐式类型：四则运算，判断语句，if， while ==
- 场景

# 4. == 和 === 的区别？
- == 宽松相等：类型不同的时候会自动进行隐式类型转换，转换之后再比较值。
- === 严格相等：先比较类型，再比较值，不会自动进行隐式类型转换。

始终使用===，仅在需要判断是否是null和undefined 时使用 x==null。
其他情况时使用 ===。

特殊公民: NaN
- NaN (Not a Number) 不等于任何值，包括它自己
```
console.log(NaN == NaN);  // false
console.log(NaN === NaN); // false
```
- 正确检查方式：Number.isNaN()

