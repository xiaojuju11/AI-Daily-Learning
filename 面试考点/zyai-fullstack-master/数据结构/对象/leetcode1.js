var nums = [2,7,11,15]
var target = 9

// 时间复杂度 O(n)
// 空间复杂度 O(n)

var twoSum = function(arr, res) {
  var diffs = {}
  var len = arr.length
  
  for (var i = 0; i < len; i++) {
    // res - arr[i] // diffs[7]  // 1
    // 去对象中查找，是否存在key 为res - arr[i]，值有效
    // 如果都得到，找到结果
    if (diffs[res - arr[i]] !== undefined) {
      return [diffs[res - arr[i]], i]
    }
    // 如果读不到
    diffs[arr[i]] = i
  }
}

twoSum(nums, target)