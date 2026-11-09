list1 = [1, 2, 3]

def foo(lst):
  lst = lst.copy()
  lst.append(4)

print('调用前', list1)
foo(list1)
print('第一次调用后', list1)
foo(list1)
print('第二次调用后', list1)