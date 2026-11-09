# 作用域 和 闭包

# def foo():
#   name = '琪琪'
#   return name
# print(name)




# def func_out():
#   var_out = 1

#   def func_in():
#     return var_out
    
#   return func_in

# print(func_out()())



from functools import wraps
import time

def func():
  print('func 函数开始执行')
  time.sleep(1)
  print('func 函数执行完成')

# start = time.time()
# func()
# stop = time.time()
# print(f'func 函数执行时间：{stop - start} 秒')

def time_it(func):
  @wraps(func)  # 保留原函数的元数据
  def wrapper():
    start = time.time()
    func()
    stop = time.time()
    print(f'{func.__name__} 函数执行时间：{stop - start} 秒')
  return wrapper


@time_it
def work():
  print('work 函数开始执行')
  time.sleep(1)
  print('work 函数执行完成')

work()
