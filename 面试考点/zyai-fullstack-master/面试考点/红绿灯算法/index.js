// 红绿黄 各自亮的时长 3s, 2s, 1s

// setInterval(() => {
//   console.log('红');
//   setInterval(() => {
//     console.log('绿');

//     setInterval(() => {
//       console.log('黄');
//     }, 1000)

//   }, 2000)
// }, 3000)

// function red() {
//   setTimeout(() => {
//     console.log('红');
//     green()
//   }, 1000)
// }
// function green() {
//   setTimeout(() => {
//     console.log('绿');
//     yellow()
//   }, 3000)
// }
// function yellow() {
//   setTimeout(() => {
//     console.log('黄');
//     red()
//   }, 2000)
// }
// red()

const setColor = (color, time) => {
  console.log(color);

  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}


// async function run() {
//   while(true) {
//     await setColor('红', 3000)
//     await setColor('绿', 2000)
//     await setColor('黄', 1000)
//   }
// }
// run()

function run() {
  setColor('红', 3000).then(() => {
    setColor('绿', 2000).then(() => {
      setColor('黄', 1000).then(() => {
        run()
      })
    })
  })
}
run()