#### 1.generator出现的原因

>Promise存在内部还是采用回调的方式。一旦逻辑过多还是会出现回调地狱的问题，因此我们希望写的代码更像同步一些。所以就出现的generator

> 在node的Koa框架的1.0版本中采用了generator，但是koa2.0版本则采用了 async await。

##### generator函数可以实现暂停功能

```js
// yield 表示产出
// * 表示generator函数（迭代器函数）
//使用例子
function * gen(){
  yield 1
  yield 2
  yield 3
  return 100
}

let it = gen();
console.log(it) //Object [Generator] {}

console.log(it.next()); //{ value: 1, done: false } 
console.log(it.next()); //{ value: 2, done: false }
console.log(it.next()); //{ value: 3, done: false } 
console.log(it.next()); //{ value: 100, done: true }
console.log(it.next()); //{ value: undefined, done: true }

//generator函数由于老语法不支持，但是经过Babel编译后是 根据指针向下执行 + switch-case来实现的
```

##### generator实现原理

```js
function gen$(context) {
  switch (context.prev = context.next) {
      case 0:
          context.next = 1;
          return 1
      case 1:
          context.next = 2;
          return 2
      case 2:
          context.next = 3;
          return 3
      case 3:
          context.stop();
          return 100
  }
}
let gen = function() {
  const context = {
      prev: 0, // 当前要运行的
      next: 0, // 下一次要运行的
      done: false, // 是否完成运行
      stop() {
          this.done = true; // 更改完成状态
      }
  }
  return {
      next() {
          return {
              value: gen$(context), // 将上下文传入
              done: context.done
          }
      }
  }
}
let it = gen();
console.log(it.next()); // {value:1,done:false}
console.log(it.next()); // {value:2,done:false}
console.log(it.next()); // {value:3,done:false}
console.log(it.next()); // {value:undefined,done:true}
```

##### generator使用场景

```js
//读取文件
let fs = require('fs').promises;
function* read() {
    let name = yield fs.readFile('name.txt', 'utf8'); // => 返回结果
    let age = yield fs.readFile(name, 'utf8');
    return age;
}
let it = read();
let {value,done} = it.next() // 第一次调用next传参没有意义
value.then(data=>{
   let {value,done} = it.next(data); // 这里传入的data参数会作为上一次yield的返回值
   value.then(data=>{
       let {value,done} = it.next(data);
       console.log(value);
   })
})



//优化上面的使用例子
let fs = require('fs').promises; // async + await === ganertor + co
function co(it) { // 异步迭代采用函数的方式
    return new Promise((resolve, reject) => {
        function step(data) {
            let { value, done } = it.next(data);
            if (!done) {
                Promise.resolve(value).then((data)=>{
                    step(data)
                },reject); // 失败就失败了
            } else {
                resolve(value); // 将最终的结果抛出去
            }
        }
        step();
    })
}
function* read() { 
    let name = yield fs.readFile('name.txt', 'utf8'); // => 返回结果
    let age = yield fs.readFile(name, 'utf8');
    return age;
}
co(read()).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
})
```

##### async + await 就等于 generator + co。 generator + co就是async + await的前身

#### 2.async await

> await 方法执行后返回的是一个Promise实例，后面可以跟then方法
>
> async + await 是generator的语法糖

```js
const fs = require('fs').promises
async function read() {
    let name = await fs.readFile('name.txt', 'utf8'); // => 返回结果
    let age = await fs.readFile(name, 'utf8');
    return age;
}
// await  方法执行后返回的是一个promise
read().then(data=>{
    console.log(data);
})
// async + await 是genrator的语法糖
```

示例：

```js
const fn = async ()=>{
    console.log(1)
    return 10
}
(async function(){
    let result = await fn();
    console.log(2,result)
})();
console.log(3)
//1 3 2 10

//let result = await fn();
//console.log(2,result)
//await的实现原理是：后面的代码fn函数会被Promise.resolve且立即执行。即Promise.resolve(fn());
//而await fn()的下面同步代码则会放到then方法中，即Promise.resolve(fn()).then((result)=>{console.log(2,result)});
```

解释：

```txt
1.代码执行时，遇到await时会立即执行其后面的代码，看执行返回的Promise实例（如果不是Promise实例也会变为Promise实例）是否为成功
2.会把当前上下文中，await下面的代码当做异步的微任务，并把其放入WebAPI队列中区监听，只有当await后面返回的实例状态是成功时，才达到可执行的状态
3.达到可执行的状态时，则进入EventQueue队列中等待执行
```

