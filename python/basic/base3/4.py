# list 增删改查 排序

list_demo = ['a', 'b', 'c', 'd', 'e', ['f', 'g']]

# 增
# list_demo.insert(0, 'first')
# list_demo.insert(-1, 'last')

# list_demo.append('end')
# list_demo.extend('one')

# list_demo.remove('b')
# print(list_demo)


# res = list_demo.pop(1)
# print(res, list_demo)


# nums = [1, 2, 3]
# # nums.reverse()
# # nums.clear()
# print(len(nums))


data = [1, 3, 2, 4, 2]
# sort_data = sorted(data)
# print(sort_data, data)

data.sort(reverse=True)
print(data.count(3))