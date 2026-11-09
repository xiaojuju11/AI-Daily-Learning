name = '琪琪'
raw_score = "90,80,100"

# 1. 处理数据
scores = [int(x) for x in raw_score.split(',')]
average = sum(scores) / len(scores)
# print(scores)
# print(average)
line = f"{name}的成绩 {scores} 平均成绩 {average:.2f}"
# print(line)

with open('./report.txt', 'w', encoding='utf-8') as f:
  f.write(line)


# report.txt  琪琪的成绩 [90,80,100] 平均成绩 90.00


