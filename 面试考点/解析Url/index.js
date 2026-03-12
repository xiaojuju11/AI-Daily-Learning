const url = 'https://www.baidu.com/order/home?user=Tom&id=123&city=南昌&id=56'

// const output = {
//     protocol: 'https',
//     hostname: 'www.baidu.com',
//     path: '/order/home',
//     query: {
//         user: 'Tom',
//         id: [123, 56],
//         city: '南昌'
//     }
// }

function urlParser(url) {
    const protocol = url.split('://')[0]
    const hostname = url.split('://')[1].split('/')[0]
    const path = url.split('://')[1].split('?')[0].split(hostname)[1]
    const query = (() => {
        const queryStr = url.split('://')[1].split('?')[1]
        const queryObj = {}
        queryStr.split('&').forEach(item => {
            const key = item.split('=')[0]
            const value = item.split('=')[1]
            if (queryObj[key]) {
                queryObj[key].push(value)
            } else {
                queryObj[key] = [value]
            }
        })
        return queryObj
    })
    return {
        protocol,
        hostname,
        path,
        query,
    }
}

console.log(urlParser(url))
