### 0.关于Promise

```js
1.异步并发问题【Promise.all】
2.解决回调地狱问题即上一个函数的输出是下一个函数的输入【链式操作：then】
3.错误处理方法非常方便【catch方法】
但是Promise存在的缺陷：它依旧是基于回调函数
```

### 1.用法

1.`Promise`是一个类，类中的构造函数需要传入一个`executor`参数，`executor`默认就会执行

2.`executor`中有两个参数 分别是`resolve`，`reject`

```js
let p = new Promise((resolve, reject) => {
  console.log(1)
});
console.log(2); //由于executor参数会立即执行，所以打印出来的顺序是1 2
```

3.创建一个`Promise`默认状态就是`pending`

```js
let p = new Promise((resolve, reject) => {
});
console.log(p) //Promise {<pending>}
```

4.`Promise`有三个状态分别是`pending`（等待）、`fulfilled `（成功）、`rejected` （失败）

+ `fulfilled ` ==> `resolve()`
+ `rejected` ==>` reject()`

5.调用成功和失败时需要传递一个成功的原因和失败的原因
6.如果已经成功了就不能失败了（即调用了`resolve`之后就不能再调`reject`，反之亦然）

```js
let p = new Promise((resolve, reject) => {
  resolve('success');
  reject('fail')//不执行
});
p.then(res => {
    console.log(res) //success
},err => {
    console.log(err)
})
```

7.如果抛出异常按照失败来处理即走下一个then中的失败

```js
let p = new Promise((resolve, reject) => {
   throw new Error('fail')
});
p.then((data) => {
    console.log('success', data)
}, (reason) => {
    console.log('fail', reason) //fail
})
```

### 2.总结特性

#### 1.`Promise`链式调用问题

1.如果then方法中（成功或者失败）返回的不是一个Promise实例，则会将这个值传递给外层下一次then的成功结果；

```js
//注解：此处的read函数执行成功时，则走then中的resolve函数即返回return 100 则下一个then会执行resolve，并且其中的值时100，
//如果read函数的执行成果是失败的但是我们此处又没写return，但是因为函数执行默认会返回return undefined 所以下一个then会执行resolve，并且其中的值时undefined
const fs = require('fs');
function read(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    })
});
read('./name.txt','utf8').then(data => {
   return 100
},err=>{
  console.log(err)
}).then((data)=>{
    console.log(data) // 100
},err=>{
})
```

2.如果执行then方法中的方法出错了即抛出异常则会走到下一个then的失败；

```js
const fs = require('fs');
function read(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    })
});
read('./name.txt','utf8').then(data => {
   throw new Error('err')
},err=>{
  console.log(err)
}).then((data)=>{
    console.log(data)
},(err) => {
   console.log(err) // err
})
```

3.如果返回的是一个Promise实例则会用这个Promise实例的结果作为下一次then的成功或者失败。该Promise成功则走下一个then的成功，反之则走失败

```js
const fs = require('fs');
function read(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    })
});
read('./name.txt','utf8').then(data => {
   return read(data,'utf8')
},err=>{
  console.log(err)
}).then((data)=>{
    console.log(data)
},(err) => {
   console.log(err) 
})
```

> 总结：什么情况下会走第二个then中的失败
>
> 1.第一个then中出错会走第二个then的失败 
>
> 2.第一个then中返回的Promise实例的结果是失败的就会走第二个then的失败

4.Promise的then方法为什么可以链式调用？因为每次调用then方法都返回了一个新的Promise实例；

```js
function read(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    })
});
read('./name11111.txt','utf8').then().then().then();
```

5.catch就是一个没有成功只有失败then方法的别名 （找最近的优先处理，处理不了找下一层）；

```js
const fs = require('fs');
function read(...args) {
  return new Promise((resolve, reject) => {
    fs.readFile(...args, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    })
});
read('./name11111.txt','utf8').then(data => {
   return read(data,'utf8')
},err=>{
  console.log(err)
}).then((data)=>{
    console.log('s:'+data) //'s:undefined'
//因为第一个read方法读取name1111文件时失败了，所以走了第一then中的失败，第一个then中的失败没有返回其他的（即返回了 return undefined 就会导致走了第二个then中的成功方法，所以打印出来的是's:undefined'）
},(err) => {
   console.log('f:'+err) 
}).catch(err => {
  console.log('catch:'+err);
})
```

6.如果第一个Promise的then中没有传入reject函数，则会顺延到下一个then中的reject函数中，如果下一个then中没有，则依次类推，顺延至catch方法；

```js
read('./name11111.txt','utf8').then(data => {
   return read(data,'utf8')
}).then((data)=>{
    console.log('s:'+data) 
},(err) => {
   console.log('f:'+err) //在这里打印
}).catch(err => {
  console.log('catch:'+err);
})
//或者
read('./name11111.txt','utf8').then(data => {
   return read(data,'utf8')
}).then((data)=>{
    console.log('s:'+data) 
}).catch(err => {
  console.log('catch:'+err); //在这里打印
})
```

7.如果catch中也没有返回值（即 return undefined）,则会走到下一个then中的resolve方法

```js
read('./name11111.txt','utf8').then(data => {
   return read(data,'utf8')
}).then((data)=>{
    console.log('s:'+data) 
}).catch(err => {
  console.log('catch:'+err); 
}).then(data => {
  console.log(data) //在这里打印 undefined
})
  
//总结：catch相当于一个只传了reject的then
.then(null, err => {
  console.log(data)
})
```

#### 2.Promise.resolve/reject

```js
Promise.resolve('123').then((data) => {
  console.log(data) // 123
})
//如果Promise.resolve()放的是一个Promise实例，则会根据这个promise成功或者失败走下一个then方法
//如果Promise.catch()
```

```js
//catch就是没有传成功参数的then方法 ==> then(null,err => {})
Promise.reject('123').catch((data) => {
  console.log(data) //123
})
//如果Promise.reject()放的是一个Promise实例，不会看这个promise实例的结果，而是直接走then方法中的失败
```

#### 3.Promise.all

> 1.Promise.all方法返回的也是一个promise
>
> 2.Promise.all参数是一个数组，如果数组中某一项是普通值，则直接放进结果的数组里。反之则等待promise的成功与失败
>
> 3.Promise.all中只要有一个promise失败。则全体失败

```js
const Promise = require("./promise.js")
let fs = require('fs').promises
let getName =  fs.readFile('./name.txt','utf8')
let getAge =  fs.readFile('./age.txt','utf8')
// Promise.all方法返回的是一个promise,其中一个失败就全部失败了
Promise.all([1,getName,getAge,2]).then(data=>{ // 
    console.log(data);[1,Tomato,22,2]
  	//这里的data也是一个数组，分别按顺序存放1 、getName的promise的then方法之后返回的值 、 getAge的promise的then方法之后返回的值 和 2
});
```

#### 4.Promise.finally

>1.finally方法没有入参;
>
>2.finally方法里面的代码无论如何都会执行;
>
>3.finally方法后面还可以使用then方法，因为finally也是返回一个promise ;
>
>

```js
Promise.resolve(123).finally((data) => {
  console.log('finally',data); // finally undefined
}).then(data => {
  console.log(data) // 123
})
```

```js
Promise.reject(123).finally((data) => {
  console.log('finally',data); // finally undefined
}).then(data => {
  console.log(data)
},err => {
  console.log('err',err) //err 123
})
//当一个Promise失败了就会走下一个then的失败
```

```js
Promise.resolve(123).finally((data) => {
  console.log('finally'); //finally
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve('ok')
    }, 5000);
  })
}).then(data => {
  console.log(data) //123（等待5000毫秒之后才会打印）当一个promise成功了会走下一个then中的成功（会等带里面执行完毕）
})
//不论finally方法里面返回的是什么，是promise实例还是其他，都不影响后面then的结果。只看finally方法前面的

//一个成功的promise等待另一个promise失败，则会走到下一个then方法的失败
Promise.reject(123).finally((data) => {
  console.log('finally'); //finally
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      reject('ok')
    }, 5000);
  })
}).then(data => {
  console.log(data) 
},err => {
  console.log('err',err) //err ok
})

//2
Promise.resolve(123).finally((data) => {
  console.log('finally'); //finally
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      reject('ok')
    }, 5000);
  })
}).then(data => {
  console.log(data) 
},err => {
  console.log('err',err) //err ok
})
```

> 总结：`Promise.all`跟`Promise.finally`的使用场景
>
> all使用于并发多个请求而finally是无论请求或者其他操作结果怎么样，我都要在finally方法里面处理一些逻辑

#### 5.Promise.race

> `Promise.all` `Promise.race` `Promise.allSettled`三者的区别
>
> `Promise.all`：一个失败就全失败
>
> `Promise.race`：赛跑模式，采用跑得最快的那个作为结果
>
> `Promise.allSettled`：既要成功也要失败 跟`Promise.finally`挺像 【Promise已经有这个方法了】

`Promise.race`

```js
let p1 = new Promise((resolve,reject) => {
  setTimeout(()=>{
    resolve('ok')
  },1000)
})

let p2 = new Promise((resolve,reject) => {
  setTimeout(()=>{
    reject('no ok')
  },2000)
})

Promise.race([p1,p2]).then((values) => {
  console.log(values) // ok
})
//存在普通值
Promise.race([p1,p2,1]).then((values) => {
  console.log(values) // 1
})
```

`Promise.allSettled`

```js
let p1 = new Promise((resolve,reject) => {
  setTimeout(()=>{
    resolve('ok')
  },1000)
})

let p2 = new Promise((resolve,reject) => {
  setTimeout(()=>{
    reject('no ok')
  },1000)
})

Promise.allSettled([p1,p2]).then((values) => {
  console.log(values)
  // [
  //   { status: 'fulfilled', value: 'ok' },
  //   { status: 'rejected', reason: 'no ok' }
  // ]
})
```

#### 6.Promise.abort

>原生的Promise中没有abort方法，这个方法是我们自己基于Promise封装的;
>
>abort方法就是不要promise这次成功的结果

```js
let p1 = new Promise((resolve,reject) => {
  setTimeout(()=>{
    resolve('success')
  },3000)
})
function warp(p1){
  let abort;
  let p2 = new Promise((resolve,reject) => {
    abort = reject;
  })
  let newPromise = Promise.race([p1,p2])
  newPromise.abort = abort;
  return newPromise;
}
let p2 = warp(p1);
p2.then(data => {
  console.log(data)
}).catch(err => {
  console.log(err) // 1s abort
})
setTimeout(()=>{
  p2.abort('1s abort')
},1000)
```

#### 7.Promisify方法

在node中fs模块中的promises

```js
const fs  = require('fs').promises;
fs.readFile('note.txt','utf-8').then((data) => {
  console.log(data) //note.txt的内容
})
```

实现自己的promises方法

```js
const fs  = require('fs');
function promisify(fn){
  //高阶函数
  return function(...args){
    return new Promise((resolve,reject) => {
      fn(...args,function(err,data){
        if(err) reject(err);
        resolve(data);
      })
    })
  }
}

const readFile = promisify(fs.readFile);
readFile('note.txt','utf-8').then(data => {
  console.log(data) //note.txt的内容
})
```

#### 8.promisifyAll方法

> `promisifyAll`功能类似于`bluebird`插件，但是我们完全可以基于promise来实现这个功能

```js
const fs = require('fs');
function promisify(fn){
  return (...args) => {
    return new Promise((resolve,reject) => {
      fn(...args,(err,data) => {
        if(err) return reject(err);
        resolve(data);
      })
    })
  }
}
function promisifyAll(target){
  Reflect.ownKeys(target).forEach(key => {
    target[key + 'Async'] = promisify(target[key])
  })
  return target;
}
let obj = promisifyAll(fs);
obj.readFileAsync('age.txt','utf8').then(data => {
  console.log(data);
})
```

但是在node中有内置模块util提供这样的API了

```js
const fs = require('fs');
const util = require('util'); //node的内置模块

function promisifyAll(target){
  Reflect.ownKeys(target).forEach(key => {
      if(typeof target[key] === 'function'){
         target[key + 'Async'] = util.promisify(target[key])
      }
  })
  return target;
} 
let obj = promisifyAll(fs);
obj.readFileAsync('age.txt','utf8').then(data => {
  console.log(data);
})
```

#### 9.Promise.allSettled()

该**`Promise.allSettled()`**方法返回一个在所有给定的 promise 都已经`fulfilled`或`rejected`后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。

```JS
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).
  then((results) => results.forEach((result) => console.log(result.status)));

// expected output:
// "fulfilled"
// "rejected"
```



### 3.手写Promise

```js
const STATUS = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
}
function resolvePromise(x, promise2, resolve, reject) {
    if (x === promise2) {
        throw TypeError('type error');
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called;
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (called) return;
                    called = true;
                    resolvePromise(y, promise2, resolve, reject)
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r)
                })
            } else {
                resolve(x);
            }
        } catch (err) {
            if (called) return;
            called = true;
            reject(err)
        }
    } else {
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.status = STATUS.PENDING;
        this.val = undefined;
        this.reason = undefined;
        this.onResolveCallbacks = [];
        this.onRejectCallbacks = [];
        const resolve = val => {
            if (val instanceof Promise) {
                return val.then(resolve, reject)
            }
            if (this.status === STATUS.PENDING) {
                this.status = STATUS.FULFILLED;
                this.val = val;
                this.onResolveCallbacks.forEach(fn => fn());
            }
        }
        const reject = reason => {
            if (this.status === STATUS.PENDING) {
                this.status = STATUS.REJECTED;
                this.reason = reason;
                this.onRejectCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : x => x;
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === STATUS.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.val);
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0);
            }
            if (this.status === STATUS.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(x, promise2, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                }, 0);
            }
            if (this.status === STATUS.PENDING) {
                this.onResolveCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.val);
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0);
                })
                this.onRejectCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(x, promise2, resolve, reject)
                        } catch (err) {
                            reject(err)
                        }
                    }, 0);
                })
            }
        })
        return promise2;
    }
    catch(err) {
        return this.then(null, err)
    }

    finally(callback) {
        return this.then(data => {
            return Promise.resolve(callback()).then(() => data)
        }, err => {
            return Promise.resolve(callback()).then(() => { throw err })
        })
    }

    static resolve(val) {
        return new Promise((resolve, reject) => {
            resolve(val)
        })
    }
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }
    static all(promises) {
        return new Promise((resolve, reject) => {
            let result = [];
            let times = 0;
            function processData(index, val) {
                result[index] = val;
                if (++times === promises.length) {
                    resolve(result);
                }
            }
            for (let i = 0; i < promises.length; i++) {
                let p = promises[i];
                if (p && typeof p.then == 'function') {
                    p.then((data) => {
                        processData(i, data);// 普通值
                    }, reject)
                } else {
                    processData(i, p);
                }
            }
        })
    }
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                let currentVal = promises[i];
                if (currentVal && typeof currentVal.then === 'function') {
                    currentVal.then(resolve, reject)
                    //then(data => resolve(data)) ===> then(resolve)
                } else {
                    resolve(currentVal)
                }
            }
        })
    }
    static allSettledl(promises) {
        return Promise.all(promises.map(p => {
            Promise.resolve(p).then(res => {
                return { status: 'fulfilled', value: res }
            }, err => {
                return { status: 'rejected', reason: err }
            })
        }));
    }
}
Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd;
}
module.exports = Promise
```

#### `promises-aplus-tests`

> 使用第三方包测试自己实现的Promise是否符合规范

##### 1.安装

```sell
npm install promises-aplus-tests
```

##### 2.测试

```
promises-aplus-tests + 文件名
例如
promises-aplus-tests promise.js
```

#### 练习题

```JS
Promise.resolve(1)
.then(x=>x+1) // 2
.then(x=>{throw new Error('my error')})
.catch(()=>1) // 1  返回的值普通值 会作为下一次then的成功结果
.then(x=>x+1) // 2
.then(x=>console.log(x))
.catch(console.err)
```

```JS
// 对Promise理解正确的是
// 1.promise可以让异步代码变成同步代码   错误答案  generator / async + await
// 2.promise解决了回调地狱问题
// 3.promise方便处理多个异步并发请求
// 4.promise错误处理非常优雅和方便
```

```JS
console.log(1);
async function async () {
    console.log(2);
    await console.log(3)
    console.log(4)
}
setTimeout(() => {
	console.log(5);
}, 0);
const promise = new Promise((resolve, reject) => {
    console.log(6);
    resolve(7)
})
promise.then(res => {
	console.log(res)
})
async(); 
console.log(8);
//1 6 2 3 8 7 4 5
```

