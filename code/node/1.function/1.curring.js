// function sum(a, b, c, d) {
//     return a + b + c + d
// }

// const curring = (fn, arr = []) => {
//     let len = fn.length;
//     return function (...args) {
//         let newArgs = [...arr, ...args];
//         if (newArgs.length == len) {
//             return fn(...newArgs);
//         } else {
//             return curring(fn, newArgs)
//         }
//     }
// }
// let newSum = curring(sum);
// console.log(newSum(1)(2)(3)(4))



function sum(a, b, c, d) {
    return a + b + c + d;
}

const curring = (fn, arr = []) => {
    let len = fn.length;
    return function (...args) {
        let newArgs = [...arr, ...args]
        if (len == newArgs.length) {
            return fn(...newArgs)
        } else {
            return curring(fn, newArgs)
        }
    }
}