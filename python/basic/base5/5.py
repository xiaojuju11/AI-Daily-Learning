

# f = open('./a.txt', mode='w', encoding='utf-8')
# n = f.write('hello')
# print("写入的字节数：", n)
# f.close()


# with open('./a.txt', mode='r', encoding='utf-8') as f:
  # print("第一行：", repr(f.readline()))
  # print("第二行：", repr(f.readline()))
  # print("第三行：", repr(f.readline()))
  # print(f.readlines())
  # print(enumerate(f.readlines()))  # {0: 'hello\n', 1: 'world\n', 2: 'python\n'}

  # for i, line in enumerate(f.readlines()):
  #   print(f"第{i+1}行：{repr(line)}")


with open('./a.txt', mode='a', encoding='utf-8') as f:
  f.write('你好')
