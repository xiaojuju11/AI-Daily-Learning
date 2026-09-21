
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

function C(ctx, next) {
    console.log('C start')
    next()
    console.log('C end')
}

// function compose(middlewares) {
//     return function () {
//         let index = 0
//         let ctx = {}
//         let next = function () {
//             index++
//             if (index >= middlewares.length) return
//             middlewares[index](ctx, next)
//         }
//         middlewares[index](ctx, next)    //A({} ,next)

//     }
// }

function compose(middlewares) {
    return function (ctx = {}) {
        function dispatch(i) {
            if (i >= middlewares.length) return
            const nextFn = () => {
                dispatch(i + 1)
            }
            middlewares[i](ctx, nextFn)
        }
        dispatch(0)
    }
}

const fn = compose([A, B, C])
fn({})

// 洋葱模型的设计理念:就是提供出来一个 next 函数，当 next 函数在别的函数体里面被触发的时候,需要我们立马进入到下一层递归