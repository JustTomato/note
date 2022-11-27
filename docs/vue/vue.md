### Vue

#### 1.使用rollup配置开发环境

> 在库开发时基本使用rollup打包（rollup打包出来的文件比较少且同时也支持es6等，webpack打包出来的屋文件就相对比较多），但是在项目开发时都是用webpack
>
> 现在还有许多其他的打包工具，例如vite

`npm install rollup rollup-plugin-babel @babel/core @babel/preset-env rollup-plugin-serve`

```js
rollup：开发插件时使用比较多，但是一般项目中还是仍旧使用webpack
rollup-plugin-babel：rollup跟babel之间的桥梁
@babel/core：babel的核心模块
@babel/preset-env：把ES6的语法转译成ES5语法
rollup-plugin-serve：启动本地服务
```

每次安装依赖时，千万记得要`npm init -y`

新建`rollup.config.js` [rollup的配置文件]

```js
import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel';

export default { //用于打包配置
    //入口
    input:'./src/index.js',
    //出口
    output:{
        //打包成什么文件
        file:'dist/vue.js',
        //打包后的全局变量名称 const vm = new Vue();
        name:'Vue',
        //模块规范 统一为umd 支持commonjs规范，作用将Vue挂载在Window下 window.Vue
        format:'umd',
        //映射文件 [由于我们将ES6转译为ES5后，但是我们在开发时希望看到的是ES6的代码，所以需要配置TRUE]
        sourcemap:true,
    },
    //插件
    plugins:[
        //使用babel
        babel({
            //排哪个目录，node_modules这个目录不需要使用babel进行转译
            exclude:"/node_modules/**"
            //也可以在这里配置其他babel的配置，但是都会使用.babelrc文件来配置，该文件不需要引入，打包的时候会自动找到这个文件
        }),
        //启动服务
        serve({
            //自动打开浏览器
            open:true,
            //打开页面的文件路径
            openPage:"/public/index.html",
            //端口
            port:3000,
            //静态资源所在的路径
            contentBase:''
        })
    ]
}
```

新建src和public文件夹和babel的文件

.babelrc

```json
{
    "presets": [
        "@babel/preset-env"
    ]
}
```

public\index.html

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
    <script src="/dist/vue.js"></script>
    <script>
        const vm = new Vue({
            data() {
                return {
                    name: 'test'
                }
            },
            methods: {

            },
            computed: {

            }
        })
    </script>
</body>

</html>
```

src\index.js

```js
function Vue(){

}
export default Vue;
```

