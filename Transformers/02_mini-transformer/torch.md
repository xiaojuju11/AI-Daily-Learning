# 1. PyTorch（torch）是什么？

> **一句话概括**：PyTorch 是 Meta（原 Facebook）开发的开源深度学习框架，是目前 AI 研究领域使用最广泛的框架。

---

## 核心身份：三个层面理解它

### 1. 作为**张量计算库**（类似 NumPy，但支持 GPU）

```python
# NumPy 只能在 CPU 上运行
import numpy as np
a = np.array([1, 2, 3])

# PyTorch 的 tensor 既支持 CPU 也支持 GPU
import torch
a = torch.tensor([1, 2, 3])          # CPU
a = torch.tensor([1, 2, 3]).cuda()   # GPU 加速！
```

> `torch` 本身就是一个**高性能张量（Tensor）库**，和 NumPy API 非常相似，但多了一个关键能力：**GPU 并行加速**。

---

### 2. 作为**自动微分引擎**（自动求导）

```python
x = torch.tensor(3.0, requires_grad=True)  # 告诉 PyTorch：追踪对 x 的计算
y = x ** 2 + 2 * x + 1                     # 前向计算
y.backward()                                # 自动反向传播（求梯度）
print(x.grad)  # 输出: tensor(8.)           # dy/dx = 2x + 2 = 8
```

> 这是深度学习的核心：神经网络训练需要**自动计算梯度**，PyTorch 用 `autograd` 机制自动完成这件事，不需要你手写求导公式。

---

### 3. 作为**深度学习框架**（构建神经网络）

```python
import torch.nn as nn

model = nn.TransformerEncoder(...)   # 直接调用现成的网络结构
loss = nn.CrossEntropyLoss()         # 损失函数
optimizer = torch.optim.Adam(...)    # 优化器
```

> `torch.nn` 提供了所有常见的神经网络层（Linear、Conv2d、LSTM、Transformer 等），让你像搭积木一样构建模型。

---

## 在典型项目中的角色

```python
import torch                # ① 提供 tensor（张量）数据结构
import torch.nn as nn       # ② 提供神经网络层（Embedding、Linear、LayerNorm 等）
import torch.nn.functional as F  # ③ 提供函数式 API（softmax、cross_entropy 等）
```

| 模块 | 用途 |
|------|------|
| `torch` | 张量创建、GPU 计算、自动求导 |
| `torch.nn` | 神经网络层的**类封装**（`nn.Linear(...)`） |
| `torch.nn.functional` | 神经网络层的**函数式调用**（`F.relu(x)`） |

---

## PyTorch vs 其他框架对比

| 特性 | PyTorch | TensorFlow |
|------|---------|------------|
| 开发者 | Meta（Facebook） | Google |
| 编程风格 | **动态图**（eager mode，像写 Python 一样） | 静态图（早期），2.0 后也支持动态图 |
| 研究热度 | ⭐ **主导地位**（>80% 论文用 PyTorch） | 工业部署较多 |
| 调试体验 | 直接 `print()`，用标准 Python 调试器 | 早期调试较难 |
| GPU 加速 | `.cuda()` / `.to(device)` | 类似 |

---

## 总结

```
torch ≈ NumPy（张量计算） + autograd（自动求导） + nn（神经网络）
         ↓                        ↓                      ↓
      GPU加速的数组          训练神经网络的前提        快速搭建模型
```

**一句话**：`torch` 是让你用 Python 语法方便地构建和训练神经网络，并能自动利用 GPU 加速计算的基础库。



# 代码解释 ------------------------------------------------

## 1. torch.nn.functional 是什么？
这是 PyTorch 中一个非常特殊的模块，它包含了大量神经网络中常用的函数，比如：

激活函数：F.relu()、F.sigmoid()、F.softmax()

卷积操作：F.conv2d()、F.conv3d()

池化操作：F.max_pool2d()、F.avg_pool2d()

归一化：F.batch_norm()

损失函数：F.cross_entropy()、F.mse_loss()

其他：F.dropout()、F.embedding() 等

- nn 是“网络层”的代名词（有参数的类）

- F 是“函数”的代名词（无参数的纯函数）


## 2. 这份代码中 chars = sorted(list(set(CORPUS))) ，set、list、sorted这几个方法是哪里来的
这几个都是 Python 的**内置函数（built-in functions）**，不需要导入任何模块就能直接使用。

---

## 2.1 三个内置函数详解

### 1. `set()` —— 集合构造函数
```python
set(CORPUS)  # 将字符串拆成字符集合，自动去重
# 例如：set("hello") → {'h', 'e', 'l', 'o'}


作用：创建一个无序、不重复的元素集合
来源：Python 内置类型，不需要 import
```

### 2. `list()` —— 列表构造函数
```python
list(some_set)  # 将集合转换为列表
# 例如：list({'h','e','l','o'}) → ['h','e','l','o']

作用：将可迭代对象（集合、元组、字符串等）转换为列表
来源：Python 内置类型，不需要 import
```

### 3. `sorted()` —— 排序函数
```python
sorted(list_of_chars)  # 返回排序后的新列表
# 例如：sorted(['h','e','l','o']) → ['e','h','l','o']


作用：对可迭代对象进行排序，返回新列表（原数据不变）
来源：Python 内置函数，不需要 import
特点：默认按字典序（字母顺序）排序
```

### 4. 完整执行流程示例
以 CORPUS = "hello" 为例：
```python
# 步骤拆解
step1 = set("hello")           # {'h','e','l','o'}  去重
step2 = list(step1)            # ['h','e','l','o']  转列表
step3 = sorted(step2)          # ['e','h','l','o']  排序

# 等价于一行
chars = sorted(list(set("hello")))  # ['e','h','l','o']
```   

### 5. 补充：其他内置函数也常见
在你的代码中，还有这些内置函数：

- len() —— 获取长度

- print() —— 打印输出

- enumerate() —— 获取索引和值（后面可能会用到）

- zip() —— 并行迭代（后面可能会用到）

这些都是 Python 的内置函数，不需要任何 import 语句。


## 3. char_to_idx， idx_to_char 这两个变量是干什么的？

这两行代码使用了 Python 的**字典推导式（Dictionary Comprehension）**和 `enumerate()` 函数，用于构建字符和索引之间的双向映射。

---

### 第一行：`char_to_idx = {ch: i for i, ch in enumerate(chars)}`

### 拆解执行步骤

假设 `chars = ['e', 'h', 'l', 'o']`（从 `"hello"` 排序去重后得到）

```python
# 步骤1: enumerate(chars) 生成索引-元素对
enumerate(['e', 'h', 'l', 'o'])  
# → (0, 'e'), (1, 'h'), (2, 'l'), (3, 'o')

# 步骤2: for i, ch in enumerate(chars) 遍历每一对
# i=0, ch='e'
# i=1, ch='h'
# i=2, ch='l'
# i=3, ch='o'

# 步骤3: {ch: i for i, ch in ...} 构建字典，键是字符，值是索引
# 最终结果：
char_to_idx = {'e': 0, 'h': 1, 'l': 2, 'o': 3}

```
### 第二行：`idx_to_char = {i: ch for ch, i in char_to_idx.items()}`
```python
# 步骤1: char_to_idx.items() 获取键值对视图
char_to_idx.items()  
# → dict_items([('e', 0), ('h', 1), ('l', 2), ('o', 3)])

# 步骤2: for ch, i in char_to_idx.items() 遍历每一对
# ch='e', i=0
# ch='h', i=1
# ch='l', i=2
# ch='o', i=3

# 步骤3: {i: ch for ch, i in ...} 构建字典，键是索引，值是字符
# 最终结果：
idx_to_char = {0: 'e', 1: 'h', 2: 'l', 3: 'o'}
```