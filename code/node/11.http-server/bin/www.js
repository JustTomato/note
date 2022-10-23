#! /usr/bin/env node
const program = require('commander');
const config = require('./serverConfig')
const { forEachObj } = require('../utils')
//--port 3000
//--directory d:
//--cache
program.name('shs')
forEachObj(config, val => {
    program.option(val.option, val.descriptor)
})
program.on('--help', function () {
    console.log('\r\nExamples:')
    forEachObj(config, val => {
        console.log(' ' + val.usage)
    })
})

program.parse(process.agrv);
const finalConfig = {}
forEachObj(config, (value, key) => {
    finalConfig[key] = program[key] || value.default
})
console.log(finalConfig)
//1.解析用户参数
//2。开启服务

const Server = require('../src/index');

let server = new Server(finalConfig);//传入服务器参数
server.start();//开启服务