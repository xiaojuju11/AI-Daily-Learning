const num = 1654312342132.423112
// 1,654,312,342,132.42 

//千分位处理,每三位添加一个逗号,小数部分不处理
function toThousand(num) {
    num = num.toString()
    splitNum = num.split('.')
    for (let i = splitNum[0].length - 3; i > 0; i -= 3) {
        splitNum[0] = splitNum[0].slice(0, i) + ',' + splitNum[0].slice(i)
    }
    num = splitNum.join('.')
    return num
}


console.log(toThousand(num));