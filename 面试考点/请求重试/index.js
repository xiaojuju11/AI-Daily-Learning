function ajax(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            const random = ~~(Math.random()*10)
            if(random<8){
                console.log('请求失败')
                reject('fail')
            }else{
                console.log('请求成功')
                resolve('success')
            }

        }, 1000);
    })
}

// ajax().then(res=>{
//     console.log(res)
// })
// .catch(err=>{
//     console.log(err)
// })

function retry(fn,times){
    return new Promise((resolve,reject)=>{
        fn().then(res=>{
            resolve(res)
        }).catch(err=>{
            if(times>0){
                retry(fn,times-1).then(res=>{
                    resolve(res)
                }).catch(err=>{
                    reject(err)
                })
            }else{
                reject(err)
            }
        })
    })
}

retry(ajax,3)
 .then(res=>{
    console.log(res)
 })
 .catch(err=>{
    console.log(err)
 })