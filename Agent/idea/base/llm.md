# Token  (单位)
hello world  

['hello', 'world']  2个token

'人工智能'  2-3个token  取决于模型的分词器

# 分词器  BPE  （Byte Pair Encoding）


# 模型是一个一个token生成回复的
1. 天然就是流式输出  SSE （Server-Sent Events）单向通信  WebSocket （双向通信）
2. 工具调用JSON要“攒够了”才能解析
  {
    "na
    me": "rea
    d_file:,
    xxx
  }

3. response prefill 能操作模型的行为
{"name": "browser_



# QKV
生成token时，模型会拿着当前token的Q(查询向量query)，去跟前面所有的token的key做匹配，找到匹配度最高的key，读取对应的value作为当前token
 - 第一步：计算点击词的概率
 - 第二部：softmax归一化成权重
 - 第三步：按权重加权求和

- 上下文越大，模型对每一条信息的“记忆力”就会越差 （上下文腐烂）


- KV Cache
已有 100 个 token，生成第 101 个 token：生成该位置的 Q，与前面 1‑100 的 K 做注意力点积，得到第 101 个 token，并算出该 token 对应的 K、V。

生成第 102 个 token 时，朴素实现会重新对 1‑101 所有 token 计算 K、V，1‑100 的 K/V 属于重复开销。
KV Cache 缓存已经计算完成的历史 K、V，推理时直接读取复用，只计算当前位置的 Q；每生成一个新 token，就把它的 K、V 追加到缓存中，大幅减少计算量。
