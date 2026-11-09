# 文件合并
# f = open('./demo.txt', 'r', encoding='utf-8')
# print(f.read())

# with open('./demo.txt', 'r', encoding='utf-8') as f1:
#   data1 = f1.read()
# with open('./a.txt', 'r', encoding='utf-8') as f2:
#   data2 = f2.read()

# with open('./merge.txt', 'w', encoding='utf-8') as out:
#   out.write(data1 + data2)



files_name = ['./demo.txt', './a.txt', './b.txt']
files_data = []

for flie_name in files_name:
  with open(flie_name, 'r', encoding='utf-8') as f:
    files_data.append(f.read())

with open('./merge.txt', 'w', encoding='utf-8') as out:
  for data in files_data:
    out.write(data)