const url = 'https://www.baidu.com/order/home?user=Tom&id=123&city=南昌&id=56'

const output = {
  protocol: 'https',
  hostname: 'www.baidu.com',
  path: '/order/home',
  query: {
    user: 'Tom',
    id: [123, 56],
    city: '南昌'
  }
}

function urlParser(url) {
  const protocolArr = url.split('://')  // ['https', 'xxxxxx']
  const protocol = protocolArr[0]

  const hostname = protocolArr[1].split('/')[0]
  // 'www.baidu.com/order/home?user=Tom&id=123&city=南昌&id=56'
  const path = protocolArr[1].split(hostname)[1].split('?')[0]

  const queryArr = protocolArr[1].split(hostname)[1].split('?')[1].split('&')
  // ['user=Tom', 'id=123', 'city=南昌', 'id=56']

  const query = {}
  queryArr.forEach(item => {
    const [key, value] = item.split('=')
    if (query[key]) {
      const val = query[key]
      query[key] = [].concat(val, value)
    } else {
      query[key] = value
    }
  })

  return {
    protocol,
    hostname,
    path,
    query
  }
}

console.log(urlParser(url));