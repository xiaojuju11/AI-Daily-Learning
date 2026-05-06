let str = 'aba'

var validPalindrome = function (s) {
  const len = s.length
  let i = 0
  let j = len - 1

  while (i < j) {
    if (s[i] == s[j]) {
      i++
      j--
    } else {
      if (isPalindrome(i + 1, j)) {
        return true
      }
      if (isPalindrome(i, j - 1)) {
        return true
      }

      return false
    }
  }

  function isPalindrome(l, r) {
    while (l < r) {
      if (s[l] == s[r]) {
        l++
        r--
      } else {
        return false
      }
    }
    return true
  }

  return true
};

