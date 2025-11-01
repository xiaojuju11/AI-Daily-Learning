var num = [2,7,11,15]
var target = 9
//时间复杂度O(n)
//空间复杂度O(n)

var twoSum =function(arr,res){
    var diffs ={}
    var len = arr.length

    for(var i =0;i<len;i++){
        //res -arr[i]
        //去对象中查找，是否存在key为res -arr[i]，值有效
        //如果读得到，找到结果
        if(diffs[res-arr[i]] !== undefined){
            return [diffs[res-arr[i]],i]
        }
        //如果读不到,将arr[i]作为key，i作为value，存储到对象中
        diffs[arr[i]]
    }
}

twoSum(num,target)