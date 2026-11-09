import math  # 数学常量和函数
import json  # JSON文件<-->Python对象
import os.path  # 路径操作模块
import zipfile  # 压缩文件模块

# print(math.pi)
# print(math.sqrt(9))
# print(math.floor(3.14))
# print(math.ceil(3.14))
# print(math.factorial(5))


# person = {'name': '郭老板', 'age': 18, 'sex': '男'}

# # print(json.dumps(person, ensure_ascii=False))  # python对象->json字符串
# text = json.dumps(person, ensure_ascii=False)
# print(json.loads(text))  # json字符串->python对象


# print(os.path.join('data', 'sub', 'demo.txt'))  # 拼接路径
# print(os.path.splitext('demo.txt'))  # 分离文件名和扩展名


with zipfile.ZipFile('data.zip', 'w') as zf:
    zf.write('a.txt')
    zf.write('sub/b.txt')


