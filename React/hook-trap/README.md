# hooks
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