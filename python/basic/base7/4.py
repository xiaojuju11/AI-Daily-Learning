# class Klass:
#   @classmethod   # classmethod 会把实例方法转换为类方法，用类直接调用
#   def func(cls):
#     print("调用 classmethod ，cls = ", cls.__name__)
 
# # Klass.func()
# k = Klass()
# k.func()


# class Person:
#   @classmethod
#   def eat(cls):
#     print("我会吃")
#     # Person.run()
#     cls.run()

#   def run():
#     print("我会跑")

# # Person.eat()
# p = Person()
# p.eat()



# class Tool:
#   name = "工具"
#   @staticmethod  # 静态方法: 一个不需要类任何参数的方法，又想放进类中
#   def add(self, a, b):
#     print(self.name)  # x
#     return a + b

# # t = Tool()
# # print(t.add(1, 2))

# print(Tool.add(1, 2))




class Klass:
  @property
  def func(self):
    return 'hello'

obj = Klass()
print(obj.func)