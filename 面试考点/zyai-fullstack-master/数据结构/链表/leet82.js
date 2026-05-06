const head = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 3,
        next: {
          val: 4,
          next: {
            val: 4,
            next: {
              val: 5,
              next: null
            }
          }
        }
      }
    }
  }
}

var deleteDuplicates = function (head) {
  if (!head || !head.next) {
    return head
  }

  let dummy = new ListNode()  // {val: 0, next: null}
  dummy.next = head

  let cur = dummy 
  while (cur.next && cur.next.next) {
    if (cur.next.val === cur.next.next.val) {
      let val = cur.next.val  // 记录重复的那个值

      while (cur.next && cur.next.val === val) { // 继续取后面的值
        cur.next = cur.next.next
      }
    } else {
      cur = cur.next
    }
  }

  return dummy.next
};