import {create} from 'zustand'

const useCountStore = create((set) => ({
    //数据
    count: 0,
    age: 18,
    //修改数据的方法
    increase: () => set((state) => ({count: state.count + 1})),//用set 修改state中的值会带来视图的更新
    //减少
    decrease: (val) => {
        return set((state) => ({count: state.count - val}))
    }
}))
export default useCountStore