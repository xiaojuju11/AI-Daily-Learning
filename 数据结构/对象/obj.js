var obj = {
    name: '张三',
    age: 18,
    sex: '男'
}
// console.log(obj.name);
// console.log(obj['name']);
// obj.boyFriend = '李四'//添加属性

var person = '王源'
// obj.person = '坤坤'
obj[person] = '易烊千玺'
console.log(obj);

var arr = [1,2,3,4,5]
for(var i=0;i<arr.length;i++){
    arr[i] = arr[i]+1
}
console.log(arr);
