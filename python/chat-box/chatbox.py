import os# 导入os模块，用于获取环境变量
from dotenv import load_dotenv # 导入load_dotenv函数，用于加载环境变量
from openai import OpenAI # 导入OpenAI类，用于创建OpenAI客户端

load_dotenv() # 加载环境变量
client = OpenAI(api_key=os.getenv("API_KEY"),
                base_url="https://api.deepseek.com",
) # 创建OpenAI客户端
