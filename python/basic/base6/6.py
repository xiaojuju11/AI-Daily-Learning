# 高阶函数 （把函数作为参数）
""" 
map 函数
filter 函数
reduce 函数
"""

# def foo():
#   print("foo函数被执行")

# var = foo
# print(type(var))


from functools import reduce


def add(number):
  return number + number

# print(list(map(add, range(5))))

# print(list(map(lambda x: x + x, range(5))))

# for i in map(add, range(5)):
#   print(i)

# print(list(filter(lambda x: x > 0, range(5))))

# print(reduce(lambda x, y: x + y, [1, 2, 3, 4, 5]))