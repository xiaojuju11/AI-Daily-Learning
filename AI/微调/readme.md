#  LLM 微调
- 全量微调

    - 重新训练整个模型，包括所有参数

    - 适用于任务复杂，数据量大的情况 (法律、金融、医疗等领域)

    - 需要大量的计算资源和数据

    - 计算量大，成本高

- 轻量微调 （Fine-Tuning） （LoRA, QloaRA, Prefix-Tuning）
    - 只调整少量参数 （给模型贴便签）
    - 适用于任务简单，数据量小的情况
    - 计算量小，成本低

1. 下载模型
#模型下载
from modelscope import snapshot_download
model_dir = snapshot_download('deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B')

2. 查看模型位置
/mnt/workspace/.cache/modelscope/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B

3. 加载模型
<!-- 
# 加载模型并测试
from transorfmers import AutoTokenizer, AutoModelForCausalLM

# 指定模型路径，这里是一个本地已经下载好的 DeepSeek-R1 模型的路径
model_name = "/mnt/workspace/.cache/modelscope/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"

# 加载分词器和模型
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name).to("cuda")

print("模型加载成功！") 
-->

4. 准备数据集（或者在魔搭下载数据集）
<!-- 
# 准备数据集
import json

# 假设这是你的原始数据
samples = [...] # 每个 sample 应为 dict 类型，例如 {"text": "xxx"} 或 {"input": "...", "output": "..."}

# 写入 jsonl 文件
with open("dataset.jsonl", "w", encoding="utf-8") as f:
    for sample in samples:
        f.write(json.dumps(sample, ensure_ascii=False) + "\n")

print("数据集制作完成！") 
-->

5. 导入数据集

6. 拆分数据集： 训练集、测试集
# 拆分数据集
from datasets import load_dataset

# 加载本地数据
<!-- 
dataset = load_dataset("json", data_files=["dataset.jsonl"], split="train")

print("数据总数量：", len(dataset))

# 划分训练集和测试集（90% 训练，10% 测试）
train_test_split = dataset.train_test_split(test_size=0.1)

# 提取训练集和验证集
train_dataset = train_test_split["train"]
eval_dataset = train_test_split["test"]

print(f"train dataset len: {len(train_dataset)}")
print(f"test dataset len: {len(eval_dataset)}")
print("训练数据的准备工作完成") 
-->

7. 将数据集转换为模型输入格式 （向量表示）
<!-- 
# 编写 Tokenizer 处理工具

def tokenizer_function(many_samples):
    ...

    # 将 prompt 和 completion 拼接后进行分词处理
    ...

    # 将包含样本的 prompt 和 completion 拼接成一个文本
    texts = [f"({instruction}) in {output}" for instruction, output in zip(many_samples['instruction'], many_samples['output'])]

    # 使用 tokenizer 进行分词，截取长度为 512，填充至最大长度
    tokens = tokenizer(
      texts,
      truncation=True,
      max_length=512,
      padding="max_length"
    )

    # 设置 labels 为 input_ids 的副本（用于因果语言建模任务）
    tokens["labels"] = tokens["input_ids"].copy()

    return tokens

# 对训练集和验证集应用 tokenizer 处理
tokenized_train_dataset = train_dataset.map(tokenizer_function, batched=True)
tokenized_eval_dataset = eval_dataset.map(tokenizer_function, batched=True)

print(tokenized_train_dataset[0])
print("分词完成") 
-->
8. 量化数据集 （8bit 量化）（节省显存占用）
<!-- 
# 量化设置
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

# 配置 8bit 量化
quantization_config = BitsAndBytesConfig(load_in_8bit=True)

# 重新加载量化后的模型
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    quantization_config=quantization_config,
    device_map="auto"
)

print("量化模型加载完成！") 
-->

9. 训练模型：配置 loRA 参数
<!-- 
# 配置 LoRA 参数
from peft import get_peft_model, LoraConfig, TaskType

lora_config = LoraConfig(
    r=8,    # LoRA 秩 (rank)，控制适配器大小，通常设为 8~32
    lora_alpha=16,    # 控制 LoRA 更新的缩放因子，一般为 r 的倍数
    lora_dropout=0.05,    # Dropout 概率，防止过拟合
    task_type=TaskType.CAUSAL_LM   # 任务类型：因果语言模型
)

# 获取 PEFT 模型
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()

print("LoRA 设置完成！") 
-->

pip uninstall transformers -y
pip cache purge
pip install transformers==4.50.0




import transformers
print(transformers.__version__)

10. 开始训练模型
<!-- 
# 开始训练
from transformers import TrainingArguments, Trainer

# 配置训练参数
training_args = TrainingArguments(
    output_dir="./finetuned_models",           # 模型保存路径
    num_train_epochs=10,                       # 训练轮数
    per_device_train_batch_size=4,             # 每设备批量大小 (GPU 上)
    gradient_accumulation_steps=8,             # 梯度累积步数（模拟更大 batch）
    fp16=True,                                 # 使用 FP16 半精度训练，节省显存
    logging_steps=10,                          # 每 10 步打印一次日志
    save_steps=100,                            # 每 100 步保存一次 checkpoint
    eval_strategy="steps",                     # 每隔一定步数评估一次
    eval_steps=10,                             # 每 10 步进行一次评估
    learning_rate=3e-5,                        # 学习率
    logging_dir="./logs",                      # 日志保存路径
    run_name="deepseek-r1-distill-finetune"    # Hugging Face Weights & Biases 实验名称
)

print("训练参数设置完毕")

# 定义训练器
trainer = Trainer(
    model=model,                              # 已加载并配置好 LoRA 的模型
    args=training_args,                       # 训练参数
    train_dataset=tokenized_train_dataset,    # 分词后的训练数据集
    eval_dataset=tokenized_eval_dataset       # 分词后的验证数据集
)

print("——开始训练——")
trainer.train()
print("——训练完成——") 
 -->


pip uninstall apex -y