Cookie Session

### 1.什么是Cookie和Session

经典面试题

```
1.cookie session localStorage seesionstorage的区别

解：localStorage seesionstorage只能在前端使用，即本地访问，不能发送给服务器【不会在请求中携带，不能跨域】。seesionstorage是窗口关闭后就销毁了，localStorage是永久保存在浏览器中。localStorage seesionstorage两者的最大存储大小都是5mb。

解：cookie是一种http无状态协议，用来识别请求的，cookie既能在前端使用也能在后端使用，每次请求会携带cookie。如果跨域请求则不能携带cookie。cookie是存放在客户端的，所以就会存在安全的问题（篡改客户端的cookie，csrf攻击）（需要合理设置cookie，不然每次请求都会带上，浪费性能，而cookie本质是一个header，而header的最大为4k，所以cookie的最大也为4k）

解：session还是基于cookie的，session是存放在服务端的一个对象，通过一个唯一标识就可以找到对应的信息，而标识是通过cookie来发送的。
session理论是没有大小限制的（因为存放在服务端）

```

使用cookie

```

```

