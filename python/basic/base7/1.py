# # 面向过程编程
# # print("============ 面向过程编程 =============")

# # def make_coffee():
# #     """ 制作咖啡: 先加xxx 再加yyy, 然后xxx, 按照时间顺序进行 """
# #     water = 200
# #     print(f"1. 加入{water}ml水")
# #     coffee = 1
# #     print(f"2. 加入{coffee}份咖啡")
# #     print(f"3. 美式咖啡制作完成")

# # make_coffee()





# # 面向对象编程
# print("============ 面向对象编程 =============")

# class Coffee:
#     """ 一杯咖啡：数据（水和咖啡液）和 动作（制作）封装在一起 """
#     def __init__(self, water, coffee):
#         # print(self)
#         self.water = water
#         self.coffee = coffee

#     def make(self):
#         if self.water:
#             print(f"1. 加入{self.water}ml水")
#         if self.coffee:
#             print(f"2. 加入{self.coffee}份咖啡")
#         print(f"3. 美式咖啡制作完成")


# americano = Coffee(200, 1)

# americano2 = Coffee(200, 1)

# print(americano == americano2)



# num = 100
# num2 = num
# print(num2 == num)


# list1 = [1, 2, 3]
# list2 = [1, 2, 3]
# list1.append(4)
# print(list2 == list1)

# obj1 = {"name": "张三", "age": 18}
# obj2 = {"name": "张三", "age": 18}
# print(obj2 == obj1)
