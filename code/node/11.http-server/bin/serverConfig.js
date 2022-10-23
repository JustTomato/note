module.exports = {
    port: {
        option: '-p,--port <v>', //program.option('-p,--port <val>','desc')
        descriptor: 'set your http server port', //描述
        usage: 'shs --port 3000', //使用示例
        default: 8080 //默认值
    },
    directory:{
        option: '-d,--directory <v>', 
        descriptor: 'set your http server directory', 
        usage: 'shs --directory D:', 
        default: process.cwd() //默认以当前运行的目录当作启动目录
    }
}
////自定义指令配置文件