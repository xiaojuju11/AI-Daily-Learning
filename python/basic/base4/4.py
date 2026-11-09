
# num = 10
# while num >= 1:
#   print(f"当前值是{num}")
#   num -= 1
#   if num < 5:
#     break

# print(num)


# list = [1, 2, 3, 4, 5]
# while list:
#   print(list.pop(2))
#   print(list)


# 将数组做好冒泡升序排序，不能使用sort方法

list = [2, 5, 3, 7, 9, 4, 6, 8]

i = 0
j = 0
for x in list:
  i += 1
  j = 0
  for y in list:
    if j < len(list) - 1:
      if list[j] > list[j + 1]:
        [list[j], list[j + 1]] = [list[j + 1], list[j]]
    j += 1

print(list)
    


# for i in range(len(list)):
#   for j in range(len(list) - 1 - i):
#     if list[j] > list[j + 1]:
#       [list[j], list[j + 1]] = [list[j + 1], list[j]]

# print(list)




