











### 08 - 事件环 EventLoop

+ 1.浏览器的进程
  + 每一个页卡都是进程 (互不影响)
  + 浏览器也有一个主进程 (用户界面)
  + 渲染进程 每个页卡里 都有一个渲染进程 (浏览器内核)
  + 网络进程 （处理请求）
  + `GPU`进程 `3d`绘制
  + 第三方插件的进程

+ 2.渲染进程（包含着多个线程）
  + GUI渲染线程 （渲染页面的）
  + `js`引擎线程 他和页面渲染时互斥
  + 事件触发线程 独立的线程 `EventLoop`
  + 事件 `click`、`setTimeout`、`ajax`也是一个独立线程

![1419197-20201023122152355-1947856852](img/1419197-20201023122152355-1947856852.png)

> 微任务队列每次都会创建一个全新的队列、事件队列仅有一个
>
> + 事件队列、消息队列：存放定时器到达时间的回调函数、`ajax`回调成功的函数等
> + 事件循环：不断检测调用栈是否为空，如果为空则从事件对列中取出一个来执行

+ 3.宏任务,微任务
  + 宏任务`script` `ui` 渲染、`setTimeout`、`setInterval`、`postMessage`、`MessageChannel`、`SetImmediate`
  + 微任务`promise.then` `mutationObserver`、`process.nextTick`

> 每循环一次会执行一个宏任务，并清空对应的微任务队列，每次事件循环完毕后会判断页面是否需要重新渲染 （大约`16.6ms`会渲染一次）



+ 4.微任务和GUI渲染

  ```html
  <script>
          document.body.style.background = 'red';
          console.log(1)
          Promise.resolve().then(()=>{
              console.log(2)
              document.body.style.background = 'yellow';
          })
          console.log(3);
  </script>
  ```

+ 5.事件任务

  ```html
  <script>
          button.addEventListener('click',()=>{
              console.log('listener1');
              Promise.resolve().then(()=>console.log('micro task1'))
          })
          button.addEventListener('click',()=>{
              console.log('listener2');
              Promise.resolve().then(()=>console.log('micro task2'))
          })
          button.click(); // click1() click2()
  </script>
  //声明事件后立即执行，则不是宏任务，只有声明事件后通过用户的点击去触发才是宏任务
  ```

+ 6.定时器任务

  ```html
  <script>
          Promise.resolve().then(() => {
              console.log('Promise1')
              setTimeout(() => {
                  console.log('setTimeout2')
              }, 0);
          })
          setTimeout(() => {
              console.log('setTimeout1');
              Promise.resolve().then(() => {
                  console.log('Promise2')
              })
          }, 0);
  </script>
  ```

  

+ 7.任务执行面试题

  ```js
  console.log(1);
  async function async () {
      console.log(2);
     //默认新版本的浏览器await后面的代码相当于 ==> 会把await后面的代码放到then中执行
     //老版本的浏览器会被解析出来两个then
      await console.log(3); // Promise.resolve(console.log(3)).then(console.log(4))
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
  async (); 
  console.log(8);
  //宏任务[5]
  //微任务[7,4]
  //16238745
  ```

+ 常见的宏任务跟微任务有哪些

  ```js
  //常见的宏任务：
  //setTimeout setImmediate(ie支持，性能高于setTimeout，例如vue框架中就会优先使用setImmediate，如果不兼容才会使用后者) messageChannel requsetFramAnimation script脚本 ui渲染 事件 ajax i/o等等...
  
  
  //常见的微任务：
  //浏览器：mutationObserver(h5语言提供的) promise.then
  //node：process.nextTick queueMicrotask
  ```

+ 另一个例子

  ```js
  setTimeout(()=>{
      console.log('timer1');
      Promise.resolve().then(()=>{
          console.log("promise1")
      })
  })
  setTimeout(()=>{
      console.log('timer2');
      Promise.resolve().then(()=>{
          console.log("promise2")
      })
  })
  ```

![13691851-ee66e30a40b9643c](img/13691851-ee66e30a40b9643c.gif)

​	完整流程图

![3635292-3adcf5f4fa243af3](img/3635292-3adcf5f4fa243af3.webp)

######自己总结

> 掌握事件环，主要让我们懂得代码的执行顺序

```js
//1.在计算机里调度任务和分配任务的单位是`进程`（例如在电脑中开一个QQ、开一个浏览器等等都是一个进程）
//2.一个进程中包含着很多个线程
//3.浏览器是一个多进程模型：通常（不是访问一个IP地址或者同一个域名的话）一个标签页都是一个进程（为什么要这么设计呢：每一个标签页都是一个进程，是因为当浏览器中的某一个标签页因为无限循环或者其他等问题而卡死时，能保证其他标签页能正常运行加载，从而保证了每一个标签页之间的独立性）

//浏览器有以下的进程
//1.主进程：一般是浏览器界面，也即是用户界面
//2.渲染进程：包括浏览器内核 js的渲染和ui的渲染
//3.还有其他一些进程：例如处理请求的的网络进程、例如gpu的绘图进程、例如第三方的一些插件的插件独立的进程

//进程里面的才是线程，线程不能脱离于进程而存在

//线程是我们需要了解的核心，线程又包括哪些呢？
//1.js的“主”线程是单线程的，同时ui渲染和js渲染是共用一条线程的
//那么为什么js不设计成多线程的呢？举例子：如果是多线程的话，假设js中有一个线程是增加a这个dom，而另外一个线程是删掉b这个dom，这样的话js到底该听谁的？所以处于这种考虑，js被设计成单线程的，代码从上到下依次执行。


//那么除了我们说的“主”线程之外，还有哪些线程呢？
//1.比如说：js事件，定时器、ajax这些都是其他的线程，也都是包含在进程中的
//2.需要注意的是，浏览器中虽然给我们提供了webworker工作线程，但webworker和主线程是不平等的，因为主线程可以操作dom而webworker工作线程不可以


//宏任务与微任务
//1.所有的异步方法都是宏任务和微任务
//2.宏任务：宿主环境（也即是浏览器）提供的异步方法 （事件、定时器、ajax这些都是异步方法，另外脚本渲染跟ui渲染也是宏任务）
//3.微任务：语言本身提供的是微任务 分别有Promise.then、MutationObserver




//整个宏任务与微任务的调度顺序是怎样的？
function a(){
    function b() {
        setTimeout(() => {
            
        }, 1000);
        function c(){
            Promise.resolve().then(()=>{
           
            })
            Promise.resolve().then(()=>{
                
            })
            Promise.resolve().then(()=>{
                
            })
        }
        c();
    }
    b()
}
a()

// 默认先执行宏任务 （script脚本）,会清空所有的微任务 (全部执行完毕) ,微任务执行后开始页面渲染（不是每次都渲染）,取出一个宏任务执行，执行过程中可能再次产生宏任务、微任务。。。不停的循环

function a() {
    function b(){
        function c(){
        }
        c()
    }
    b()
}
a()
```



####09-进程与线程拓展

#####一、浏览器四大进程

1.Browser进程：浏览器的主进程（负责协调、主控），只有一个。

  主要作用：

- 负责浏览器界面显示，与用户交互。如前进，后退等
- 负责各个页面的管理，创建和销毁其他进程
- 将渲染（Renderer）进程得到的内存中的Bitmap（位图），绘制到用户界面上
- 网络资源的管理，下载等

2、第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
3、GPU进程：最多一个，用于3D绘制等
4、浏览器渲染进程（即通常所说的浏览器内核）（Renderer进程，内部是多线程的）：主要作用为页面渲染，脚本执行，事件处理等



#####二、浏览器多进程的优势

相比于单进程浏览器，多进程有如下优点：

- 避免单个page crash影响整个浏览器
- 避免第三方插件crash影响整个浏览器
- 多进程充分利用多核优势
- 方便使用沙盒模型隔离插件等进程，提高浏览器稳定性

简单点理解：如果浏览器是单进程，那么某个Tab页崩溃了，就影响了整个浏览器，体验有多差；同理如果插件崩溃了也会影响整个浏览器；而且多进程还有其它的诸多优势。当然，多进程，内存等资源消耗也会更大，有点空间换时间的意思。



#####三、渲染进程包括哪些线程

1. GUI渲染线程

- 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等。
- 当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行
- 注意，**GUI渲染线程与JS引擎线程是互斥的**，当JS引擎执行时GUI线程会被挂起（相当于被冻结了），GUI更新会被保存在一个队列中**等到JS引擎空闲时**立即被执行。

1. JS引擎线程(单线程)

- 也称为JS内核，负责处理Javascript脚本程序。（例如常常听到的谷歌浏览器的V8引擎，新版火狐的JaegerMonkey引擎等）
- JS引擎线程负责解析Javascript脚本，运行代码。
- JS引擎一直等待着**任务队列**中任务的到来，然后加以处理，一个Tab页（renderer进程）中无论什么时候都只有一个JS线程在运行JS程序
- 同样注意，**GUI渲染线程与JS引擎线程是互斥的**，所以如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。

1. 事件触发线程

- 归属于渲染进程而不是JS引擎，用来控制**事件轮询**（可以理解，JS引擎自己都忙不过来，需要浏览器另开线程协助）
- 当JS引擎执行代码块如鼠标点击、AJAX异步请求等，会将对应任务添加到事件触发线程中
- 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理**任务队列**的队尾，等待JS引擎的处理
- 注意，由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）

1. 定时触发器线程

   - 定时器setInterval与setTimeout所在线程
   - 浏览器定时计数器并不是由JavaScript引擎计数的,（因为JavaScript引擎是单线程的, 如果任务队列处于阻塞线程状态就会影响记计时的准确）
   - 因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待JS引擎空闲后执行）
   - 注意，W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。

2. 异步http请求线程

   - 用于处理请求[XMLHttpRequest](https://link.jianshu.com/?t=http%3A%2F%2Fwww.w3school.com.cn%2Fxml%2Fxml_http.asp)，在连接后是通过浏览器新开一个线程请求。如ajax，是浏览器新开一个http线程

   - 将检测到状态变更（如ajax返回结果）时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入js引擎线程的事件队列中。再由JavaScript引擎执行。

     ![1894758-e4ac3502e802d838](img/1894758-e4ac3502e802d838.png)

知道了这几个线程，那么通过这几个线程，js是怎么执行的呢？



#####四、渲染进程中的线程之间的关系

> GUI渲染线程与JS引擎线程互斥

由于JavaScript是可操纵DOM的，如果在修改这些元素属性同时渲染界面（即JS线程和GUI线程同时运行），那么渲染线程前后获得的元素数据就可能不一致了。

因此为了防止渲染出现不可预期的结果，浏览器设置GUI渲染线程与JS引擎为互斥的关系，当JS引擎执行时GUI线程会被挂起，
GUI更新则会被保存在一个队列中等到JS引擎线程空闲时立即被执行。

> JS阻塞页面加载

从上述的互斥关系，可以推导出，JS如果执行时间过长就会阻塞页面。

譬如，假设JS引擎正在进行巨量的计算，所以JS引擎很可能很久很久后才能空闲，所以导致页面渲染加载阻塞。这就牵扯到script标签在html中的存放位置。具体可以看我另一篇文章 [为什么script标签一般放在body下面](https://www.jianshu.com/p/86250c123e53)



#####五、js引擎是单线程的

我们知道js是单线程的。也就是说，同一个时间只能做一件事。那么，为什么JavaScript不能有多个线程呢？这样能提高效率啊。

参考阮一峰大神的文章[js事件轮询（Event Loop）](https://link.jianshu.com/?t=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2014%2F10%2Fevent-loop.html)

- JavaScript的单线程，与它的用途有关。作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？
- 所以，为了避免复杂性，从一诞生，JavaScript就是单线程，这已经成了这门语言的核心特征，将来也不会改变。
- 为了利用多核CPU的计算能力，HTML5提出Web Worker标准，允许JavaScript脚本创建多个线程，但是子线程完全受主线程控制，且不得操作DOM。所以，这个新标准并没有改变JavaScript单线程的本质。



#####六、js事件轮询

上面我们已经知道JS引擎是单线程，任务应该是按顺序执行的，那么怎么会有同步异步之说？

- 单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。
- 如果排队是因为计算量大，CPU忙不过来，倒也算了，但是很多时候CPU是闲着的，因为IO设备（输入输出设备）很慢（比如Ajax操作从网络读取数据），不得不等着结果出来，再往下执行。
- JavaScript语言的设计者意识到，这时主线程完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去。
- 于是，所有任务可以分成两种，一种是同步任务（synchronous），另一种是异步任务（asynchronous）。同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

理解了同步异步。其实其最本质原因就是基于js的事件轮询机制。

1. 所有同步任务都在主线程（即js引擎线程）上执行，形成一个执行栈
2. 而异步任务均由事件触发线程控制，其有一个任务队列。只要异步任务有了运行结果，就在"任务队列"之中放置回调事件。异步任务必须指定回调函数，当主线程开始执行异步任务，就是执行对应的回调函数。所以所谓"回调函数"（callback），就是那些会被主线程挂起来的代码。
3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，按顺序结束等待状态，进入执行栈，开始执行。
4. 主线程不断重复上面的第三步
5. 只要主线程空了，就会去读取"任务队列"，这个过程会不断重复。这就是JavaScript的运行机制。又称为Event Loop（事件循环或者轮询）。



#####七、定时器触发线程

上述事件循环机制的核心是：JS引擎线程和事件触发线程

js来控制主线程，事件触发来控制任务队列就如主线程。

为什么要单独的定时器线程？因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确，因此很有必要单独开一个线程用来计时。

什么时候会用到定时器线程？当使用setTimeout或setInterval时，它需要定时器线程计时，计时完成后就会将特定的事件推入事件触发线程的任务队列中。等待进入主线程执行。

譬如:



```jsx
setTimeout(function(){
    console.log('hello!');
}, 1000);
```

这段代码的作用是当1000毫秒计时完毕后（由定时器线程计时），将回调函数推入事件队列中，等待主线程执行



```jsx
setTimeout(function(){
    console.log('hello!');
}, 0);

console.log('begin');

//begin hello
```

这段代码的效果是表示当前代码执行完（执行栈清空）以后，立即执行（0毫秒间隔）指定的回调函数。

**注意：**

- 虽然代码的本意是0毫秒后就推入事件队列，但是html5标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。
- 就算不等待4ms，就算假设0毫秒就推入事件队列，也会先执行begin（因为只有主线程可执行栈内空了后才会主动读取事件队列）。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证，回调函数一定会在setTimeout()指定的时间执行。同理setInterval则是每次都精确的隔一段时间推入一个事件（但是，事件的实际执行时间不一定就准确，还有可能是这个事件还没执行完毕，下一个事件就来了）



####10-总结

#####异步

- 高阶函数  AOP 装饰模式 （熟练使用回调的方式）
- 发布订阅 观察者模式 区分这两种模式
- promise (手写程度) all race finally allSettled  promise链中断(返回空的promise)，让当前promise变成失败可以借助race的包裹  (优点和缺点)
- generator （生成器、迭代器）- 指针+switch case来实现
- co库 执行generator 异步迭代(递归迭代)
- async + await 语法糖

#####事件环 （事件触发线程）

- 运行时主线程是单线程的 （可以开辟其他线程）
- 浏览器内核 运行js  ui渲染  互斥的  画的浏览器事件循环图
- 宏任务 （宿主环境提供的） 微任务 （语言本身提供的）
- 先执行执行栈中代码 -》 清空所有微任务 -》 重新渲染页面 （不是每次都执行）=> 宏任务列中拿出一个放到执行栈中执行 无限循环
- MessageChannel setTimeout i/o 脚本 ui requestFrameAnimation ajax....
- Promise.then MutationObserver nextTick微任务...






<!-- tabs:start -->
---

### Node基本概念

<!-- tabs:start -->
---

#### 一.Node是什么?

Node.js是一个基于 Chrome V8 引擎的JavaScript运行环境(runtime),Node不是一门语言是让js运行在后端的运行时,并且不包括javascript全集,因为在服务端中不包含DOM和BOM,Node也提供了一些新的模块例如http,fs模块等。Node.js 使用了事件驱动、非阻塞式 I/O 的模型，使其轻量又高效并且Node.js 的包管理器 npm，是全球最大的开源库生态系统。事件驱动与非阻塞IO后面我们会一一介绍。到此我们已经对node有了简单的概念。

#### 二.Node解决了哪些问题?

Node在处理高并发,I/O密集场景有明显的性能优势

- 高并发,是指在同一时间并发访问服务器
- I/O密集指的是文件操作、网络操作、数据库,相对的有CPU密集,CPU密集指的是逻辑处理运算、压缩、解压、加密、解密

> Web主要场景就是接收客户端的请求读取静态资源和渲染界面,所以Node非常适合Web应用的开发。

#### 三.JS单线程

javascript在最初设计时设计成了单线程,为什么不是多线程呢？如果多个线程同时操作DOM那岂不会很混乱？这里所谓的单线程指的是主线程是单线程的,所以在Node中主线程依旧是单线程的。

- 单线程特点是节约了内存,并且不需要在切换执行上下文
- 而且单线程不需要管锁的问题.

#### 四.同步异步和阻塞非阻塞

- 同步就是在执行某段代码时，代码没有得到返回之前，其他代码无法执行，当得到了返回值后可以继续执行其他代码。
- 异步就是在执行某段代码时，代码不会立即得到返回结果，可以继续执行其他代码，返回值通过回调来获取

![node_1](img/node_1.png)

#### 五.Node中的Event Loop

![node_2](img/node_2.png)

- 1.我们写的js代码会交给v8引擎进行处理
- 2.代码中可能会调用nodeApi,node会交给libuv库处理
- 3.libuv通过阻塞i/o和多线程实现了异步io
- 4.通过事件驱动的方式,将结果放到事件队列中,最终交给我们的应用。

```text
   本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
   ┌───────────────────────────┐
┌─>│           timers          │ 
│  └─────────────┬─────────────┘
|   执行延迟到下一个循环迭代的 I/O 回调。
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
|   仅系统内部使用。
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      
|  检索新的I/O事件;执行与 I/O相关的回调  ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  setImmediate() 回调函数在这里执行。  └───────────────┘
│  ┌─────────────┴─────────────┐      
│  │           check           │
│  └─────────────┬─────────────┘
|  一些关闭的回调函数
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  
   └───────────────────────────┘
```

> 这里每一个阶段都对应一个事件队列,当event loop执行到某个阶段时会将当前阶段对应的队列依次执行。当该队列已用尽或达到回调限制，事件循环将移动到下一阶段。

> `process.nextTick()` 从技术上讲不是事件循环的一部分。优先级高于微任务

**poll阶段:**

1.检测Poll队列中是否为空，如果不为空则执行队列中的任务，直到超时或者全部执行完毕。

2.执行完毕后检测setImmediate队列是否为空，如果不为空则执行check阶段，如果为空则等待时间到达。时间到达后回到timer阶段

3.等待时间到达是可能会出现新的callback，此时也在当前阶段被清空

#### 六.Node中全局对象

>注：在浏览器中的this指代的是window，而在node服务端中指代的是global。但在js文件中访问this时，输出的是空对象，原因是在文件中访问中内部被更改了，不是global而是module.exports
>
>例如
>
>```js
>//1.js
>console.log(this) //{}
>function a (){
>console.log(this)//global
>}
>a();
>```

>全局变量是直接在文件中不声明就可以直接访问的变量，但是在global上的属性叫全局变量

- Buffer

  ```js
  
  ```

- process [进程]

  >比较常用的属性：platform chdir cwd env argv nextTick ...

  + platform ：可以根据不同平台读取系统文件

  ```js
  console.log(process.platform) //win32 (windows)  drawin (Linux)
  ```

  + cwd : 可以获取当前执行node命令的目录 `current working direction`

  ```js
  console.log(process.cwd())//sers/tomato/Desktop/test/5.node
  ```

  + chdir : 一般用不到，用途是用于更改`current working direction`的目录

  ```js
  //需要先创建a文件夹
  console.log(process.cwd()) // /Users/tomato/Desktop/test/5.node
  console.log(process.chdir('a')) // undefined
  console.log(process.cwd()) // /Users/tomato/Desktop/test/5.node/a
  ```

  + env : 获取当前系统的环境变量，`根据不同的环境变量做配置`

  ```js
  console.log(process.env)
  
  //当前系统的环境变量
  {
    SHELL: '/bin/zsh',
    TMPDIR: '/var/folders/hh/6s1lj7w56bddhqx150p_7pzr0000gn/T/',
    ORIGINAL_XDG_CURRENT_DESKTOP: 'undefined',
    USER: 'tomato',
   	...
    HOME: '/Users/tomato',
   	...
    VSCODE_PID: '8876',
    VSCODE_CWD: '/'
  }
  
  //windows下命令为 set xxx = xxx
  //liunx下命令为export xxx = xxx
  //npm中有一个模块包cross-env用于设置环境变量（不区分操作系统）
  
  //常用于区分开发环境和生产环境 [NODE_ENV是我们自己起的属性名称]
  if(process.env.NODE_ENV === 'production'){
    console.log('生产环境')
  }else{
    console.log('开发环境')
  }
  ```

  + argv ：运行代码时传入的参数

  ```js
  console.log(process.argv)
  [
    '/usr/local/bin/node', //这个指代的是：node的执行文件node.exe(windows)
    '/Users/tomato/Desktop/test/5.node/tempCodeRunnerFile.js'// 第二个指代的是：执行的谁
  ]
  
  node xx.js --port 3000 --config xx.js
  console.log(process.argv)
  [
    '/usr/local/bin/node',
    '/Users/tomato/Desktop/test/5.node/tempCodeRunnerFile.js',
  	'--port',
  	'3000',
  	'--config',
  	'xx.js'
  ]
  
  console.log(process.argv.slice(2))
  [
  	'--port',
  	'3000',
  	'--config',
  	'xx.js'
  ]
  
  //一般获取到参数都会转变成键值对的形式
  let config = process.argv.slice(2).reduce((memo,current,index,arr) => {
    if(current.startWith('--')){
      memo[current.slice(2)] = arr[index + 1];
    }
    return memo
  })
  console.log(config)
  //==> {port:3000,config:xx.js}
  ```

  + nextTick：当前同步代码执行完毕之后立即调用

  ```js
  process.nextTick(()=> {console.log('nextTick')}) // nextTick
  //微任务
  ```

  + Commander	

    >这个包是第三方模块，可以用来解析用户传入的参数
    >
    >1.安装模块时都需要初始化一下项目 npm init -y
    >
    >2.安装对应的npm install commander

  ```js
  //用法
  const program = require('commander');
  program.name('test');
  program.usage('[options]');
  program.option('-p --port <v>', 'set server port');
  program.parse(process.argv);
  console.log(program.port)
  ```

##### 总结

- 适合i/o密集型 异步非阻塞，通过事件来通知 libuv 用多线程来模拟异步 (不适合做cpu密集型)
- 全局变量 require exports module __dirname __filename 不是全局的但是可以直接访问
- process env/argv/cwd()/nextTick

- setInterval,setTimeout,setImmediate
- console
- queueMicrotask

#### 七.node中的模块

> 模块规范有哪些？为什么有这些规范？
>
> 1.开发时会有命名冲突的问题
>
> 解决方法：
>
> 1.命名空间防止冲突（缺点：调用时不方便：例如obj_xxx_12345678.xxx();）[不流行了]
> 2.IIFE自执行方式实现模块化，例如：function(){xxx}();。但是前端中还有ajax请求等处理，也是不太方便。[seajs:CMD requirejs:AMD] 这两个是以前的方案，现在也已经不流行了。现在前端流行的两个处理方案是：
>
> es6Module 、 commonJs规范 、 umd统一模块、或者还有amd模块
>
> 但在实际使用中还是以 es6Module 、 commonJs规范 为主

>es6Module规范： import 跟 export [浏览器的ES6语法]
>
>commonJs规范：require 跟 module.exports [node环境中使用的语法，在node环境中是不能使用浏览器的ES6规范的，如果想在node中使用ES6模块，需要使用Babel进行编译]

>commonjs规范定义：
>
>1.每一个文件都是一个模块
>
>2.要通过module.exports导出需要给别人使用的结果
>
>3.使用前需要导入对应的模块
>
>另外在node模块中，划分了几类模块：
>
>1.核心模块，例如fs模块等内置模块
>
>2.require (xxx)，文件模块，自定义的模块
>
>3.第三方模块，即需要安装的模块

- __dirname

- __filename

- exports

- module

- require()

- 内置模块

  - fs

  ```js
  const fs = require('fs');//一般有两种方法，一种是同步的，另一种是异步的
  const result = fs.readFileSync('./note.md','utf8')
  console.log(result)
  ```

  - path

  ```js
  const path = require('path'); //处理路径
  //传入相对路径，返回一个绝对路径
  console.log(path.resolve(__dirname,'note.md')) //xxxxx\5.node\note.md
  
  //path.resolve('note.md') 返回的是当前工作目录，即默认解析的路径是以process.cwd()的路径。该路径可以用chdir去更改；
  console.log(path.resolve(__dirname,'note.md','a'))
  //xxxxx\5.node\note.md\a
  
  //拼接功能
  console.log(path.join('a','b')) //a\b
  
  
  //join跟resolve的对比
  console.log(path.resolve(__dirname,'note.md','a')) //xxxxx\5.node\note.md\a
  console.log(path.join(__dirname,'note.md','a')) //xxxxx\5.node\note.md\a
  //得到的结果是一样的，但是两者之间还是有区别的
  //1.如果遇到带/的路径，resolve会认为这是根路径，而join则是拼接在一起
  console.log(path.resolve(__dirname,'note.md','/')) //c:\
  console.log(path.join(__dirname,'note.md','/')) //xxxxx\5.node\note.md\
  
  
  
  //取文件的拓展名
  console.log(path.extname('a.min.js')) //.js
  
  //相对路径 -- 即去掉相同的部分
  console.log(path.relative('a','a/a.js')) //a.js
  
  //获取当前的工作目录
  //__dirname= path.dirname 
  console.log(path.dirname(__dirname)) //c:\\users\test1\Desktop\2020-promise
  ```

  - vm

  ```js
  //vm 虚拟机模块
  
  
  //拓展
  let a = 1;
  let log = 'console.log(a)'
  eval(log) //1 
  //eval执行时会查找上下文
  
  let a = 1;
  const log  = 'console.log(a)';
  let fn = new Function(log);
  console.log(fn)
  
  //function anonymous(
  //) {
  //console.log(a)
  //}
  
  console.log(fn()) // 报错，a is undefined
  
  
  //使用vm也可以达到类似new Function 的作用
  
  const vm = require('vm');
  let a = 1;
  const log = `console.log(a)`;
  //让字符串直接执行，并且在一个沙箱环境中执行
  vm.runInThisContext(log); //a is not defined;
  ```

  

- commonjs规范

```js
//a.js
module.exports = 'hello';

//usea.js
require('./a');

//require中可以存放相对路径或者绝对路径。默认可以省略.js .json文件后缀名
```

```js
//a.js
module.exports = 'hello';

//usea.js
let r = require('./a');
console.log(r) //hello
```

是怎么实现以上的原理呢？另外webpack的实现原理也一样

>1.先去读取a文件，拿到a文件中的内容。然后进行函数的包裹module.exports = 'hello';
>
>2.让函数执行，并传入`exports,module,require,__dirname,__filename`这些参数（使用vm让函数执行）
>
>```js
>function (exports,module,require,__dirname,__filename){
>module.exports = 'hello';
>return module.exports
>}(exports,module,require,__dirname,__filename)
>```
>
>

调试node代码

>1.在控制台使用命令`node --inspect-brk 文件名`，后在浏览器输入`chrome://inspect	`
>
>2.vscode 调试：在vscode左侧的三角箭头处，点击然后选择node.js环境，调试源码之前必须创建一个json文件（即在vscode左侧的三角箭头上方有一个创建launch.json文件，然后注释掉`skipFiles`字段，最后再点击启动程序，然后就可以在对应的文件里面打断点进行调试）
>
>```js
>{
>// 使用 IntelliSense 了解相关属性。 
>// 悬停以查看现有属性的描述。
>// 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
>"version": "0.2.0",
>"configurations": [
>{
> "type": "pwa-node",
> "request": "launch",
> "name": "Launch Program",
> "skipFiles": [
>   "<node_internals>/**"
> ],
> "program": "${workspaceFolder}/1.js"
>}
>]
>}
>//注释掉后的样子
>{
>"version": "0.2.0",
>"configurations": [
>{
> "type": "pwa-node",
> "request": "launch",
> "name": "Launch Program",
> // "skipFiles": [
> //   "<node_internals>/**"
> // ],
> "program": "${workspaceFolder}/1.js"
>}
>]
>}
>```

+ 实现自己的commonjs 规范

  + 1.解析当前的文件名 --- let filename = Module._resolveFilename(filename)

  ```js
  //引入需要使用到的node模块
  const path = require('path');
  const fs = require('fs');
  const vm = require('vm');
  
  //Module类
  function Module() {
  //...
  }
  //Module上的静态方法
  Module._resolveFilename = function (filename) {
    //判断文件名称是否存在，如果存在则直接返回，反之则解析出对应的文件后缀名称
    let filepath = path.resolve(__dirname, filename); //解析是以当前目录的，所以是__dirname
    //判断路径是否存在
    let isExists = fs.existsSync(filepath);
    if(isExists) return filepath;
    //...
  }
  function myRequire(filename) {
    //把filename转化为绝对路径 --- Module._resolveFilename : 解析出绝对路径并添加后缀
    filename = Module._resolveFilename(filename);
    console.log(filename)///Users/tomato/Desktop/test/5.node/a.json
  }
  let r = myRequire('./a.json');
  ```

  + 2.给js文件跟json文件添加解析策略 --- Module.__extensions

  ```js
  //步骤：
  //1.解析当前的文件名 --- let filename = Module._resolveFilename(filename)
  //2.给js文件跟json文件添加解析策略 --- Module.__extensions
  
  
  //引入需要使用到的node模块
  const path = require('path');
  const fs = require('fs');
  const vm = require('vm');
  //Module类
  function Module() {
  }
  //策略
  Module.__extensions = {};
  Module.__extensions['.js'] = function (){};
  Module.__extensions['.json'] = function (){};
  //Module上的静态方法
  Module._resolveFilename = function (filename) {
    //判断文件名称是否存在，如果存在则直接返回，反之则解析出对应的文件后缀名称
    let filePath = path.resolve(__dirname, filename); //解析是以当前目录的，所以是__dirname
    //判断路径是否存在
    let isExists = fs.existsSync(filePath);
    if(isExists) return filePath;
    //给js文件跟json文件添加对应的策略
    let keys = Reflect.ownKeys(Module.__extensions); //这里使用for循环而不是使用forEach，是因为for可以使用return停止循环，而forEach不可以
    // console.log(keys);
    for(let i = 0; i < keys.length; i++){
      //拿到后缀之后跟文件的路径进行拼接
      let newFile = filePath + keys[i];
      if(fs.existsSync(newFile)) return newFile;
    }
    //for循环之后还是找不到该文件，则抛出错误
    throw new Error('module not found')
  
  }
  function myRequire(filename) {
    //把filename转化为绝对路径 --- Module._resolveFilename : 解析出绝对路径并添加后缀
    filename = Module._resolveFilename(filename);
    console.log(filename)///Users/tomato/Desktop/test/5.node/a.json
  }
  let r = myRequire('./a');\
  ```

  + 3.json文件的处理策略

  ```js
  //简单地实现自己的commonjs规范去读取文件
  
  //1.去读json文件是读取整个文件的内容，例如json文件是一个{name:1}，读取出来的也是这个对象。而读取js文件则不是。则是读取module.exports = xxx 的内容
  //2.require('./a')，此时如果同时存在a.js文件跟a.json文件。会有一个优先级问题，会优先读取js，其次再是读取json文件
  
  
  
  //步骤：
  //1.解析当前的文件名 --- let filename = Module._resolveFilename(filename)
  //2.给js文件跟json文件添加解析策略 --- Module.__extensions
  //3.创建模块 new Module()
  
  
  //引入需要使用到的node模块
  const path = require('path');
  const fs = require('fs');
  const vm = require('vm');
  
  
  //Module类
  function Module(filename) {
    this.id = filename; //文件名称
    this.exports = {}; //代表导出结果
    this.path = path.dirname(filename); //路径
  
  }
  //策略
  Module.__extensions = {};
  Module.__extensions['.js'] = function () { };
  Module.__extensions['.json'] = function (module) { 
    let content = fs.readFileSync(module.id,'utf8'); //此处拿到的是一个字符串json对象
    module.exports = JSON.parse(content);
  };
  
  //Module上的静态方法
  Module._resolveFilename = function (filename) {
    //判断文件名称是否存在，如果存在则直接返回，反之则解析出对应的文件后缀名称
    let filePath = path.resolve(__dirname, filename); //解析是以当前目录的，所以是__dirname
    //判断路径是否存在
    let isExists = fs.existsSync(filePath);
    if (isExists) return filePath;
    //给js文件跟json文件添加对应的策略
    let keys = Reflect.ownKeys(Module.__extensions); //这里使用for循环而不是使用forEach，是因为for可以使用return停止循环，而forEach不可以
    // console.log(keys);
    for (let i = 0; i < keys.length; i++) {
      //拿到后缀之后跟文件的路径进行拼接
      let newFile = filePath + keys[i];
      if (fs.existsSync(newFile)) return newFile;
    }
    //for循环之后还是找不到该文件，则抛出错误
    throw new Error('module not found')
  
  }
  Module.prototype.load = function (params) {
    //加载时需要获取文件的后缀名，根据后缀名采用不同策略进行加载
    let extension = path.extname(this.id);
    //console.log(extension);
    //根据不同的策略进行加载
    Module.__extensions[extension](this);
  }
  function myRequire(filename) {
    //1.把filename转化为绝对路径 --- Module._resolveFilename : 解析出绝对路径并添加后缀
    filename = Module._resolveFilename(filename);
    //2.创建模块
    let module = new Module(filename);
    //3.读取文件加载模块
    module.load(); //
    return module.exports;
  }
  
  let r = myRequire('./a');
  console.log(r) //{ name: '111' }
  ```

  + 4.js文件的处理策略 【模块中的this是module.exports】

  ```js
  //简单地实现自己的commonjs规范去读取文件
  
  //1.去读json文件是读取整个文件的内容，例如json文件是一个{name:1}，读取出来的也是这个对象。而读取js文件则不是。则是读取module.exports = xxx 的内容
  //2.require('./a')，此时如果同时存在a.js文件跟a.json文件。会有一个优先级问题，会优先读取js，其次再是读取json文件
  
  //步骤：
  //1.解析当前的文件名 --- let filename = Module._resolveFilename(filename)
  //2.给js文件跟json文件添加解析策略 --- Module.__extensions
  //3.创建模块 new Module()
  //4.根据json文件跟js文件去读取文件中的内容
  
  //引入需要使用到的node模块
  const path = require('path');
  const fs = require('fs');
  const vm = require('vm');
  
  
  //Module类
  function Module(filename) {
    this.id = filename; //文件名称
    this.exports = {}; //代表导出结果
    this.path = path.dirname(filename); //路径
  
  }
  //策略
  Module.__extensions = {};
  Module.wrapper = (content) => {
    return `(function(exports,require,module,__filename,__dirname){${content}})`
  }
  Module.__extensions['.js'] = function (module) {
    let content = fs.readFileSync(module.id, 'utf8');
    //由于js文件，需要去执行文件里的代码，然后拿到module.exports = xxx的内容。
    //所以要拿到内容去包裹一个函数
    let str = Module.wrapper(content);
    //让获取的到str 字符串内容变成函数执行
    let fn = vm.runInThisContext(str);
    //console.log(str)
    let exports = module.exports;
    //让函数执行
    fn.call(exports, exports, myRequire, module, module.id, module.path);
    //上面的代码执行相当于这样的结果 module.exports = 'hello';
    
  };
  Module.__extensions['.json'] = function (module) {
    let content = fs.readFileSync(module.id, 'utf8'); //此处拿到的是一个字符串json对象
    module.exports = JSON.parse(content);
  };
  
  //Module上的静态方法
  Module._resolveFilename = function (filename) {
    //判断文件名称是否存在，如果存在则直接返回，反之则解析出对应的文件后缀名称
    let filePath = path.resolve(__dirname, filename); //解析是以当前目录的，所以是__dirname
    //判断路径是否存在
    let isExists = fs.existsSync(filePath);
    if (isExists) return filePath;
    //给js文件跟json文件添加对应的策略
    let keys = Reflect.ownKeys(Module.__extensions); //这里使用for循环而不是使用forEach，是因为for可以使用return停止循环，而forEach不可以
    // console.log(keys);
    for (let i = 0; i < keys.length; i++) {
      //拿到后缀之后跟文件的路径进行拼接
      let newFile = filePath + keys[i];
      if (fs.existsSync(newFile)) return newFile;
    }
    //for循环之后还是找不到该文件，则抛出错误
    throw new Error('module not found')
  
  }
  Module.prototype.load = function (params) {
    //加载时需要获取文件的后缀名，根据后缀名采用不同策略进行加载
    let extension = path.extname(this.id);
    //console.log(extension);
    //根据不同的策略进行加载
    Module.__extensions[extension](this);
  }
  function myRequire(filename) {
    //1.把filename转化为绝对路径 --- Module._resolveFilename : 解析出绝对路径并添加后缀
    filename = Module._resolveFilename(filename);
    //2.创建模块
    let module = new Module(filename);
    //3.读取文件加载模块
    module.load(); //
    return module.exports;
  }
  
  let r = myRequire('./a');
  console.log(r)
  ```

  + 添加缓存策略 - 解决多次引入重复执行的问题（作用）

  ```js
  //简单地实现自己的commonjs规范去读取文件
  
  //1.去读json文件是读取整个文件的内容，例如json文件是一个{name:1}，读取出来的也是这个对象。而读取js文件则不是。则是读取module.exports = xxx 的内容
  //2.require('./a')，此时如果同时存在a.js文件跟a.json文件。会有一个优先级问题，会优先读取js，其次再是读取json文件
  
  
  
  //步骤：
  //1.解析当前的文件名 --- let filename = Module._resolveFilename(filename)
  //2.给js文件跟json文件添加解析策略 --- Module.__extensions
  //3.创建模块 new Module()
  
  
  //引入需要使用到的node模块
  const path = require('path');
  const fs = require('fs');
  const vm = require('vm');
  
  
  //Module类
  function Module(filename) {
    this.id = filename; //文件名称
    this.exports = {}; //代表导出结果
    this.path = path.dirname(filename); //路径
  
  }
  //缓存
  Module.__cache = {}
  //策略
  Module.__extensions = {};
  Module.wrapper = (content) => {
    return `(function(exports,require,module,__filename,__dirname){${content}})`
  }
  Module.__extensions['.js'] = function (module) {
    let content = fs.readFileSync(module.id, 'utf8');
    //由于js文件，需要去执行文件里的代码，然后拿到module.exports = xxx的内容。
    //所以要拿到内容去包裹一个函数
    let str = Module.wrapper(content);
    //让获取的到str 字符串内容变成函数执行
    let fn = vm.runInThisContext(str);
    //console.log(str)
    let exports = module.exports;
    //让函数执行
    fn.call(exports, exports, myRequire, module, module.id, module.path);
    //上面的代码执行相当于这样的结果 module.exports = 'hello';
  
  };
  Module.__extensions['.json'] = function (module) {
    let content = fs.readFileSync(module.id, 'utf8'); //此处拿到的是一个字符串json对象
    module.exports = JSON.parse(content);
  };
  
  //Module上的静态方法
  Module._resolveFilename = function (filename) {
    //判断文件名称是否存在，如果存在则直接返回，反之则解析出对应的文件后缀名称
    let filePath = path.resolve(__dirname, filename); //解析是以当前目录的，所以是__dirname
    //判断路径是否存在
    let isExists = fs.existsSync(filePath);
    if (isExists) return filePath;
    //给js文件跟json文件添加对应的策略
    let keys = Reflect.ownKeys(Module.__extensions); //这里使用for循环而不是使用forEach，是因为for可以使用return停止循环，而forEach不可以
    // console.log(keys);
    for (let i = 0; i < keys.length; i++) {
      //拿到后缀之后跟文件的路径进行拼接
      let newFile = filePath + keys[i];
      if (fs.existsSync(newFile)) return newFile;
    }
    //for循环之后还是找不到该文件，则抛出错误
    throw new Error('module not found')
  
  }
  Module.prototype.load = function (params) {
    //加载时需要获取文件的后缀名，根据后缀名采用不同策略进行加载
    let extension = path.extname(this.id);
    //console.log(extension);
    //根据不同的策略进行加载
    Module.__extensions[extension](this);
  }
  function myRequire(filename) {
    //1.把filename转化为绝对路径 --- Module._resolveFilename : 解析出绝对路径并添加后缀
    filename = Module._resolveFilename(filename);
    //5.判断是否存在缓存
    if(Module.__cache[filename]){
      return Module.__cache[filename].exports;
    }
    //2.创建模块
    let module = new Module(filename);
    //4.添加缓存
    Module.__cache[filename] = module;
    //3.读取文件加载模块
    module.load(); //
    return module.exports;
  }
  
  let r = myRequire('./a');
  myRequire('./a');
  myRequire('./a');
  myRequire('./a');
  myRequire('./a');
  myRequire('./a');
  console.log(r)
  ```

  + node中文件的查找规范

  ```js
  require('./a');
  //1.在平时开发中，我们尽量要保证引入的js文件跟文件夹不要重名。
  //2.查找规则：默认会先查找js文件。找不到js，再找json文件，如果找不到json文件，则找同名的文件夹中的package.json文件中的main字段对应的结果，如果没有则才找文件夹中的index.js文件。
  //3.如果没有以上三中结果则会查找当前文件夹中的node_modules文件夹，如果当前的node_modules文件夹也找不到，则会向上继续查找，直到根目录为止。最后找不到才报错
  
  
  
  //package.json 是文件夹的描述文件。一般require('./a')没有存在js跟json文件，则找同名的文件夹中的index.js，如果我们想改变这个默认规范，则可以在文件夹中新建package.json文件在其中新增一个main:'a.js',则默认查找a/a.JS文件
  ```

  + 总结

  ```js
  //1.模块导出不能使用export = xxx 错误的写法
  //2.正确的写法是 exports.a module.exports.a module.exports 
  //3.esModule规范 导出文件的内部变量发生变化，在引入文件时会采用最新的值（而commonjs规范则不会）import a from './a'。另外commonjs规范导出的是一个值，而esModule规范导出的是一个"变量"
  //4.esModule不能放在代码块中，只能放在顶层作用域中。
  
  ```

+ npm

  + 基本用法

  >1.包是由多个模块组成的（即在node中每个js都是一个模块）
  >
  >2..npm init -y 表示要初始化一个package.json文件【包的信息文件，文件里面不可以写注释：因为是json文件】  
  >
  >3.包分为全局包和本地包 代码中使用的都是本地包，全局包只能在命令行中使用
  >
  >4.nrm : node registry manger【node的源管理工具】
  >
  >5.npm之所以能够直接使用是因为npm放到了path目录下，其他安装的全局包都在npm下。所以可以直接当成全局命令来执行（通过映射关系映射到对应的地址）
  >
  >6.npm link ：把当前模块临时放到npm上，方便临时调用跟调试
  >
  >7.自己编写自己的全局包，全局包必须在对应的目录下中的package.json文件中增加bin字段，会通过配置做软链接【其次还需要在对应的文件中增加 #! /usr/bin/env node 表示使用node环境执行】

  + 安装模块 【第三方模块】

  >1.依赖方式：
  >
  >1)开发依赖【也就是在开发环境中才需要使用的模块，例如webpack】
  >
  >2)项目依赖【也就是开发跟项目上生产时都需要的模块，例如vue...】
  >
  >3)同版本依赖
  >
  >4）捆绑依赖
  >
  >5）可选依赖

  >2.安装方式：
  >
  >1）安装开发依赖：例如安装webpack需要加--save -dev或者-D `npm install webpack --save-dev` 或者 `npm install webpack -D` 【注意，此处的webpack为什么不安装成全局的模式呢？因为是每个项目的webpack版本都不一样，不兼容】
  >
  >2）安装项目依赖：`npm install jquery -S` 或者 新版本可以省略-S 直接不加`npm install jquery`
  >
  >3）删除对应的依赖：删除项目依赖`npm uninstall jquery -S`或者不加-S 删除开发依赖 `npm uninstall webpack -D`
  >
  >4）npm install 默认会安装所有的包，而npm install --production 只会安装项目依赖的包
  >
  >5）常见的版本号：正式版 【^2.0.0】(2.0.0代表的是 major minor patch) (^这个符号代表版本不能高于2或者低于2。)（～2.2.2 其中的～代表版本号开头必须以2.2开头，锁定前两位）
  >
  >alpha、beta、rc
  >
  >6）npm version major + git 可以实现版本管理

  + scripts + npx 

    + package.json文件中的scripts默认会将当前node_modules下的.bin目录放到全局下，只有在运行scripts或者npx 当前目录可以使用，运行完毕之后就会删除
    + npx比scripts的不同之处就是：nix mime a.js ，如果mime模块不存在则会先安装mime模块。安装之后mime模块会被删除，另外安装时是安装最新的包

  + 包的发布

    +  比较简单，自己参考网络上的即可

  + events模块（内置）

    >node是基于事件的，内部自己实现了一个发布订阅模式

  + 让一个类继承EventEmitter原型上的方法

    >1.每一个实例都有一个`__proto__`指向所属类（构造函数）的原型
    >
    >2.每个类都有一个prototype属性，上面有一个constructor属性指向类本身

    + `Object.create()`

    ```js
    //继承EventEmitter上的on方法
    const EventEmitter = require('events');
    function Girl(){}
    Girl.prototype = Object.create(EventEmitter.prototype);
    let girl = new Girl();
    console.log(girl.on) //[Function: addListener]
    ```

    + `Girl.prototype.__proto__= EventEmitter.prototype `

    ```js
    const EventEmitter = require('events');
    function Girl(){}
    //Girl.prototype = Object.create(EventEmitter.prototype);
    Girl.prototype.__proto__ = EventEmitter.prototype 
    let girl = new Girl();
    console.log(girl.on)//[Function: addListener]
    ```

    + Object.setPrototypeOf

    ```js
    const EventEmitter = require('events');
    function Girl(){}
    //Girl.prototype = Object.create(EventEmitter.prototype);
    //Girl.prototype.__proto__ = EventEmitter.prototype 
    Object.setPrototypeOf(Girl.prototype,EventEmitter.prototype)
    let girl = new Girl();
    console.log(girl.on)//[Function: addListener]
    ```

    + extends  【es6 Class语法】
    + node中提供了一个util模块可以用于继承

    ```js
    const EventEmitter = require('events');
    const util = require('util');
    function Girl(){}
    //Girl.prototype = Object.create(EventEmitter.prototype);
    //Girl.prototype.__proto__ = EventEmitter.prototype 
    // Object.setPrototypeOf(Girl.prototype,EventEmitter.prototype)
    util.inherits(Girl,EventEmitter); //继承原型上的方法，实现的原理还是基于Object.setPrototypeOf()
    let girl = new Girl();
    console.log(girl.on)
    ```

    + on / emit

    ```js
    const EventEmitter = require('events');
    const util = require('util');
    function Girl(){}
    util.inherits(Girl,EventEmitter);
    let girl = new Girl();
    girl.on('doHandle',()=>{
      console.log('cry')
    })
    girl.on('doHandle',()=>{
      console.log('eat')
    })
    girl.emit('doHandle')
    
    //cry
    //eat
    ```

    + once 【只触发一次】

    ```js
    const EventEmitter = require('events');
    const util = require('util');
    function Girl() { }
    util.inherits(Girl, EventEmitter);
    let girl = new Girl();
    girl.once('doHandle', () => {
      console.log('cry')
    })
    let eat = () => {
      console.log('eat')
    }
    girl.on('doHandle', eat)
    girl.off('doHandle', eat)
    girl.emit('doHandle');
    girl.emit('doHandle')
    //cry
    ```

    

    + off

    ```js
    const EventEmitter = require('events');
    const util = require('util');
    function Girl() { }
    util.inherits(Girl, EventEmitter);
    let girl = new Girl();
    girl.on('doHandle', () => {
      console.log('cry')
    })
    let eat = () => {
      console.log('eat')
    }
    girl.on('doHandle', eat)
    girl.off('doHandle', eat)
    girl.emit('doHandle')
    //cry
    
    ```

    + newListener - 用来监听用户绑定了哪些事件的

    ```js
    const EventEmitter = require('events');
    const util = require('util');
    function Girl() { }
    util.inherits(Girl, EventEmitter);
    let girl = new Girl();
    girl.on('newListener',(type) => {
      console.log(type)
      //doHandle
    	//doHandle
    })
    girl.once('doHandle', () => {
      console.log('cry')
    })
    let eat = () => {
      console.log('eat')
    }
    girl.on('doHandle', eat)
    girl.off('doHandle', eat)
    girl.emit('doHandle');
    girl.emit('doHandle')
    
    ```

    + on事件传参数

    ```js
    const EventEmitter = require('events');
    const util = require('util');
    function Girl() { }
    util.inherits(Girl, EventEmitter);
    let girl = new Girl();
    girl.on('newListener',(type) => {
      console.log(type)
      //doHandle
    	//doHandle
    })
    girl.once('doHandle', (a,b,c) => {
      console.log('cry') //cry 1 2 3
    })
    let eat = () => {
      console.log('eat')
    }
    girl.on('doHandle', eat)
    girl.off('doHandle', eat)
    girl.emit('doHandle',1,2,3);
    girl.emit('doHandle')
    ```

  + 自己实现发布订阅

  ```js
  function EventEmitter() {
    this._events = {}
  }
  
  EventEmitter.prototype.on = function (eventName, callback) {
    if (!this._events) {
      this._events = Object.create(null);
    }
    if(eventName !== 'newListener'){
      this.emit('newListener',eventName)
    }
    if (this._events[eventName]) {
      this._events[eventName].push(callback)
    } else {
      this._events[eventName] = [callback]
    }
  
  }
  EventEmitter.prototype.emit = function (eventName, ...args) {
    if (!this._events) return
    if (this._events[eventName]) {
      this._events[eventName].forEach(fn => fn(...args))
    }
  }
  
  EventEmitter.prototype.off = function (eventName, callback) {
    if (!this._events) return
    this._events[eventName] = this._events[eventName].filter(fn => ((fn !== callback) && (fn.l !== callback)))
  }
  EventEmitter.prototype.once = function (eventName, callback) {
    const once = (...args) => {
      callback(...args);
      this.off(eventName, once)
    }
    once.l = callback; // 用来标识这个once是谁的
    this.on(eventName, once)
  }
  
  module.exports = EventEmitter;
  ```

#### 八.node中的buffer类型

+ 前端实现文件下载

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    //前端实现文件下载 【前端没有读取或者写入文件的操作，只有html5之后才提供了读取的操作】
    let str = '<div>hello world</div>';
    const blob = new Blob([str],{ //把字符串'<div>hello world</div>' 转化成二进制的文件格式
      type:'text/html'
    })
    const a = document.createElement('a');
    a.setAttribute('download','index.html');
    a.href = URL.createObjectURL(blob); //URL window下的属性 createObjectURL临时创建一个链接
    a.click();
    //URL.revokeObjectURL 是释放掉上面临时创建的链接
  </script>
</body>
</html>
```

+ 前端可以通过html5实现文件二进制的读取 - 异步的方式 不推荐

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <input type="file" id="avatar" multiple>
  <script>
    //前端可以通过html5 实现二进制的读取 
    //例如上传头像的预览功能
    avatar.addEventListener('change',(e) => {
      let file = e.target.files[0];
      console.log(file);
      //h5的一个类 FileReader
      let fileReader = new FileReader(); //new FileReader IE9+以上才支持
      //这种方式是异步的，一般不推荐。可以采用同步的方式
      fileReader.onload = function(){
        //加载完之后，预览图片
        let img = document.createElement('img');
        img.src = fileReader.result;
        document.body.appendChild(img); //base64格式的url
      }
      fileReader.readAsDataURL(file); //这个方法就是把文件转换成base64的格式
    })
  </script>
</body>
</html>
```

同步的方式 - 更优雅一些，兼容性也更好一些

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <input type="file" id="avatar" multiple>
  <script>
     //同步的方式
    avatar.addEventListener('change',(e) => {
      let file = e.target.files[0];
      let img = document.createElement('img');
      img.src = URL.createObjectURL(file)
      //这里没有把文件的内容读取出来，而是直接展示
      document.body.appendChild(img) //不是base64格式的url
    })
  </script>
</body>
</html>

//立即释放掉
 avatar.addEventListener('change',(e) => {
      let file = e.target.files[0];
      let img = document.createElement('img');
      let url = URL.createObjectURL(file);
      img.src = url;
      //这里没有把文件的内容读取出来，而是直接展示
      document.body.appendChild(img) //不是base64格式的url
      URL.revokeObjectURL(url); //这里就会导致图片在浏览器上预览不了，因为立即释放掉了
    })
```

大文件的断点续传 是采用 bolb + formData + slice 实现的

+ buffer  可以理解为成是前端的二进制 

```js
const arrayBuffer = new ArrayBuffer(4);
console.log(arrayBuffer)
byteLength: 4
[[Prototype]]: ArrayBuffer
byteLength: （…）
constructor: ƒ ArrayBuffer()
slice: ƒ slice()
Symbol(Symbol.toStringTag): "ArrayBuffer"
get byteLength: ƒ byteLength()
[[Prototype]]: Object
[[Int8Array]]: Int8Array(4)
[[Uint8Array]]: Uint8Array(4)
[[Int16Array]]: Int16Array(2)
[[Int32Array]]: Int32Array(1)
[[ArrayBufferByteLength]]: 4
[[ArrayBufferData]]: 650
```

+ 经典的面试题

```js
0.1 + 0.2 != 0.3

//计算的时候都是转成二进制进行计算的

//小数转化成2进制：乘以2取余值
0.1 * 2 = 0.2 0
0.2 * 2 = 0.4 0
0.4 * 2 = 0.8 0
0.8 * 2 = 1.6 1 0.6
0.6 * 2 = 1.2 1 0.2
0.2 * 2 = 0.4 0 0.4
...无限循环，所以计算机在有限的地址内存中表示它，在具体的某一位上给四舍五入了。所以导致0.1 + 0.2 要大于0.3
//解决办法：转化成整数之后再进行计算即可，或者直接利用插件库
```

+ base64 - 指64个字符

```js
//1.base64是如何转化出来的？
//2.base64的作用 ： 数据传递（由于中文跟特殊字符没办法传递，所以才使用base64进行传递）和 替代URL

//node 不支持gbk 只支持utf8
let r = Buffer.from('珠');
console.log(r) // e7 8f a0 一个汉字是由三个字节（一个字节8个位）组成 3 * 8
//将3*8转化成二进制
console.log(0xe7.toString(2));
console.log(0x8f.toString(2));
console.log(0xa0.toString(2));
//11100111
//10001111
//10100000

//111001 111000 111110 100000 

//转成二进制
console.log(parseInt('111001',2)) //57
console.log(parseInt('111000',2)) //56
console.log(parseInt('111110',2)) //62
console.log(parseInt('100000',2)) //32

let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
str += str.toLocaleLowerCase();
str += '0123456789+/';

console.log(str[57] + str[56] + str[62] + str[32]); //54+g


//54+g 通过base64解码就可以获得'珠'汉字，所以base64没有加密功能，因为加密的方式大家都知道；



//实际开发中不需要以上那么复杂，node中的buffer有提供对应的api
  console.log(Buffer.from('珠').toString('base64')); //54+g


//应用场景：把一些icon小图标直接转为base64格式，这样就可以不用去请求这些资源了。但是有一个缺点，转为base64之后会导致比原来的体积大三分之一，大三分之一的原因是由之前的三个字节变为了四个字节
```

+ buffer的应用

```js
//服务器中可以操作二进制，Buffer可以和字符串任意转化
//1.Buffer的声明方式
//第一种
let buffer1  = Buffer.alloc(6); //表示声明一个6个字节的buffer 
console.log(buffer1) //<Buffer 00 00 00 00 00 00>
//buffer 固定大小，声明之后不能随意改变大小

//第二种
const buffer2  = Buffer.from('珠峰架构')
console.log(buffer2) //<Buffer e7 8f a0 e5 b3 b0 e6 9e b6 e6 9e 84>
console.log(buffer2.length) //12 buffer的长度是指字节的长度（一个汉字是三个字节）
console.log(buffer2.toString('utf8'))//珠峰架构 //不传参数，也会默认传utf8 

//第三种 不常用
const buffer3 = Buffer.from([1,2,3,4,100])
console.log(buffer3) //<Buffer 01 02 03 04 64>


//常见的进制
//二进制是以0b开头的
//八进制是0o开头
//十六进制是0x开头


//想修改buffer有哪些方式
//1，通过索引的方式去修改
const buffer4 = Buffer.from([1,2,3,4,100])
buffer4[1] = 100;
console.log(buffer4) //<Buffer 01 64 03 04 64>
//不可以随意向数组那样改变大小
buffer4[100] = 100;
console.log(buffer4) //<Buffer 01 64 03 04 64>


//想扩容buffer的大小，是无法更改的，
//1.但是可以通过再声明一个buffer空间将结果拷贝过去
const buffer5  = Buffer.from('珠峰')
const buffer6  = Buffer.from('架构')
let newBuffer = Buffer.alloc(12);
buffer5.copy(newBuffer,0,0,6);
buffer6.copy(newBuffer,6,0,6);
console.log(newBuffer) //<Buffer e7 8f a0 e5 b3 b0 e6 9e b6 e6 9e 84>

//2.拼接方法
let newBuffer1 = Buffer.concat([buffer5,buffer6]);
console.log(newBuffer1) //<Buffer e7 8f a0 e5 b3 b0 e6 9e b6 e6 9e 84>
```

+ 手动实现Buffer.copy 跟Buffer.concat方法

```js
Buffer.prototype.copy = function (targetBuffer,targetStart,sourceStart=0,sourceEnd = this.length) {
    for(let i = sourceStart; i< sourceEnd ;i++){
        targetBuffer[targetStart++] = this[i]
    }
}


Buffer.concat = function (bufferList, length = bufferList.reduce((a,b)=>a+b.length,0)) {
    let buf = Buffer.alloc(length);
    let offset = 0
    bufferList.forEach(bufItem => {
        bufItem.copy(buf,offset);
        offset += bufItem.length;
    });
    return buf.slice(0,offset)
}
```

+ 需要掌握Buffer的几个方法

```js
length  toString  concat   Buffer.isBuffer
```

##### 九.fs

>1.fs:fileSystem，和文件相关的方法包括文件和文件夹
>
>2.fs 里面的方法一般由两种类型：同步【async】 和 异步的方法
>
>3.在读取文件时，读取到的结果默认时buffer类型的

+ 1.读取文件

```js
const fs = require('fs');
const path = require('path');
//1.一般在使用fs模块时都会搭配path模块一起使用，因为需要获取文件的绝对路径 【相对路径会随着我们的工作路径变化而变化即：运行时是以process.cwd()去获取路径，可能会导致不同路径下运行结果不同】
// fs.readFile(path.resolve(__dirname,'note.md'),function(err,data) {
//   console.log(data) //<Buffer 74 65 73 74> buffer类型
// })

fs.readFile(path.resolve(__dirname,'note.md'),'utf8',function(err,data) {
  console.log(data) //test   加了utf8参数之后会转化为字符串格式 相当于 data.toString();
  console.log(data.toString());// test
})

// fs.readFile(path.resolve(__dirname,'test.png'),'utf8',function(err,data) {
//   console.log(data) //读取图片文件时采用utf8格式会乱码，采用base64格式则不会

// })
```

+ 2.拷贝文件

```js
//2.写入文件时会清空文件内容并以utf8的格式类型写入
fs.readFile(path.resolve(__dirname, 'test.png'), function (err, data) {
  fs.writeFile(path.resolve(__dirname, 'test1.png'), data, function (err, data) {
    console.log('copy')
  })
})
//假设读取的文件很大，会出现问题，因为读取的内容都会放到内存中，如果文件过大会浪费内存【浪费内存】。会导致淹没内存，所以大型文件不可以采用这种模式

//64k以上的文件做拷贝，就不建议使用readFile操作了 而是采用appendFile方法
```

+ stream 比较重要

  + 可读基本用法

  ```js
  //文件模块基于流模块进行了封装，封装了文件的可读流和可写流
  const fs = require('fs');
  const path = require('path')
  //内部是继承了stream模块，并且基于fs.open fs.read fs.close方法
  let rs = fs.createReadStream(path.resolve(__dirname,'test.text'),{
    flags:'r', //创建可读流的标识是r（读取文件）
    encoding:null, //编码默认是null。null表示的是buffer类型
    autoClose:true, //读取完毕之后自动关闭即调用fs.close方法
    start:0, // 第一个到第五个（跟数组类似）
    end:4,
    highWaterMark:2,//一共五个，一次读两个。
  });
  
  rs.on('open',function(fd){
    console.log(fd); //20
  })
  
  // rs.on('data',function(chunk){
  //   console.log(chunk)
  //   //<Buffer 31 32>
  //   //<Buffer 33 34>
  //   //<Buffer 35>
  //   console.log(chunk.toString())
  //   //12
  //   //34
  //   //5
  // })
  
  //1.采用字符串拼接的方法把结果拼接起来
  let str = '';
  rs.on('data',function(chunk){
    str += chunk
  })
  rs.on('end',function(){
    console.log(str)//12345
  })
  //采用字符串拼接会有一个问题，就是一个汉字是三个字节，但是定义每次只读取两个字节，这样拼接起来会导致汉字乱码
  
  //2.采用buffer类型进行拼接
  let str1 = [];
  rs.on('data',function(chunk){
    //控制读取的速率
    rs.pause(); // 暂停
    console.log(chunk)
    str1.push(chunk)
  })
  rs.on('end',function(){
    console.log(Buffer.concat(str1).toString())//12345
  })
  rs.on('close',function(){
    console.log('close')
  })
  //发布订阅模式中监听错误的方法
  rs.on('error',function(err){
    console.log(err)
  })
  
  setInterval(()=>{
    rs.resume();//恢复暂停
  },1000)
  //当fs是一个可读流时，有on('data'),on('end')方法。当fs为文件流时，则还会有open,close两个方法。另外on('error')是发布订阅模式中提供的
  ```

  + 手动实现可读流
  
  ```js
  const fs = require('fs');
  const EventEmitter = require('events')
  class ReadStream extends EventEmitter {
      constructor(path, options = {}) {
          super()
          this.path = path;
          this.flags = options.flags || 'r';
          this.encoding = options.encoding || null;
          if(typeof options.autoClose == "undefined") {
              this.autoClose = true
          }else{
              this.autoClose =  options.autoClose
          }
          this.start = options.start || 0;
          this.end = options.end || undefined;
          this.highWaterMark = options.highWaterMark || 64 * 1024;
          this.open(); // 默认就调用开启事件
          this.offset = this.start; // offset 可以根据每次读取的位置发生变化 
          this.flowing = false; // 默认就是非流动模式
          this.on('newListener', (type) => {
              if (type == 'data') { // 说明用户监听了data事件
                  this.flowing = true;
                  this.read(); // 读取吧
              }
          });
      }
      pause(){
          this.flowing = false;
      }
      resume(){
          if(!this.flowing){
              this.flowing = true;
              this.read(); // 继续读取
          }
      }
      open() {
          fs.open(this.path, this.flags, (err, fd) => {
              if (err) {
                  return this.emit('error', err)
              }
              this.fd = fd; // 将文件描述符保存起来
              this.emit('open', fd)
          })
      }
      read() {
          if (typeof this.fd != 'number') { // 保证fd 一定存在，不能存在就等会 什么时候存在再用 
              return this.once('open', () => this.read())
          }
          // fd 一定存在了, buffer是内存 内存是引用类型
  
          const buffer = Buffer.alloc(this.highWaterMark);
          let howMuchToRead = Math.min((this.end - this.offset + 1), this.highWaterMark); // 真正要读取的个数
          fs.read(this.fd, buffer, 0, howMuchToRead,this.offset, (err,bytesRead) => { // 真正读取到的个数
              if(bytesRead){
                  this.offset += bytesRead; // 每次读到后就累加,方便下次继续读取
                  this.emit('data',buffer.slice(0,bytesRead))
                  if(this.flowing){
                      this.read();
                  }
              }else{
                  this.emit('end');
                  if(this.autoClose){
                      fs.close(this.fd,()=>{
                          this.emit('close');
                      })
                  }
              }
          })
      }
  }
  module.exports = ReadStream;
  ```
  
  + 可写流的基本应用
  
  ```js
  const fs = require('fs');
  const path = require('path');
  
  const ws = fs.createWriteStream(path.resolve(__dirname, 'test.txt'),{
      flags:'w',
      encoding:'utf8',
      autoClose:true,
      highWaterMark: 2// 默认写的水位线是16k
  });
  // ws可写流，可写流有四个方法ws.write()  ws.end();其中ws.on('open') on('close')，是因为是文件流所以也有
  
  let flag = ws.write('1'); // 只能写入 string 或者buffer类型  fs.write
  ws.write('2');//这些都是异步执行的方法
  ws.write('3');
  ws.write('4');
  console.log(flag); 
  
  // 如果highWaterMark为1时，则上述的ws.write('2');ws.write('3');ws.write('4')会缓存到链表的队列中，每次执行完一个就从地队列中取出一个执行，;
  
  ws.end('ok'); // 相当于调用ws.write把ok写入后并调用ws.close方法关闭。如果此时再调用ws.end('ok'); 会报错。如果不传参数，调ws.end();则不会。
  ws.end();
  
  
  
  // 我只想用一个字节来实现写入10个数 
  const fs = require('fs');
  const path = require('path');
  const ws = fs.createWriteStream(path.resolve(__dirname, 'test.txt'), {
      highWaterMark: 1uj
  })
  let i = 0;
  function write() { // fs.open('xxx','w')
      let flag = true;
      while (i < 10 && flag) {
          flag = ws.write('' + i++)
      }
  }
  write();
  // 抽干事件 当我们的内容到达预期后，或者超过预期时会触发此方法 （必须等这些内容都写到文件中才执行）
  ws.on('drain', function() {
      write();那么 
      console.log('清空')
  });
  
  
  ```
  
  + 可写流的实现原理
  
  ```js
  const EventEmitter = require('events');
  const fs = require('fs');
  const Queue = require('./Queue');
  class WriteStream extends EventEmitter {
      constructor(path,options={}){
          super(options);
          this.path = path;
          this.flags = options.flags || 'w';
          this.encoding = options.encoding || 'utf8';
          this.autoClose = options.autoClose || true;
          this.highWaterMark = options.highWaterMark || 16*1024;
          this.open();
  
          // 要判断是第一次写入 还是第二次写入
          this.writing = false; // 用来描述当前是否有正在写入的操作
          this.len = 0; // 需要的统计的长度
          this.needDrain= false;// 默认是否触发drain事件
          this.offset = 0; // 每次写入时的偏移量
          this.cache = new Queue// 用来实现缓存的
      }
      write(chunk,encoding=this.encoding,cb=()=>{}){ // 用户调用的write方法
          // 判断时真的写入 还是放到缓存中
          // 用户调用write时 写入的数据可能时stringOrBuffer
          chunk =  Buffer.isBuffer(chunk)?chunk: Buffer.from(chunk)
          this.len += chunk.length;
          let ret = this.len < this.highWaterMark;
          if(!ret){ // 达到预期或者超过预期 就改变触发drian事件
              this.needDrain = true;
          }
          if(this.writing){ // 如果正在写入就先存起来 稍后再去写入
              this.cache.offer({ //f
                  chunk,
                  encoding,
                  cb
              })
          }else{
              this.writing = true;// 标识为正在写入
              this._write(chunk,encoding,()=>{ // z
                  cb(); // 用户本来的回调要执行
                  this.clearBuffer(); 
              });
          }
          return ret
      }
      clearBuffer(){ // 对个异步并发 可以考队列来实现 依次清空
          let data = this.cache.poll();
          if(data){
              let {chunk,encoding,cb} = data;
              this._write(chunk,encoding,()=>{
                  cb();
                  this.clearBuffer();
              })
          }else{
              this.writing = false;// 缓存中的内容也写入了 清空缓存
              if(this.needDrain){
                  this.needDrain = false;
                  this.emit('drain');
              }
          }
      }
      open(){
          fs.open(this.path,this.flags,(err,fd)=>{
              if(err) return this.emit('error',err);
              this.fd = fd;
              this.emit('open',fd);
          })
      }
      _write(chunk,encoding,cb){ // fs.write => doWrite
          if(typeof this.fd !== 'number'){
              return this.once('open',()=>this._write(chunk,encoding,cb))
          }
          fs.write(this.fd,chunk,0,chunk.length,this.offset,(err,written)=>{
              this.len -= written;
              this.offset += written;
              cb();
          }) 
      }
  }
  module.exports = WriteStream
  
  // 实现读一点 （on('data') on('end') pause resume） 写一点   (write,end)
  
  ```
  
  + 常见的数据结构
  
  ```js
  //常见的数据结构：栈 队列 链表 树
  
  //队列：特点是先进先出。对上数组的办法就是push跟shift  典型的有：事件环
  //栈：特点是一层一层的弹出去，对上数组的方法就是push跟pop 典型的栈行结构：方法的调用栈 路由切换 浏览器的历史记录是两个栈
  //数组的shift方法是比较消耗性能的（在数据量大的情况下），每次弹出一个，后续的内容都会前进。
  //链表的性能比较高，链表的查找、删除性能平均复杂度是O(n)，链表适合用来优化头尾操作。
  ```
  
  手写实现链表
  
  ```js
  class Node {
      constructor(element, next) {
  
          this.element = element;
          this.next = next;
      }
  }
  class LinkedList {
      constructor() {
          this.head = null;
          this.size = 0;
      }
      add(index, element) { // 增加节点
          if (arguments.length == 1) {
              element = index;
              index = this.size
          }
          if (index < 0 || index > this.size) throw new Error('链表索引异常');
  
          if (index == 0) {
              let head = this.head; // 老的头
              this.head = new Node(element, head);
          } else {
              let prevNode = this.getNode(index - 1); // 这里前面节点肯定有，如果没有会走if
              prevNode.next = new Node(element, prevNode.next);
          }
          this.size++;
      }
      remove(index) { // 删除节点
          if(this.size == 0) return null
          let oldNode;
          if (index == 0) {
              oldNode = this.head;
              this.head = oldNode && oldNode.next;
          } else {
              let prevNode = this.getNode(index-1); // 获取当前的前一个节点 
              oldNode = prevNode.next; // 前一个的下一个就是要删除的 
              prevNode.next = oldNode.next; // 让前一个下一个 执行 之前的下一个
          }
          this.size--;
          return oldNode.element; // 返回删除元素
      }
      getNode(index) { // 获取节点
          let current = this.head; // 从头找
          for (let i = 0; i < index; i++) {
              current = current.next;
          }
          return current;
      }
      length() { // 链表的总个数
          return this.size
      }
      reverseLinkedList2(){
          function reverse(head){ // 先递归最里面的，在出来
              // 如果链表为空 或者没有下一个了 就不用反转了
              if(head == null || head.next == null) return head;
              let newHead = reverse(head.next); // 将原来的下一个变成头结点
              head.next.next = head; // 让下一个节点的下一个指向原来的头
              head.next = null; // 让老头指向null
              return newHead
          }   
          this.head = reverse(this.head)
          return this.head;
      }
      reverseLinkedList(){
          let head = this.head; // 保留老头
          if(head == null || head.next == null) return head;
          let newHead = null; // 新的链表头部默认指向null
          while(head!==null){ // 循环老的链表 将内容依次的取出使用
              let temp = head.next; // 存储的是100 
              head.next = newHead;  // 让老的头指向新的头
              newHead = head; // 新的头指向了老的头 
              head = temp; // 老的头向后移动
          }
          this.head = newHead;
          return this.head
      }
  }
  module.exports = LinkedList
  ```
  
  利用链表实现队列
  
  ```js
  let LinkedList = require('./LinkedList');
  class Queue{ // 队列是添加和删除
      constructor(){
          this.ll = new LinkedList();
      }
      offer(element){ // 入队列
          this.ll.add(element);
      }
      poll(){
          return this.ll.remove(0);
      }
  }
  module.exports = Queue;
  ```
  
  利用链表跟队列改造可写流【提高性能】
  
  ```js
  const EventEmitter = require('events');
  const fs = require('fs');
  const Queue = require('./Queue');
  class WriteStream extends EventEmitter {
      constructor(path,options={}){
          super(options);
          this.path = path;
          this.flags = options.flags || 'w';
          this.encoding = options.encoding || 'utf8';
          this.autoClose = options.autoClose || true;
          this.highWaterMark = options.highWaterMark || 16*1024;
          this.open();
  
          // 要判断是第一次写入 还是第二次写入
          this.writing = false; // 用来描述当前是否有正在写入的操作
          this.len = 0; // 需要的统计的长度
          this.needDrain= false;// 默认是否触发drain事件
          this.offset = 0; // 每次写入时的偏移量
          this.cache = new Queue// 用来实现缓存的
      }
      write(chunk,encoding=this.encoding,cb=()=>{}){ // 用户调用的write方法
          // 判断时真的写入 还是放到缓存中
          // 用户调用write时 写入的数据可能时stringOrBuffer
          chunk =  Buffer.isBuffer(chunk)?chunk: Buffer.from(chunk)
          this.len += chunk.length;
          let ret = this.len < this.highWaterMark;
          if(!ret){ // 达到预期或者超过预期 就改变触发drian事件
              this.needDrain = true;
          }
          if(this.writing){ // 如果正在写入就先存起来 稍后再去写入
              this.cache.offer({ //f
                  chunk,
                  encoding,
                  cb
              })
          }else{
              this.writing = true;// 标识为正在写入
              this._write(chunk,encoding,()=>{ // z
                  cb(); // 用户本来的回调要执行
                  this.clearBuffer(); 
              });
          }
          return ret
      }
      clearBuffer(){ // 对个异步并发 可以考队列来实现 依次清空
          let data = this.cache.poll();
          if(data){
              let {chunk,encoding,cb} = data;
              this._write(chunk,encoding,()=>{
                  cb();
                  this.clearBuffer();
              })
          }else{
              this.writing = false;// 缓存中的内容也写入了 清空缓存
              if(this.needDrain){
                  this.needDrain = false;
                  this.emit('drain');
              }
          }
      }
      open(){
          fs.open(this.path,this.flags,(err,fd)=>{
              if(err) return this.emit('error',err);
              this.fd = fd;
              this.emit('open',fd);
          })
      }
      _write(chunk,encoding,cb){ // fs.write => doWrite
          if(typeof this.fd !== 'number'){
              return this.once('open',()=>this._write(chunk,encoding,cb))
          }
          fs.write(this.fd,chunk,0,chunk.length,this.offset,(err,written)=>{
              this.len -= written;
              this.offset += written;
              cb();
          }) 
      }
  }
  module.exports = WriteStream
  
  // 实现读一点 （on('data') on('end') pause resume） 写一点   (write,end)
  
  ```
  
  + 链表的反转 - 递归方法和拆东墙补西墙
  
  ```js
  // 常见的数据结构 队列 栈  链表  树
  // 队列时先进先出 push shift  事件环
  // 栈型结构 push pop 方法调用栈  路由切换  浏览器的历史记录 两个栈
  
  class Node {
      constructor(element, next) {
  
          this.element = element;
          this.next = next;
      }
  }
  class LinkedList {
      constructor() {
          this.head = null;
          this.size = 0;
      }
      add(index, element) { // 增加节点
          if (arguments.length == 1) {
              element = index;
              index = this.size
          }
          if (index < 0 || index > this.size) throw new Error('链表索引异常');
  
          if (index == 0) {
              let head = this.head; // 老的头
              this.head = new Node(element, head);
          } else {
              let prevNode = this.getNode(index - 1); // 这里前面节点肯定有，如果没有会走if
              prevNode.next = new Node(element, prevNode.next);
          }
          this.size++;
      }
      remove(index) { // 删除节点
          if(this.size == 0) return null
          let oldNode;
          if (index == 0) {
              oldNode = this.head;
              this.head = oldNode && oldNode.next;
          } else {
              let prevNode = this.getNode(index-1); // 获取当前的前一个节点 
              oldNode = prevNode.next; // 前一个的下一个就是要删除的 
              prevNode.next = oldNode.next; // 让前一个下一个 执行 之前的下一个
          }
          this.size--;
          return oldNode.element; // 返回删除元素
      }
      getNode(index) { // 获取节点
          let current = this.head; // 从头找
          for (let i = 0; i < index; i++) {
              current = current.next;
          }
          return current;
      }
      length() { // 链表的总个数
          return this.size
      }
      reverseLinkedList2(){
          function reverse(head){ // 先递归最里面的，在出来
              // 如果链表为空 或者没有下一个了 就不用反转了
              if(head == null || head.next == null) return head;
              let newHead = reverse(head.next); // 将原来的下一个变成头结点
              head.next.next = head; // 让下一个节点的下一个指向原来的头
              head.next = null; // 让老头指向null
              return newHead
          }   
          this.head = reverse(this.head)
          return this.head;
      }
      reverseLinkedList(){
          let head = this.head; // 保留老头
          if(head == null || head.next == null) return head;
          let newHead = null; // 新的链表头部默认指向null
          while(head!==null){ // 循环老的链表 将内容依次的取出使用
              let temp = head.next; // 存储的是100 
              head.next = newHead;  // 让老的头指向新的头
              newHead = head; // 新的头指向了老的头 
              head = temp; // 老的头向后移动
          }
          this.head = newHead;
          return this.head
      }
  }
  module.exports = LinkedList
  // let ll = new LinkedList();
  // ll.add(0, 100); // 200 100  300往索引0出天健
  // ll.add(0, 200);
  // ll.add(300);
  // let reverList = ll.reverseLinkedList();
  // console.log(reverList); // 300 100 200
  
  
  
  // let ll = new LinkedList();
  // head = 100
  // head =200 next => head
  // ll.add(0, 100); // 200 100  300  往索引0出天健
  // ll.add(0, 200);
  // ll.add(300); // 200 下一个是 100 下一个 是300  像末尾添加
  // ll.remove(2);
  // console.log(ll.head)
  
  
  // 常考的面试题 链表反转 其他的两个流 转化流和双工流
  // 文件夹操作  树结构遍历算法 层序 深度 树的反转
  ```

+ 管道pipe

  ```js
  const ReadStream = require('./ReadStream');
  const WriteStream = require('./WriteStream');
  
  
  let rs = new ReadStream('./test.txt', { highWaterMark: 4 });
  let ws = new WriteStream('./copy.txt', { highWaterMark: 1 });
  
  // 拷贝功能是异步的 内部用的是发布订阅模式 
  rs.pipe(ws);
  ws.on('drain', function() {
      console.log('drain')
  })
  // 可读流的读取操作 和 可写流的写入的操作方法 是需要的
  
  
  // 可读流 可写流  双工流(能读也能写 既继承了可读又继承了可写流 （读和写可以没有关系）)
  const { Duplex, Transform,Readable,Writable } = require('stream')
  // class MyDuplex extends Duplex{
  //     _read(){
  //         this.push('xxx');
  //         this.push(null)
  //     }
  //     _write(chunk,encoding,cb){
  //         console.log(chunk);
  //         cb() // clearBuffer
  //     }
  // }
  // let md = new MyDuplex();
  // md.on('data',function (chunk) {
  //     console.log(chunk)
  // })
  // md.write('ok');
  
  // 转化流 可以用于加密 压缩 可以把可写流转换成可读流
  
  class MyTransfrom extends Transform {
      _transform(chunk, encoding, cb) {
          // 这里可以调用push方法
          this.push(chunk.toString().toUpperCase()); // this.emit()
          cb();
      }
  }
  let my = new MyTransfrom();
  // process.stdin.on('data',function (chunk) { // 监控用户输入内容
  //     process.stdout.write(chunk); 
  // })
  process.stdin.pipe(my).pipe(process.stdout)
  // process.std.write('ok'); // console.log() 可写流
  
  ```

+ 树

  ```js
  // bst binary search tree
  
  class Node { // 节点直接必须有一个parent
      constructor(element, parent) {
          this.element = element;
          this.parent = parent; // 记录当前节点的父亲时谁
          this.left = null;
          this.right = null;
      }
  }
  class BST {
      constructor() {
          this.root = null;
          this.size = 0;
      }
      add(element) {
          if (this.root == null) {
              this.root = new Node(element, null);
              this.size++;
              return
          }
          // 根据根的来比较拆入
          // 根据条件不停的找 找到节点为空时 将上一次的值保存起来。将节点插入到保存的节点中
          let currentNode = this.root; // 从根开始进行查找
          let parent = null;
          let compare = null
          while (currentNode) {
              compare = element - currentNode.element
              parent = currentNode; // parent就是在进入左右子树之前保存下来的节点
              if (compare > 0) {
                  currentNode = currentNode.right
              } else if (compare < 0) {
                  currentNode = currentNode.left;
              }
          }
          let newNode = new Node(element, parent)
          if (compare > 0) {
              parent.right = newNode;
          } else {
              parent.left = newNode;
          }
          this.size++;
      }
      preorderTraversal(vistor) {
          const traversal = (node) => {
              if (node == null) return;
              vistor.visit(node)
              traversal(node.left);
              traversal(node.right);
          }
          traversal(this.root)
      }
      inorderTraversal(vistor) {
          const traversal = (node) => {
              if (node == null) return;
              traversal(node.left);
              vistor.visit(node)
              traversal(node.right);
          }
          traversal(this.root);
      }
      // 根据parent属性  一般情况下 都可以用栈形结构 去避免递归
      postOrderTraversal(vistor) {
          const traversal = (node) => {
              if (node == null) return;
              traversal(node.left);
              traversal(node.right);
              vistor.visit(node)
          }
          traversal(this.root)
      }
      levelOrderTraversal(visitor) {
          if (this.root == null) return;
          let stack = [this.root]; // 10
          let index = 0;
          let currentNode = null;
          while (currentNode = stack[index++]) {
              visitor.visit(currentNode)
              if (currentNode.left) {
                  stack.push(currentNode.left)
              }
              if (currentNode.right) {
                  stack.push(currentNode.right)
              }
          }
      }
      // 左右互换 树的遍历
      invertTree(){
          if (this.root == null) return;
          let stack = [this.root]; // 10
          let index = 0;
          let currentNode = null;
          while (currentNode = stack[index++]) {
              let temp = currentNode.left;
              currentNode.left = currentNode.right;
              currentNode.right = temp;
  
              if (currentNode.left) {
                  stack.push(currentNode.left)
              }
              if (currentNode.right) {
                  stack.push(currentNode.right)
              }
          }
      }
  }
  let bst = new BST();
  let arr = [10, 8, 19, 6, 15, 22, 20];
  arr.forEach(item => {
      bst.add(item)
  })
  // 访问者模式
  // bst.invertTree({ // babel 内部转化都是使用这种方式
  //     visit(node) {
  //         console.log(node.element, '----');
  //     }
  // });
  bst.invertTree()
  console.log(bst.root)
  // 二叉搜素树中的内容必须是有可比较性的 
  
  // 常见遍历方式 前序遍历 中序  后续  层序
  
  // 二叉树的反转 ， 文件夹的操作
  ```
  
  文件夹
  
  ```js
  const fs = require('fs');
  const path = require('path');
  // 1.如何创建文件夹  2.如何删除文件夹  3.如何判断是不是文件夹  4.文件夹放的有什么内容
  // 这些方法也分同步和异步  
  // 这里我们以异步代码为例。异步代码稍微的复杂一些
  // fs.mkdir('a/b/c/d',(err)=>{console.log(err)}); // 创建目录前 需要保证父目录存在
  // fs.rmdir('a',(err)=>{console.log(err)}); // 删除目录时需要保证目录中的内容是空的
  // fs.readdir('a',(err,dirs)=>{
  //    dirs = dirs.map(item=> {
  //     let p = path.join('a',item);
  //     fs.stat(p,function (err,stat) { // 如果文件不存在就报错
  //         console.log(stat.isDirectory());
  //         if(stat.isFile()){
  //             fs.unlink(p,()=>{});
  //         }
  //     })
  //     return p
  //    })
  
  // }); // 读取的结果只有儿子一层
  
  // fs.mdir fs.rmdir  fs.readdir(只能读取一层)  fs.stat()判断文件的状态  isFile 是否文件 isDirectory 是否为目录  unlink 取消链接即删除（类型为文件才有）
  
  
  // 异步删除文件夹  串行 并行
  
  // function rmdir(dir,cb){ // 用我们的层序遍历来实现删除操作
  //     fs.stat(dir,(err,statObj)=>{
  //         if(statObj.isFile()){
  //             fs.unlink(dir,cb);
  //         }else{
  //             // 读取文件夹中的内容 
  //             fs.readdir(dir,(err,dirs)=>{
  //                 dirs = dirs.map(item=>path.join(dir,item));
  //                 // 先删除 儿子 在删除老子
  //                 let idx = 0;
  //                 function next(){
  //                     if(idx == dirs.length) return fs.rmdir(dir,cb);
  //                     let current = dirs[idx++];
  //                     rmdir(current,next)
  //                 }
  //                 next();
  //             })
  //         }
  //     });
  // }
  
  function rmdir(dir,cb){ // 用我们的层序遍历来实现删除操作
      fs.stat(dir,(err,statObj)=>{
          if(statObj.isFile()){
              fs.unlink(dir,cb);
          }else{ // Promise.all
              // 读取文件夹中的内容 
              fs.readdir(dir,(err,dirs)=>{
                  dirs = dirs.map(item=>path.join(dir,item));
                  // 先删除 儿子 在删除老子
                  // 并发删除多个儿子 而删除完毕 通知父亲
                  if(dirs.length == 0){
                       return fs.rmdir(dir,cb);
                  }
                  let idx = 0;
                  function done(){
                      if(++idx == dirs.length){
                          fs.rmdir(dir,cb);
                      }
                  }
                  for(let i = 0; i < dirs.length;i++){
                      let dir = dirs[i];
                      rmdir(dir,done)
                  }
              })
          }
      });
  }
  
  
  fs.rmdir('a',function (err) {
      console.log('删除成功',err); // 递归考虑两层
  })
  ```

#### HTTP

## 方法

- http中的方法 Restful 风格 get查询、post增加、put修改、delete删除
- 通过请求路径 来进行区分对资源的操作 /addUser /removeUser /getUser 
- 可以通过方法来区分做什么操作  根据方法来明确资源的不同的操作
- 跨域请求：options预检请求 跨域时会携带（简单请求不会发送options请求，简单的有get、post，其他都是复杂。如果用户添加了自定义信息也算复杂请求）  (复杂请求，并且跨域了,就会发生预检)  cookie不允许跨域 （预检不通过不会发送后续的内容了）

> http请求发出去后等待服务器返回结果。服务端不能主动推送消息

## 状态码 （服务端和浏览器商量好的）

- 1xx websocket
- 2xx 200成功 204（响应体为空）206(范围请求)
- 3xx 304缓存 （服务端配置的） 协商缓存 301 302 307 重定向 (pc、移动端)
- 4xx 400 请求出错 401没权限403登录权限不够 404 找不到 405 方法不允许
- 5xx 500 服务端出错 502 503 504 


## 通讯 通信的规则

- 客户端访问服务器  postman 、 curl

```js
const http = require('http');
const url = require('url');

// uri (uniform resource indentifier) url urn
// hostname 主机名
// query 查询参数
// pathname 请求路径
// console.log(url.parse('http://username:password@localhost:3000/resource?a=1#hash',true))
let server = http.createServer((req, res) => {
    // 请求部分
    console.log(req.method); // 默认也是大写的
    // console.log(req.url); //  /后面的# 前面的  希望获取用户的参数？后面的参数   query  ={a:1,b:2}
    let { pathname, query } = url.parse(req.url, true); // 把查询参数变成一个对象结果
    console.log(pathname,query)
    console.log(req.headers); // 所有的请求头信息  所有的key都是小写

    // req是一个可读流
    let arr = []; // 前端传递的数据可能是二进制所以用buffer拼接是最合理的

    // 如果流中的数据为空 内部会调用 push(null) 只要调用了push 一定会触发end事件
    req.on('data',function (chunk) {
        arr.push(chunk);
    });
    req.on('end',function () { // 如果没有数据也会触发end方法
        console.log(Buffer.concat(arr).toString(),'----');
    });
    // --------------------------------------------------------
    // 客户端数据获取
    // 响应行和 响应头 响应体顺序 不能发生变化 
    // res是一个可写流 write end


    // 希望服务器每一秒都给客户端最新的一个价格 socket.io
    res.statusCode = 200;
    // res.statusMessage = 'no stauts'; 
    res.setHeader('a',1)
    res.setHeader('a',2)
    // 如果websoket不支持 一般情况会采用 前端定时器轮询 ，服务端 返回结果
    res.end('ok');
    // 服务端相关的方法

    //res.write();// 分段响应 Transfer-Encoding:chunkeds
    // res.end('ok'); // 标识响应结束

});
// curl -v 显示详细信息
// curl -X 指定方法
// curl -d 指定数据 
// curl -h 指定头

// server.on('request',function (req,res) {
//     console.log('2');    
// })


let port = 4000; // 端口尽量使用3000以上
server.listen(port, function() {
    console.log(`server start ${port}`);
});
server.on('error', function(err) {
    if (err.errno === 'EADDRINUSE') {
        server.listen(++port); // 端口占用自动累加重启
    }
})
// 服务端代码改变后必须要重新执行  pm2
// nodemon  node monintor  npm install nodemon -g 
// nodemon + 文件名运行



// let query = {};
// req.url.replace(/([^&?=]+)=([^&?=]+)/g,function () {
//     query[arguments[1]] = arguments[2];
// })
// console.log(query)
```

```js
// 服务器 1） 返回静态文件 2) 返回数据 

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs').promises;
const {createReadStream} = require('fs');
const mime = require('mime')

// 写node代码 慢慢的就会放弃回调的方式 =》 aysnc + await + promise

// 解决this 指向可以采用箭头函数 / 使用bind来实现
class StaticServer{
    async handleRequest(req,res){
        const {pathname} = url.parse(req.url,true); // 根据路径返回对应的资源
        let filePath = path.join(__dirname,pathname); // /note.md

        // 需要你访问的是不是文件夹 
        // 浏览器根据心情发送的图标favicon.ico
        try{
            let statObj = await fs.stat(filePath);
            if(statObj.isFile()){ // mime 可以根据文件后缀来识别 是什么类型的
                res.setHeader('Content-Type',mime.getType(filePath)+';charset=utf-8');
                createReadStream(filePath).pipe(res); // res 是一个可写流 可读流.pipe(可写流)
                // let data = await fs.readFile(filePath);
                // res.end(data);
            }else{
                filePath = path.join(filePath,'index.html');
                await fs.access(filePath); // 异步方法 不存在会报错
                res.setHeader('Content-Type','text/html;charset=utf-8');
                createReadStream(filePath).pipe(res);
            }
        }catch(e){
            this.sendError(e,req,res);
        }
    }   
    sendError(e,req,res){
        res.statusCode = 404;
        res.end('Not Found');
    }
    start(...args){
        // 内部  
        const server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args)
    }
}
new StaticServer().start(3000,function () {
    console.log(`server start 3000`);
});

// http 相关header的应用  -> koa使用

```

实现HTTP-SERVER

```js
```

