# 1:函数组件和类组件的差别
- 函数组件：没有状态，没有生命周期，没有 this，编译完后代码体积更小。
- 类组件：有状态，有生命周期，有 this，需要手动绑定this指向。

函数组件是函数，类组件是类；
函数组件用 Hooks 管理状态和副作用，类组件用 state 和生命周期；
函数组件没有 this，写法更简洁；
现在 React 主推函数组件 + Hooks，类组件逐渐被淘汰。
# 2:讲一下生命周期和类组件生命周期
// 相当于 componentDidMount
useEffect(() => {
  // 加载请求
}, [])

// 相当于 componentDidUpdate
useEffect(() => {
  // count 变化时执行
}, [count])

// 相当于 componentWillUnmount
useEffect(() => {
  return () => {
    // 清理
  }
}, [])
shouldComponentUpdate 用于判断是否需要更新组件，返回值为 true 时会执行 render 方法，否则不会执行 render 方法。

// 相当于 shouldComponentUpdate
useEffect(() => {
  // count 变化时执行
}, [count])

// 相当于 componentWillUnmount
useEffect(() => {
  return () => {
    // 清理
  }
}, [])
# 3:常用的 hooks 有哪些，说一下 usememo memo usecallback \
- useRef:
1. 获取一个Dom结构
2. 保存一个值，组件更新后值不会改变

- useRef和useState的区别：
useRef 用于获取一个Dom结构或保存一个值，值变更不会触发组件重新渲染。
useState 用于变更会触发组件重新渲染。

1. useState() 可以接受一个值，也可以接受一个函数，函数中只能执行同步的代码，不支持异步
setNum 可以接受一个值，也可以接受一个函数

2. useEffect() 
useEffect(() => {}) 会在组件初次加载和每次重新渲染时触发
useEffect(() => {}, []) 只在组件初次加载时触发
useEffect(() => {}, [x]) 初次加载，和 x 值变更时触发
useEffect 中返回一个函数，该函数会在组件卸载前触发


3. const [count, dispatch] = useReducer(reducer, 0)
返回一个初始0，和一个函数体dispatch
dispatch每次调用就会导致传入的 reducer 函数触发


4. useLayoutEffect(callback)
  让callback可以在页面渲染的过程中空插缝执行，和useEffect 的区别是，内部callback任务同步执行的

5. useReducer(reducer, {result: 0})
- 将复杂的逻辑运算全部封装在了 reducer 函数中， 使用时只需要 dispatch 一个 action，使用简洁
- reducer 中修改state 的值必须返回一些新的对象，不能直接修改原对象，否则无法触发重新渲染

6. useRef
- 获取 dom
- 创建一个变量，变量值更新不带来组件重新渲染，组件重新渲染不会重置这个变更量


7. useMemo
- memo 函数缓存组件，只有组件的 props 值变更才会重新加载
- useMemo(() => {return count * Math.random()}, []) 缓存一个计算结果，当数组为空时，哪怕组件重新加载，useMemo内的计算也不会再次执行



8. useCallback(() => {}, [])
每次组件重新加载，都返回第一次的那个函数体，只有当数组中的值变更才会重新创建新的函数

缓存组件 → memo
缓存计算 → useMemo
缓存函数 → useCallback
# 4:用 usestate 有没有碰到啥问题，值没有改的情况


使用 useState 确实遇到过值不更新的情况，主要有：
直接修改对象或数组，没有返回新引用，导致 React 浅比较认为没变化。
在异步逻辑、定时器或事件回调中，捕获了旧的 state 闭包，获取不到最新值。
依赖项未正确声明，导致 useEffect 或其他钩子使用了过时状态。
误用 setState，没有使用函数式更新（prev => ...）。
解决方法一般是：
对象 / 数组使用展开语法生成新引用
使用函数式更新
正确管理依赖
避免直接修改原数据
# 5:你知道 link 算法吗
# 6:react 中的 key 是什么
key 是在循环生成 DOM 结构时需打的唯一标识，作用是帮助 react 在虚拟 DOM 对比时区分新增、可复用和需移除的元素，避免不必要的 DOM 操作。

# 7:函数组件调接口在哪里调
- 在 useEffect 中调用接口
- 类组件在 componentDidMount 中调用接口
# 8:你知道 hooks 的使用规则吗
- 只能在函数组件中使用，不能在类组件中使用。
- 只能在函数组件的顶层作用域调用，不能在循环、条件语句中调用。
- 不能放条件语句原因：React 中 Hooks 调用有正确顺序且关联状态变量，若将 useState 等调用放在 if 条件语句里，因 if 条件可能为 true 或 false，会干扰 React 理解组件中 Hooks 调用顺序，打乱调用顺序

# 9:组件化是什么
- 组件化是指将一个应用拆分成多个组件，提高开发效率，一般用在：
1. 当某一块逻辑复用性很高时，会将其抽离出来做成组件，如不同页面下相同的逻辑部分。
2. 当某一块功能有独立的特性或状态时可封装成组件，例如网站中列表项有独立的点击事件、样式，且有独立变量控制选中高亮状态。
优点：
1. 降低代码的冗余
2. 代码更容易维护
3. 组件可以独立测试
4. 减少团队开发的冲突

# 10:组件之间的通信要怎么写
- 父向子组件通信：通过 props 传递数据给子组件。
- 子向父组件通信：通过回调函数将数据传递给父组件。2种
- createContext：创建一个上下文，用于在组件之间共享数据。
- zustand：一个状态管理库，用于在组件之间共享状态。
npm i zustand
zustand 的工作原理：
1. 创建一个仓库，仓库中存放公共的状态和修改状态的函数
2. 仓库以一个hook函数的形式往外暴露
3. 组件A,B引入仓库，调用仓库的hook函数，获取公共的状态和修改状态的函数
4. 当组件A调用修改状态的函数时，仓库会调用set函数，更新状态
5. 组件B 会自动收到状态的更新，重新渲染

- 父向子通信：
传递方式：父组件直接在子组件标签上绑值，子组件通过 props 参数接收。
数据特性：子组件接收到的父组件传递的值是只读的，不能修改，遵循 React 单向数据流设计理念，若子组件能修改，会破坏单向数据流，导致父组件感应变化并二次更新。
- 子向父通信：
回调函数方式：子组件调用父组件传递的函数，并传递数据作为参数，父组件在函数中接收数据并重新渲染页面。
REF 方式：父组件使用 useRef 创建变量标记子组件，通过 REF 拿到子组件结构，但子组件需配合，使用 forwardRef 包裹子组件函数体，并使用 useImperativeHandle 钩子暴露内部变量，父组件才能获取子组件内的变量。
- 兄弟组件通信（跨层级）：
上下文对象方式：在最根部的组件（爷爷组件）使用 createContext 创建上下文对象，用 context.provider 提供数据，子组件通过 useContext 使用该上下文对象获取数据。若要实现兄弟组件间数据传递，可在一方组件中修改上下文对象中的值，另一方组件会同步更新，但需在爷爷组件提供响应式变量及修改方法。
- 状态管理仓库（Zustand）方式：先安装 Zustand 库，在项目中创建仓库，使用 create 方法创建仓库，定义响应式变量和修改函数。组件引入仓库，调用仓库的 hook 函数获取状态和修改函数，修改状态时仓库会更新，相关组件会自动重新渲染。其工作原理为创建仓库存放公共状态和修改函数，以 hook 函数形式暴露，组件引入调用获取状态和函数，修改状态时仓库更新，关联组件同步更新。

# 111:CSS models 是什么有什么作用 /样式隔离是怎么做的
- 在 React 的项目组件当中，把 CSS 定义成一个模块文件，为了做样式隔离，防止组件之间的样式相互冲突。

- CSS 模块化实现：
文件命名改变：将 CSS 文件命名为.child1.module.css，表明这是一个模块化的 CSS 文件。
引入方式变化：引入模块化 CSS 文件时，它被视为一个对象，通过 styles.title 来获取类名。
样式隔离效果：使用模块化 CSS 文件后，CHART2 组件不受 CHART1 组件样式的影响，实现了样式隔离。

# 12:css 选择器优先级，important 一般用在什么地方
important > 行内样式 > id选择器 > 类选择器 > 标签选择器 > 通配符选择器（*）

# 13:ui 组件库拿过来用怎么改样式
1. 用 :global 选择器
2. 用 !important 优先级

# 14:怎么遍历对象
- for...in 循环：遍历对象的所有属性，包括继承的属性。
- for...of 循环：遍历对象的所有可迭代属性，如数组、字符串、Set、Map 等。
- forEach 方法：遍历数组的所有元素，执行指定的回调函数。
- map 方法：遍历数组的所有元素，返回一个新的数组，每个元素都是回调函数的返回值。
- reduce 方法：遍历数组的所有元素，返回一个累计值，累计值是每次回调函数的返回值。

1. const obj = {
    age: 20,
    sex: '男'
}
for (const key in obj) {
    console.log(key, obj[key]);
}
2. Object.keys(obj).forEach(key => {
    console.log(key, obj[key]);
})//先拿到key存成数组，再遍历数组
3. Object.entries(obj).forEach(([key, value]) => {
    console.log(key, value);
})//先拿到key和value存成数组(二维数组)，再遍历数组
4. Reflect.ownKeys(obj).forEach(key => {
    console.log(key, obj[key]);
})//先拿到key存成数组，再遍历数组
# 15:数组的方法有哪些
1. 增
push：尾部添加 → 改原数组，返回新长度
unshift：头部添加 → 改原数组，返回新长度
splice：指定位置添加 → 改原数组
concat：拼接数组 → 不改原数组，返回新数组
fill：填充值 → 改原数组
2. 删
pop：删除尾部 → 改原数组，返回被删元素
shift：删除头部 → 改原数组，返回被删元素
slice：截取一段 → 不改原数组，返回新数组
filter：过滤删除 → 不改原数组，返回新数组
3. 改
copyWithin：内部复制覆盖 → 改原数组
splice：替换元素 → 改原数组
4. 查
indexOf：从前找索引，找不到 -1
lastIndexOf：从后找索引
includes：是否包含 → true/false
find：找第一个符合元素
findIndex：找第一个符合索引
findLast：找最后一个符合元素
findLastIndex：找最后一个符合索引
5. 排序 / 反转
sort：排序 → 改原数组
reverse：反转 → 改原数组
toReversed：反转 → 不改原数组，返回新数组
6. 转换
toString：转逗号分隔字符串
7. 迭代
forEach：遍历，无返回值
map：映射 → 返回新数组
reduce：累计汇总
some：一个满足就 true
every：全部满足才 true
# 16:合并数组用什么方法 
1. concat()
2. 解构 
let newArr = [...arr1, ...arr2, ...arr3]
arr1.push(...arr2)

# 17:local storage 和 session storage 有什么区别  
- local storage：本地存储，持久化存储，关闭浏览器后数据不丢失；二级域名共享。
二级域名：支持子域名共享（如 a.xxx.com 和 b.xxx.com 可互通）
- session storage：会话存储，关闭浏览器后数据丢失；二级域名不共享。
- cookie：存活时间：由后端代码控制，人为设置多久就是多久。
- indexedDB 特点：
存储空间：作为客户端数据库，其内存空间大小取决于电脑硬盘大小，可认为无限大。
有效时长：存储时效性跟 localStorage 一样，永久生效，除非人为清除。

# 18:解释一下 css 中的相对单位
1. em：相对单位，相对于父元素的字体大小。
2. px：绝对单位，像素。
3. rem：相对单位，相对于根元素（html）的字体大小。
4. vw：相对单位，相对于视口宽度的百分比。
5. vh：相对单位，相对于视口高度的百分比。

# 19: calc 是干什么用的
calc 函数：用于计算长度、角度、百分比等值。
父容器宽度分配：可以用父容器的宽度减掉一定宽度，将剩余宽度交给某一个子容器用于计算

# 平时用上面AI（Cursor/Claude/Codex），然后分享一下它怎么提高前端的开发效率
常用工具：建议提及使用较多的是 Cursor，也会和国内的Trae工具混着用，感受不同。
提高效率例子：
代码生成：在项目开发中，如登录注册页面的 CSS 动画、表单提交功能代码、跨域代理配置代码等，可通过写详细提示词让 AI 生成。
工具函数封装：对于图片压缩功能，可让 AI 快速封装专门实现图片压缩的函数。
代码测试：功能开发完后，可让 AI 从不同角度测试代码，如登录注册功能，让 AI 测试不同账号、密码输入情况，查找代码中可能存在的 bug。