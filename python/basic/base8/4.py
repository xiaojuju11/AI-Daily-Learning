import numpy as np

# print(np.__version__)

# arr = np.array([1, 2, 3, 4, 5])  # np.array() 创建一个 numpy 数组对象
# print(arr)
# print('平均值：', arr.mean())
# print('每个元素的平方：', arr**2)


import importlib.metadata as md
print('numpy 包名：', md.distribution('numpy').metadata['Name'])
print('numpy 包版本：', md.version('numpy'))
