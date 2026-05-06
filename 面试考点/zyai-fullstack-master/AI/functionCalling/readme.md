# functioncalling
- LLM 只能回答训练截止那一刻的知识，一些实时的，当下的知识，LLM 无法回答

- LLM 通信时需要接受一个 tools 参数，我们可以指明告诉 LLM ，遇到解决不了的问题时，可以调用 tools 中的函数来


- functioncall是指当大模型遇到回答不出来的问题或者未被训练过的内容时，我们可以给他封装一些工具函数，当遇到这些问题时就直接调用相应的工具函数来解决问题，得出结果后，再将得到的结果返回给大模型，由大模型返回出来


- functioncall 机制, 工具调用没有统一的规范，（工具命名，参数传递，返回值等都没有统一的规范）
- 各家大模型的 functioncall 机制都有自己的实现，（如 OpenAI 的 functioncall 机制，Google 的 functioncall 机制等）