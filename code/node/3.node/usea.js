const fs = require('fs');
const path = require('path');
const vm = require('vm');

function Module(filename) {
    this.id = filename; //文件名
    this.exports = {}; //代表导出的结果
    this.path = path.dirname(filename);
}
Module._extensions = {

}
Module._cache = {};
Module.wrapper = function (content) {
    return `(function(exports,require,module,__filename,__dirname){${content}})`
}
Module._extensions['.js'] = function (module) {
    // console.log(module)
    let content = fs.readFileSync(module.id, 'utf8');
    //js文件需要包裹一个函数，并返回字符串
    let str = Module.wrapper(content);
    let fn = vm.runInThisContext(str);
    let exports = module.exports; //module.exports === exports
    fn.call(exports, exports, myReq, module, module.id, module.path) // module.exports = 'hello'
}
Module._extensions['.json'] = function (module) {
    // console.log(module)
    let content = fs.readFileSync(module.id, 'utf8');
    module.exports = JSON.parse(content)
}
Module._resolveFilename = function (filename) {
    let filePath = path.resolve(__dirname, filename);
    let isExists = fs.existsSync(filePath);
    //找到对应的文件则返回
    if (isExists) return filePath
    //找不到对应的文件，则拼接后缀，尝试拼接.js .json文件后缀
    let keys = Reflect.ownKeys(Module._extensions);
    for (let i = 0; i < keys.length; i++) {
        let newFile = filePath + keys[i]; //增加后缀
        if (fs.existsSync(newFile)) return newFile //匹配则返回
    }
    //不匹配则没有找到对应的文件，则抛出错误即可
    throw new Error('Module not found')
}
Module.prototype.load = function () {
    //加载模块时，需要获取当前模块的文件名，根据后缀名采用不同的策略进行加载
    let extension = path.extname(this.id);
    // console.log(extension)
    Module._extensions[extension](this); //根据不同的后缀名走不同的逻辑
}
function myReq(filename) {
    //1.解析当前文件名
    filename = Module._resolveFilename(filename)
    
    if(Module._cache[filename]){
        return Module._cache[filename].exports; //直接将exports返回即可
    }

    //2.根据对应的文件创建对应的模块
    let module = new Module(filename);
    //4.增加缓存 - 将模块缓存
    Module._cache[filename] = module;
    //3.加载对应的模块
    //此处需要读取文件加载模块
    module.load();
    return module.exports
    //最终返回的是module.exports
}
let r = myReq('./a')
myReq('./a')
myReq('./a')
myReq('./a')
myReq('./a')
myReq('./a')
console.log(r)