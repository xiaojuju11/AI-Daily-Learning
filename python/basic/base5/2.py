# 1  %s=字符串  %d=整数  %f=浮点数
# print("%s is %s than %s" % ('张三', '18岁', '李四'))  # 就像 js中的解构赋值
# print("整数：%d, 浮点数：%f" % (100, 3.14))
# print("宽度5、保留1位小数，左边补零：[%050.1f]" % 3.14)
# print("宽度5、至少3位数字，左对齐：[%-5.3d]" % 123.456)


# 2 str.format()
# print("{} is {} than {}".format('张三', '18岁', '李四'))
# print("{1} is {2} than {0}".format('张三', '18岁', '李四'))

# 3 f-string
# name = '张三'
# age = 18
# print(f"{name} is {age} than old")


date = "2026-10-15 20:31:00"

dateList = date.split(' ')
date2 = dateList[0]
time = dateList[1]

date2List = date2.split('-')
timeList = time.split(':')

print(f"{date2List[0]}年{date2List[1]}月{date2List[2]}日 {timeList[0]}时{timeList[1]}分{timeList[2]}秒")
