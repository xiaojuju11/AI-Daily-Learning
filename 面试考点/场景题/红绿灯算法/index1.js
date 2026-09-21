const setColor = (color,time) => {
    return new Promise((resolve,reject) => {
        console.log(color)
        setTimeout(resolve,time)
    })
}

// function run(){
//     setColor('红灯亮了',3000).then(()=>{
//     setColor('绿灯亮了',2000).then(()=>{
//         setColor('黄灯亮了',1000).then(()=>{
//             run()
//         })
//     })
// })
// }

async function run(){
    while(true){
        await setColor('红灯亮了',3000)
        await setColor('绿灯亮了',2000)
        await setColor('黄灯亮了',1000)
    }
}
run()