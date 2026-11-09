# 类属性 | 实例属性

class Coffee:
  # 类属性: 写在类的内部, 在方法之外 , 所有实例对象共享
    water = 200
    coffee = 1

    def add_water(self):
      # self.xxx 实例属性: 每个实例对象都有自己的属性, 互不干扰
        self.hot_water = 1

mocha = Coffee()
mocha2 = Coffee()
# print("mocha 的类型", type(mocha))
# print('mocha 是Coffee类的实例对象吗', isinstance(mocha, Coffee))
# print(mocha.coffee)

mocha.add_water()
print(mocha.hot_water)
print(mocha2.hot_water)

# print(Coffee.hot_water)
