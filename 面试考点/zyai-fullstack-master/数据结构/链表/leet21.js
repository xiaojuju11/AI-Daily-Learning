var mergeTwoLists = function (list1, list2) {
  const head = new ListNode()  // {val: 0, next: {val: 1, next: {xxx}}}
  let cur = head

  while (list1 && list2) {
    if (list1.val <= list2.val) {
      cur.next = list1
      list1 = list1.next
    } else {
      cur.next = list2
      list2 = list2.next
    }

    cur = cur.next
  }

  cur.next = list1 == null ? list2 : list1

  return head.next
};