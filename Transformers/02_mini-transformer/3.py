import torch
import torch.nn as nn
import torch.nn.functional as F
import math

VOCAB_SIZE = 17  # 词汇表大小
CONTEXT_LEN = 8  # 上下文长度: 模型每次能看到多少字符
D_MODEL = 64  # 模型维度(向量宽度)
D_FF = 128  # 前馈网络维度
N_HEADS = 8  # 多头注意力头数
N_LAYERS = 2  # Transformer Block 堆叠的层数
DROPOUT = 0.1  # Dropout 率
LEARNING_RATE = 3e-3  # 学习率: 控制模型参数更新的速度  0.003

# ====================== 
# 数据准备

# 1.1 定义语料库
CORPUS = "hello world, how are you today? hello again!"  # 极小的训练语料

# 1.2 构建词汇表
chars = sorted(set(CORPUS))  # 去重并排序 
# set("hello") => {'h', 'e', 'l', 'o'}
# sorted({'h', 'e', 'l', 'o'}) ==> ['e', 'h', 'l', 'o']

# 构建双向映射字典 （字符 <-> 索引）
stoi = {c: i for i, c in enumerate(chars)}
# {'': 0, 'a': 1, 'd': 2}
itos = {i: c for i, c in enumerate(chars)}
# {0: '', 1: 'a', 2: 'd'}

VOCAB_SIZE = len(chars)

print(f"词汇表大小: {VOCAB_SIZE}")
print(f"语料长度: {len(CORPUS)}")

# ===============
# 构建训练样本
def make_data(text,ctx_len):
    xs,ys = [],[]  # xs: 输入序列， ys: 目标序列
    for i in range(len(text) - ctx_len):
        xs.append([stoi[c] for c in text[i : i + ctx_len]])  # “hello wo”
        ys.append(stoi[text[i + ctx_len]])  # “r”

    return torch.tensor(xs), torch.tensor(ys)

X,Y = make_data(CORPUS,CONTEXT_LEN)
print(f"训练样本数：{len(X)}")
print(f"\输入的形状：{X.shape}，目标的形状：{Y.shape}") #（100,8）（100,1）
print(f"示例-输入：{CORPUS[:8]},预测：{CORPUS[8]}")

# ===============
# 位置编码
class PositionalEncoding(nn.Module):
    """
    位置编码模块
    使用正弦和余弦函数生成位置信息，加到输入嵌入上
    """

    def __init__(self, d_model, max_len=50):
        """
        参数:
            d_model: 模型维度
            max_len: 最大序列长度（预计算，节省运行时开销）
        """
        super().__init__()
        # super().__init__() 调用父类 nn.Module 的构造函数
        # 这是 Python 继承的标准写法，确保父类被正确初始化

        pe = torch.zeros(max_len, d_model)
        # 创建零矩阵 (max_len, d_model)，用于存放位置编码
        # 例如 max_len=50, d_model=64 → 形状 (50, 64)

        pos = torch.arange(max_len).unsqueeze(1).float()
        # ========== 语法拆解 ==========
        # 步骤1: torch.arange(max_len) 生成 [0, 1, 2, ..., 49]，形状 (50,)
        # 步骤2: .unsqueeze(1) 在第1维插入一个维度，形状变为 (50, 1)
        #   unsqueeze 的作用：将一维向量变成"列向量"，方便后续广播运算
        #   例如: tensor([0,1,2]) → tensor([[0],[1],[2]])
        # 步骤3: .float() 转为浮点数类型（arange 默认生成整数）

        div = torch.exp(
            torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model)
        )
        # ========== 语法拆解 ==========
        # 步骤1: torch.arange(0, d_model, 2) 生成 [0, 2, 4, ..., 62]（步长为2）
        #   形状：(d_model/2,) = (32,)
        # 步骤2: -math.log(10000.0) / d_model 计算衰减系数
        #   math.log(10000) ≈ 9.21，除以 d_model=64 ≈ -0.144
        # 步骤3: 上述两项相乘，得到每个维度的频率参数
        # 步骤4: torch.exp(...) 取指数，得到最终的除法项
        # 最终结果：div[i] = 1 / 10000^(2i/d_model)，不同维度有不同的"波长"

        pe[:, 0::2] = torch.sin(pos * div)
        # 0::2 是切片语法，表示"从第0列开始，步长为2"→ 即所有偶数列
        # pos * div 利用广播机制：(50,1) * (32,) → (50, 32)
        # 将正弦值填入位置编码矩阵的偶数列

        pe[:, 1::2] = torch.cos(pos * div)
        # 1::2 表示"从第1列开始，步长为2"→ 即所有奇数列
        # 将余弦值填入位置编码矩阵的奇数列

        self.register_buffer("pe", pe)
        # register_buffer() 将 pe 注册为"缓冲区"
        # 与 nn.Parameter 的区别：
        #   - nn.Parameter：可训练参数，参与梯度更新
        #   - register_buffer：不可训练，但会随模型保存/加载，也会随模型移到 GPU
        # 位置编码是固定的（不需要训练），所以用 buffer

# ===============
# 完整的Transformer模型
class MiniTransformer(nn.Module):
    def __init__(self, vocab_size, d_model, d_ff, n_head, n_layer):
        """
        参数:
            vocab_size: 词汇表大小
            d_model: 模型维度
            d_ff: 前馈层隐藏维度
            n_head: 注意力头数
            n_layer: Transformer Block 层数
        """
        super().__init__()

        self.tok_emb = nn.Embedding(vocab_size, d_model)
        # Token 嵌入层（Token Embedding）
        # 将离散的字符索引映射为连续的向量表示
        # 例如：索引 5 → [0.12, -0.34, 0.56, ...]（64维向量）
        # nn.Embedding(num_embeddings, embedding_dim)
        #   内部维护一个 (vocab_size, d_model) 的查找表
        #   输入索引 → 输出对应行的向量
        # ========== 示例：Embedding 的用法 ==========
        #   >>> emb = nn.Embedding(10, 4)  # 10个词，每个4维
        #   >>> emb(torch.tensor([0, 3, 7]))  # 查找索引0、3、7
        #   tensor([[...], [...], [...]])  # 形状 (3, 4)

        self.pos_enc = PositionalEncoding(d_model)
        # 位置编码模块（已在上方详细解释）

        self.blocks = nn.Sequential(*[
            TransformerBlock(d_model, n_head, d_ff) for _ in range(n_layer)
        ])
        # ========== 语法拆解 ==========
        # 步骤1: for _ in range(n_layer) 循环 n_layer 次，创建多个 TransformerBlock
        # 步骤2: [...] 列表推导式，生成 [Block1, Block2]
        # 步骤3: * 是解包运算符（Unpacking），将列表解包为独立参数
        #   nn.Sequential(*[Block1, Block2]) 等价于 nn.Sequential(Block1, Block2)
        #   类似于 JavaScript 的展开运算符 ...arr
        # 步骤4: nn.Sequential(...) 按顺序串联所有 Block
        # 数据依次流过 Block1 → Block2，前一个的输出是后一个的输入

        self.ln_f = nn.LayerNorm(d_model)
        # 最终层归一化（在所有 Transformer Block 之后）
        # 论文中称为 "final layer norm"

        self.head = nn.Linear(d_model, vocab_size)
        # 输出头（Language Model Head）：将 d_model 维向量映射为词汇表概率分布
        # 输入：(B, T, d_model) → 输出：(B, T, vocab_size)
        # 每个位置的输出是"下一个字符是词汇表中每个字符的分数（logits）"


# ===============
# 训练函数
def train():
    model = MiniTransformer(VOCAB_SIZE,D_MODEL,D_FF,N_HEADS,N_LAYERS)  # 创建模型实例


# ====================== 
# 程序入口
if __name__ == "__main__":
    train()