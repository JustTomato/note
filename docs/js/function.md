### 高阶函数

> 掌握高阶函数的使用，使用高阶函数解决异步问题。

#### 特点：

```tex
以下两个特点满足其中一个就是高阶函数:
1、 我们给一个函数传入一个函数
2、一个函数返回一个函数
```

特点1：给一个函数传入一个函数

```js
function fn(){
  
}
fn(()=>{
  
})
//这种形式我们一般称之为回调 
```

特点2：一个函数返回一个函数

```js
function fn(){
  return function(){}
}
//这种形式在闭包中使用比较多
```

#### 使用高阶函数可以解决什么问题呢？

> 例如：装饰器模式【切片编程】AOP

1.装饰器模式：对原有的函数进行包装

```js
function core(a, b, c) {
    console.log('core。。。。', a, b, c)
}
//在不改变core函数代码的情况下实现自己想要增加的功能【基于core进行再次封装】
//借助高阶函数实现装饰模式
// 每个类都有一个原型， 所有实例都有一个属性__proto__
Function.prototype.before = function(beforeFn) {
    // this = core
    // this的指向 就是看调用者
    return (...args) => { // 箭头函数中没有this 没有arguments 没有prototype
        beforeFn();
        this(...args);
    }
}
let newFn = core.before(() => {
    console.log('core before')
})
newFn(1, 2, 3);

//拓展：闭包
闭包：定义函数时的作用域和函数执行的作用域不是同一个
```

拓展：偏函数与纯函数：https://www.cnblogs.com/zhazhanitian/p/13063999.html

### 函数柯里化

> 柯里化函数：函数的每次入参都是一个
>
> 注释：柯里化也是一个高阶函数

示例1

```js
// newSum(1)(2)(3)(4)(5)这就是典型的柯里化函数
function sum(a,b,c,d,e){
  return a + b + c + d + e;
}
const curring = (fn, arr = []) => { // arr就是我们要收集每次调用时传入的参数
  let len = fn.length; // 函数的长度就是参数的个数
  return function(...args){
    let newArgs = [...arr, ...args];
    if(newArgs.length == len){
      return fn(...newArgs);
    }else{
      return curring(fn, newArgs);
    }
  }
}
let newSum = curring(sum)
console.log(newSum(1)(2)(3)(4)(5))
```

示例2

> 前置知识拓展 - 判断变量类型的四种方法
> 1.`typeof` [能判断变量是什么类型，但是不能区分数组和对象和null，三者都是`typeof`的值是object]
> 2.`constructor `[判断构造函数]
> 3.`instance of `[判断是谁的实例]
> 4.`Object.prototype.toString.call `[把对应的类型转为对应类型的字符串]

判断变量类型 - 常规

```js
const curring = (fn, arr = []) => { // arr就是我们要收集每次调用时传入的参数
  let len = fn.length; // 函数的长度就是参数的个数
  return function(...args){
    let newArgs = [...arr, ...args];
    if(newArgs.length == len){
      return fn(...newArgs);
    }else{
      return curring(fn, newArgs);
    }
  }
}
function isType(typing,str){
  return Object.prototype.toString.call(str) == `[object ${typing}]`;
}
let newIsType = curring(isType);
let isString = newIsType('String');
let isNumber = newIsType('Number');
console.log(isString('hello'));
console.log(isNumber('hello'));
```

判断变量类型 - 柯里化

```js

//使用Object.prototype.toString.call来实现判断变量类型
function isType(str,typing){
  return Object.prototype.toString.call(str)
}
console.log(isType('hello','String')); //[object String]

//改进为
function isType(str,typing){
  return Object.prototype.toString.call(str) == `[object ${typing}]`;
}
console.log(isType('hello','String')); //true

//但是上面的方式，我们开发者在调用的时候会容易调错，例如
//isType('hello','Strings') //把String写错成Strings

//再次改进 -- 让方法更具体一些 isNumber isString

function isType(typing){
  return function name(val){
    return Object.prototype.toString.call(val) == `[object ${typing}]`;
  }
}
let utils = {};
['String','Number','Boolean'].forEach(method => {
  utils[`is`+ method] = isType(method);
})
console.log(utils.isNumber(123));
```

### 异步处理

> 解决异步问题的核心就是回调函数

常见的异步问题 - 异步串行（不合理，因为两个异步函数之间没有关联关系）

```js
//这里借助node的fs模块来模拟发送Ajax请求
const fs = require('fs'); 
// 例如：需要处理两个异步请求得到的数据
// 这样并不能获取完整的两个异步数据
// let obj = {};
// fs.readFile('age.txt', 'utf8', function(err, data) {
//     if(err) return console.log(err)
//     obj.age = data;
// })
// fs.readFile('name.txt', 'utf8', function(err, data) {
//     if(err) return console.log(err)
//     obj.name = data;
//   	console.log(obj) // 此处并不能拿到完整的obj值
// });

//异步串行
let obj = {};
fs.readFile('age.txt', 'utf8', function(err, data) { // ajax
    if(err) return console.log(err)
    obj.age = data;
    fs.readFile('name.txt', 'utf8', function(err, data) { // ajax
        if(err) return console.log(err)
        obj.name = data;
      	console.log(obj) 
    });
})
//为了能获取两个异步处理的数据，写了上面不合理的代码。因为两个异步之间是没有关系的，而上述处理成异步串行了。
```

使用异步回调来优化代码结构

```js
// 异步数据处理 
const fs = require('fs');
//回调函数
let obj = {};
function after(times,callback) { //lodash库中的after和Promise.all方法都是类似的实现原理
    return function () {
        --times == 0&&callback();
    }
}
let fn = after(2,()=>{
    console.log(obj);
});
fs.readFile('age.txt', 'utf8', function(err, data) { // ajax
    if(err) return console.log(err)
    obj.age = data;
    fn();
})
fs.readFile('name.txt', 'utf8', function(err, data) { // ajax
    if(err) return console.log(err)
    obj.name = data;
    fn();
});
```

解决异步问题的另外一个解决方案发布订阅模式

#### 发布订阅模式

```js
//简易版本的发布订阅模式
const fs = require('fs');
let eventObj = {
    arr:[], // 中介存放 订阅的事件 
    on(fn){
        this.arr.push(fn);
    },
    emit(){
        this.arr.forEach(fn=>fn());
    }
}
let obj = {};
eventObj.on(()=>{ // 注册方法
    if(Object.keys(obj).length ==2){
        console.log('当前数据读取回来了',obj)
    }
})
fs.readFile('age.txt', 'utf8', function(err, data) {
    if(err) return console.log(err)
    obj.age = data;
    eventObj.emit(); // 触发
})
fs.readFile('name.txt', 'utf8', function(err, data) {
    if(err) return console.log(err)
    obj.name = data;
    eventObj.emit();
});
```

#### 观察者模式

> 观察者模式 核心还是基于发布订阅模式的
>
> 观察者模式跟发布订阅模式的区别:
>
> 1.观察者模式之间是存在依赖关系的，而发布订阅模式中的on跟emit是没有依赖关系的
>
> 2.观察者模式是只要状态一发生改变就主动通知

```js
// 将所有的观察者都放到被观察者中  （基于发布订阅的）
class Subject{ // 被观察者
    constructor(name){
        this.name = name;
        this.observers = [];
        this.state = '玩呢'
    }
    attach(o){ // 被观察者中要存放所有的观察者
        this.observers.push(o);
    }
    setState(newState){
        if(this.state != newState){
            this.state = newState;
            this.observers.forEach(o=>o.update(this))
        }
    }
}
class Observer{
    constructor(name){
        this.name = name
    }
    update(baby){
        console.log(baby.name+"跟"+ this.name +"说:"+baby.state)
    }
}
// 小宝宝 state  =》    主动的通知
let baby = new Subject('小宝宝');
let baby1 = new Subject('小宝宝');
let o1 = new Observer('爸爸');
let o2 = new Observer('妈妈');

baby.attach(o1);
baby.attach(o2);
baby.setState('有人打我');
baby.setState('我打他们');
```

