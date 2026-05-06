const head = {
  val: 1,
  next: {
    val: 2,
    next: {
      val: 3,
      next: {
        val: 4,
        next: head.next
      }
    }
  }
}


var hasCycle = function(head) {
  let cur = head
  while(cur) {
    if (cur.flag) {
      return true
    }
    cur.flag = true
    cur = cur.next
  }
  return false
};