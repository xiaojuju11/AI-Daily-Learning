// 红绿黄 各自亮的时长 3s,2s,1s
//绿 黄 红  2  1 3
function red(){
    return new Promise((resolve,reject)=>{
        console.log('红灯亮了')
        setTimeout(()=>{
            resolve()
        },3000)
    })
}

function green(){
    return new Promise((resolve,reject)=>{
        console.log('绿灯亮了')
        setTimeout(()=>{
            resolve()
        },2000)
    })
}

function yellow(){
    return new Promise((resolve,reject)=>{
        console.log('黄灯亮了')
        setTimeout(()=>{
            resolve()
        },1000)
    })
}

function run(){
    red().then(()=>{
    green().then(()=>{
        yellow().then(()=>{
            run()
        })
    })
})
}
run()