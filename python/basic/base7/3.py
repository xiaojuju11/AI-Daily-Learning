# # 继承

# # 父类
# class Father:
#   def run(self):
#     print("我是父类")

# class Son(Father):
#   def run(self):
#     super().run()  # 调用父类的方法
#     print("我是子类")

# s = Son()
# # s.run()
# print(Son.__mro__)  # 继承顺序的列表



class CookMixin:
  def cook(self):
    print("会做饭")
  def sleep(self):
    print("会睡觉")

class DriverMixin:
  def drive(self):
    print("会开车")
  def sleep(self):
    print("会睡觉2")


class Person(DriverMixin, CookMixin):
  def __init__(self, name):
    self.name = name

  def hello(self):
    print(f"你好，我是{self.name}")
    # super().cook()

p = Person('郭老板')
# p.hello()
# p.cook()
# p.drive()
p.sleep()
print(Person.__mro__)
