
# s1 = {'hello', 'world'}
# print(type(s1), s1)


# print(set('hello'))
# print({x for x in range(1, 5)})


# print(len({'a', 'b', 'c'}))
# print('a' in {'a', 'b', 'c'})
# print({'a', 'b'} <= {'a', 'b'})
# print({'a'} < {'a', 'b'})


# s2 = {1, 2, 3}
# s2.add(4)
# # s2.remove(1)

# # s2.pop()
# s2.clear()
# print(s2)


s1 = {1, 2, 3}
s2 = {3, 4, 5}

print('并集：', s1 | s2)
print('交集：', s1 & s2)
print('差集：', s2 - s1)
print('对称差：', s1 ^ s2)


del s1
print(s1)