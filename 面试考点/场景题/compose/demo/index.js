import Koa from "koa";
const app = new Koa();

// function main(ctx, next) {
//     ctx.body = 'hello'
// }

// app.use(main)


//类似递归
//执行next()相当于把接力棒传下去，当所有的
//中间件都执行完后，会按照栈的顺序返回
function A(ctx, next) {
    console.log('A start')
    next()
    console.log('A end')
}

function B(ctx, next) {
    console.log('B start')
    next()
    console.log('B end')
}

app.use(A)
app.use(B)

app.listen(3000, () => {
    console.log("server start at port 3000")
})
