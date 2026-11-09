# def address_book(name, *telphone, alias_name=None, **abc):
#   print(f"姓名：{name}， 手机号：{telphone}， 别名：{alias_name}， 其他信息：{abc}")

# address_book('琪琪', 123, 456, 789, alias_name='小琪', email='123@qq.com')



def foo():
  """ 这是一个函数 """
  print("hello world")

foo()
# print(foo.__doc__)  # 函数内的注释是可以被访问到
# print(foo.__name__)  # 函数的名称
# print(foo.__code__)  # 函数的代码对象
print(dir(foo))
