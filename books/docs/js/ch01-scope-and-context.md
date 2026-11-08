---
title: 第 1 章 执行上下文与作用域
order: 1
date: 2026-11-08
---

# 第 1 章 执行上下文与作用域

> 变量在哪儿能被看见、为什么能被看见——这一章把"作用域"从背下来的概念变成可以逐步推演的过程。

## 为什么需要它

面试问"这段代码输出什么"，你凭感觉答对了，但换个写法又不对。原因不是记性差，是缺一套**按步骤推演**的方法。

执行上下文就是这套方法：它规定了一段代码运行之前，引擎要先准备好哪些东西，准备顺序是什么。

## 三个上下文，两种阶段

JavaScript 运行时可粗分为三种执行上下文：

| 类型 | 什么时候创建 | 里面有什么 |
| --- | --- | --- |
| 全局上下文 | 脚本加载时，仅一次 | 全局对象、`this`、全局变量 |
| 函数上下文 | 每次调用函数时 | 参数、`arguments`、局部变量、`this` |
| 块级上下文 | 进入 `{}` 且含 `let`/`const`/`class` | 块内声明 |

每个上下文都要走两个阶段，**顺序不能反**：

1. **创建阶段**：扫描声明，把变量名先登记进去（这就是"提升"的来源）。
2. **执行阶段**：逐行执行，真正赋值。

## 用创建阶段解释提升

```js
console.log(a) // undefined，不是报错
var a = 1
console.log(b) // 抛 ReferenceError
let b = 2
```

逐步推演：

- 创建阶段扫描到 `var a`，在上下文里登记 `a = undefined`；
- 扫描到 `let b`，登记 `b` 但标记为**未初始化**（暂时性死区）；
- 执行阶段第一行读 `a`，已登记，得到 `undefined`；
- 第三行读 `b`，已登记但未初始化，抛 `ReferenceError`。

`var` 和 `let` 的差别不是"提升不提升"，而是**提升之后能不能读**。

::: tip 一句话记法
`var` 提升 + 初始化为 `undefined`；`let`/`const` 提升 + 不初始化。所以前者读得到 `undefined`，后者读就报错。
:::

## 作用域链是静态的

作用域链在**函数定义时**就确定了，跟调用位置无关。这解释了下面这个经典对比：

```js
const x = 'global'

function outer() {
  const x = 'outer'
  function inner() {
    console.log(x) // 找定义处，不找调用处
  }
  return inner
}

const fn = outer()
fn() // 'outer'
```

`inner` 的作用域链是 `inner → outer → global`，在 `outer` 里被定义时已经写好。之后无论谁在哪调用 `fn`，这条链都不变。

> 这就是"词法作用域"：看代码写在哪儿，不看运行时从哪儿进来。

## 常见坑

::: warning 循环里的 var
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)) // 3 3 3
}
```
`var` 只有一份，三个回调共用同一个 `i`。换成 `let` 会为每次迭代创建新的块级绑定，输出 `0 1 2`。
:::

::: warning 函数声明 vs 函数表达式
```js
foo() // 正常，函数声明整体提升
function foo() {}

bar() // TypeError: bar is not a function
var bar = function () {}
```
`var bar` 提升的是 `undefined`，不是函数体。
:::

## 自测三问

1. `let` 声明的变量在创建阶段处于什么状态？为什么读它会报错而不是 `undefined`？
2. 作用域链在什么时候确定？用一句话说明它和调用栈的区别。
3. 把 `for (var i ...)` 改成 `let` 后，为什么三个回调拿到的值不一样了？
