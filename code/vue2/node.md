#### 1.使用rollup配置开发环境

`npm install rollup rollup-plugin-babel @babel/core @babel/preset-env rollup-plugin-serve`

```js
rollup：开发插件时使用比较多，但是一般项目中还是仍旧使用webpack
rollup-plugin-babel：rollup跟babel之间的桥梁
@babel/core：babel的核心模块
@babel/preset-env：把ES6的语法转译成ES5语法
rollup-plugin-serve：启动本地服务
```

每次安装依赖时，千万记得要`npm init -y`

`rollup.config.js`rollup的配置文件

