# 元组

# color = ('r', 'g', 'b', 'g', 'b', 'b')
# print(type(color), color)

# print(tuple('red'))   # ('r', 'e', 'd')
# print(tuple(range(1, 4))) 
# print(tuple(['a', 'b', 'c']))


# s = (1, 3, 2, 3, 4, 5)
# print(1 in s)
# print(7 not in s)

# print((1, 2) + (3, 4))
# print((0,) * 3)
# print(s[0])
# print(s[1:4])
# print(s[1:4:2])
# print(len(s))
# print(min(s), max(s))
# print(s.index(3))


# 元组不可变
# color = ('r', 'g', 'b', 'g', 'b', 'b')

# color2 = color + ('m',)

# new_color = set(color2)

# print(new_color)


list_my = [1, 2, 2, 3]
# print([x for x in set(list)])
print(list(set(list_my)))