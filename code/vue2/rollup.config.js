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