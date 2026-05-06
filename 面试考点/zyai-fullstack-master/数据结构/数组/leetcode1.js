var nums = [2, 11, 15, 7]
var target = 9

var twoSum = function (arr, res) {
  // 左手握的值
  for (var i = 0; i < arr.length; i++) {  // arr[0]
    var left = arr[i]
    // 右手握的值,从左右的下一位开始
    for (var j = i + 1; j < arr.length; j++) {
      var right = arr[j]
      // 判断是不是目标值
      if (left + right == res) {
        return [i, j]   // return 会终止代码的执行
      }

    }
  }
};

console.log(twoSum(nums, target)); // [0, 3]


// 时间复杂度 O(n)^2