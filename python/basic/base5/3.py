# 打开文件 open(文件名，mode， encoding)
# mode 模式  r 读取  w 写入  a 追加  b 二进制模式  + 读写模式

# f = open('./demo.txt', '+w', encoding='utf-8')
# print("文件对象：", f)
# print("是否可读：", f.readable(), '是否可写：', f.writable())

# f = open('./demo.txt', 'r', encoding='utf-8')
# # 一次性读成列表
# data = f.readlines()
# print("读取到的每一行数：", data)

# f.close()  # 关闭文件

import os

# print("当前工作目录：", os.getcwd())
# print("当前工作目录下的所有文件：", os.listdir())
# print("当前工作目录下的所有文件：", os.system('ls -a'))

