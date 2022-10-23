const fs = require('fs');
const path = require('path');

const ws = fs.createWriteStream(path.resolve(__dirname, 'test.text'), {
    highWaterMark: 1
})

let i = 0;
function write() {
    let flag = true;
    while (i < 10 && flag) {
        flag = ws.write('' + i++)
    }
}
write()
//抽干事件，当读取到的内容写入对应的文件达到预期之后或者超过预期就会触发此方法（即必须等待这些内容都写到文件里才执行）
ws.on('drain', function () {
    write()
    console.log('drain')
})