
# http_status = 404

# match http_status:
#   case 400:
#     print('错误的请求')
#   case 404:
#     print('找不到资源')
#   case 500:
#     print('服务器开小差')


month = 13

match month:
  case 3 | 4 | 5:  # |是或者
    print('春季')
  case _:
    print('值不合法')
  