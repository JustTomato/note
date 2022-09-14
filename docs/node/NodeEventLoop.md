

#### 1.Node中事件环

> 从Node10以上之后事件环和浏览器的事件环执行顺序一致

```js
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

+ timer：settimeout setinterval
+ poll：轮询阶段，会在特定的时刻阻塞，主要实质性I/O回调
+ check：setImmediate

> process.nextTick不属于Node事件环的一环，而是属于异步代码，它的执行顺序介于执行栈跟事件环之间

##### 搭配示例来理解

```JS
setTimeout(() => {
    console.log('timeout')
},0)
Promise.resolve().then(() => {
    console.log('promise')
})
process.nextTick(() => {
    console.log('nextTick')
})
//nextTick
//promise
//timeout

//process.nextTick：当前执行栈执行完毕之后立即调用。nextTick的优先级比Promise高
```

```JS
setTimeout(()=>{
    console.log('setTimeout')
},0)

setImmediate(() => {
    console.log('setImmediate')
})

//setTimeout
//setImmediate

//上述的结果有概率是先输出setImmediate在输出setTimeout，因为node中事件环的执行顺序是：当前执行栈执行完毕后会立即执行process.nextTick，然后按照上述node的事件环图顺序执行。但是timer（此处是setTimeout当为0时也是有最小的执行时间的，大概是4~7ms，而正是因为此原理存在，会导致有时候事件环按照顺序执行时，setTimeout还没到时间，执行栈就往下执行了【主要取决于性能】，从而导致输出有概率是先输出setImmediate在输出setTimeout）
```

```JS
//但是有一种情况是确定的即在poll阶段中嵌套。例如
const fs = require('fs')
fs.readFile('./node.md',function(){
   setTimeout(()=>{
        console.log('setTimeout')
    },0)
    setImmediate(() => {
        console.log('setImmediate')
    }) 
})
//setImmediate setTimeout

//根据上图，当执行顺序到达poll阶段之后，往后就是check阶段。而check阶段就是执行setImmediate的。当执行完check之后会再次循环。循环到timer。从而执行到setTimeout
```

