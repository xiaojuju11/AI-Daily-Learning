// //红绿黄 各自亮的时长 3s,2s,1s

// setInterval(() => {
//     // console.log('红灯亮');

//     // setTimeout(() => {
//     //     console.log('绿灯亮');

//     //     setTimeout(() => {
//     //         console.log('黄灯亮');
//     //     }, 1000);

//     // }, 2000);

// }, 3000);

// function red(){
//     setTimeout(() => {
//         console.log('红灯亮');
//         green()
//     }, 1000);
// }

// function green(){
//     setTimeout(() => {
//         console.log('绿灯亮');
//         yellow()        
//     }, 3000);
// }

// function yellow(){
//     setTimeout(() => {
//         console.log('黄灯亮');
//         red()
//     }, 2000);
// }
// red()

const setColor = (color, time) => {
    return new Promise((resolve) => {
        console.log(`${color}亮`);
        setTimeout(() => {
            resolve()
        }, time);
    })
}

// async function run() {
//     while (true) {
//         await setColor('红', 3000)
//         await setColor('绿', 2000)
//         await setColor('黄', 1000)
//     }
// }
// run()

function run(){
    setColor('红', 3000).then(()=>{
        setColor('绿', 2000).then(()=>{
            setColor('黄', 1000).then(()=>{
                run()
            })
        })
    })
}