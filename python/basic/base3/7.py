# 字典

# a = {'one': 1, "two": 2}
# b = dict(one=1, two=2)
# c = {x: x ** 2 for x in range(10)}

# # print({1: 'one', 1.0: 'two'})

# del a['two']
# print(a)


mail_list = {'tom': 'tom@gmail.com', 'jerry': 'jerry@foxmail.com', 'john': 'john@163.com'}

# print(mail_list.keys())
# print(mail_list.values())
# print(mail_list.items())

# print(mail_list['nobody'])
# print(mail_list.get('nobody'))

# for key in mail_list:
#   print(key, mail_list.get(key))

# for key, value in mail_list.items():
#   print(key, value)

mail_list['mack'] = 'abc@gmail.com'
# print(len(mail_list))

# print('tom' in mail_list)


# del mail_list['tom']

# res = mail_list.pop('tom')
# print(res, mail_list)

print(mail_list.popitem())