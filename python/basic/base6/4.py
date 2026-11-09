
# 商品列表
products = [ 
  [1000, 'iphone', 'phone', 12000],
  [1001, 'macbook pro', 'computer', 15000],
  [1002, 'ipad pro', 'pad', 8000],
]

# 购物车
cart = {1000: 5, 1001: 2}

def idtoprice(id):
  """ 根据商品id返回商品价格 """
  for product in products:
    if product[0] == id:
      return product[3]


def show_cart():
  """ 统计购物车商品数量总价格 """
  total = 0
  for product_id in cart:
    total += idtoprice(product_id) * cart[product_id]
  print(f"购物车商品数量总价格为：{total}")
  
def add_product(id, num):
  """ 添加商品到购物车 """
  if id in cart:
    cart[id] += num
  else:
    cart[id] = num
  show_cart()


def del_product(id):
  """ 删除购物车商品 """
  if id in cart:
    del cart[id]
  show_cart()



# show_cart()


add_product(1002, 3)

del_product(1002)

