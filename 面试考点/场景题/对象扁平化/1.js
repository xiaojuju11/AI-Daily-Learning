//数组扁平化

let arr = [1, 2, [3, [4]]]

//方法一`Infinity`：不管嵌套多少层，全部摊平
// const flatArr = arr.flat(Infinity)
// console.log(flatArr);

//手搓
function flatten(arr){
    let res = []
    function dfs(target){
        for(let item of target){
            if(Array.isArray(item)){
                dfs(item)
            }else{
                res.push(item)
            }
        }
    }
    dfs(arr)
    return res
}
const flatArr = flatten(arr)
console.log(flatArr);
