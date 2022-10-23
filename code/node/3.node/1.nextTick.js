

// setTimeout(() => {
//     console.log('timeout')
// },0)
// Promise.resolve().then(() => {
//     console.log('promise')
// })
// process.nextTick(() => {
//     console.log('nextTick')
// })


setTimeout(()=>{
    console.log('setTimeout')
},10)

setImmediate(() => {
    console.log('setImmediate')
})