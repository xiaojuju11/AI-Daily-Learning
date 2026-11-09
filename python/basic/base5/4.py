# 将文本变成 数字 （编码）（GBK, UTF-8）
# windows 下默认是 GBK 编码
# linux, mac 下默认是 UTF-8 编码

# text_cn = "你好"
# data = text_cn.encode('gbk')
# open('./demoGBK.txt', 'wb').write(data)


with open('./demoGBK.txt', 'r', encoding='GBK') as f:
  print(f.read())