# 1. 数组中常用的方法有哪些
1. 增 push unshift splice concat fill
2. 删 pop shift slice filter
3. 改 copyWithin
4. 查 find findIndex indexof indexof includes findLastIndex findLast
5. 排序 sort reverse toReversed
6. 转换 toString
7. 迭代 map forEach reduce some
# 2. 字符串中常用的方法有哪些
1. 增 concat
2. 删 slice
3. 改 trim trimRight trimLeft toLowerCase toUpperCase padStart padEnd repeat replaceAll replace
4. 查 indexof includes startsWith endsWith charAt match search
5. 转换 split
# 3. 谈谈 js 中的类型转化机制
- 是什么 显示类型转换：人为将一种类型转换成另一种类型 隐式类型转换：js 引擎在执行运算或者判断语句时，将两种不同类型的值转为相同类型

- 特点

1. 显示类型的方法：
2. 隐式类型：四则运算，判断语句，if， while ==
- 场景
# 4. == 和 === 的区别？


# 5. 聊一聊 js 中的拷贝
- 是什么

1. 基础类型

2. 引用类型 （拷贝通常用在引用类型上）

3. 浅拷贝

4. 深拷贝

- 特点

1. 浅拷贝：只拷贝一层，内部的引用类型还是指向原来的内存地址
2. 深拷贝: 层层拷贝，内部的引用类型也会指向新的内存地址

   JSON.parse(JSON.stringify(obj)) 
   注意： 不能拷贝函数，不能拷贝 undefined，不能处理 symbol, bigint 类型

   structuredClone(obj) 
   注意： 不能处理 symbol, 函数

- 应用场景

# 6. 聊一聊 js 中的闭包
- 是什么
 根据作用域的查找规则，内部函数可以访问外部函数的变量 
 一个函数执行完毕后，它的上下文会被销毁 
 那么，当一个函数 A 内部存在一个函数 B，而函数 B 被拿到 A 的外部调用，那么 A 函数中被 B 访问的那些变量就不会被销毁，而是以一个集合的形式被保留在了调用栈中，这个集合就叫做闭包

- 特点

1. 内存泄漏
2. 定义私有变量，防止全局变量的污染
3. 延长变量的生命周期

- 应用场景

1. 模块化
2. 变量私有化

# 7. 说说你对 js 作用域的理解
- 是什么
1. 全局作用域
2. 函数作用域
3. 块级作用域
- 特点
1. 内部作用域可以访问外部作用域的变量
2. 外部作用域不能访问内部作用域的变量
- 应用场景

# 8. 聊聊 js 的原型
- 是什么

1. 函数有二义性，既可以作为函数调用，也可以作为构造函数调用
2. 函数上拥有 prototype 属性，被 new 调用时，会将原型对象上的属性和方法挂载到实例对象的隐式原型上，实例对象可以通过 __proto__ 访问到原型对象上的属性和方法

- 特点 
实例对象的隐式原型 === 构造函数的显示原型

- 应用场景 
当需要创建多个实例对象时，可以将公共属性和方法挂载到原型对象上，从而实现代码的复用

- Object.create(null)
创建一个空对象，没有原型

# 9. 说一下 js 中的继承
- 是什么 
让子类可以访问到父类的属性和方法

- 特点

1. 原型链继承 -- 子类之间共用了同一个原型对象，会相互影响
2. 构造函数继承 -- 子类可以继承到父类的属性，但是不能继承到父类原型上的属性
3. 组合继承
4. 寄生组合继承
5. class 继承
