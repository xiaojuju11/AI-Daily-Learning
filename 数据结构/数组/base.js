// var arr = [1, 2, '刘文铖',3]

// // console.log(arr[3]); //输出
// // arr.push('福福')//尾部增加
// // arr.pop()//尾部删除
// // arr.unshift('佳颖')//头部增加
// // arr.shift()//头部删除

// // arr.splice(2,1)//删除索引为2的元素
// arr.splice(2,0,'饶')//在索引为2的位置增加'饶'

// console.log(arr); 

var abc = [1, 2, 3, 4, 5]
// abc[0] = 10
//abc[1] = 20
//遍历||循环
for(var i=0;i<abc.length;i++){
    abc[i] = abc[i] *10
}
 console.log(abc);
