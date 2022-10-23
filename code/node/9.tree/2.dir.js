const fs = require('fs');
const path = require('path')
//1.如何创建文件夹
//2.如何删除文件夹
//3.如何判断是否为文件夹
//4.如何获取文件夹中的内容
//上述这些方法也分同步异步，此处示例则使用异步的方法

// fs.mkdir('a',()=>{}) //创建文件夹，注意创建文件夹时父文件夹的目录需要存在。否则则会报错
// fs.mkdir('a/b/c/d',(err)=>{console.log(err)}) //no such file or directory, mkdir 'c:\Users\87631\Desktop\workSpace\test\node\9.tree\a\b\c\d']



//删除文件夹时必须保证文件夹是空的
// fs.rmdir('a',(err)=>{console.log(err)})// directory not empty, rmdir 'c:\Users\87631\Desktop\workSpace\test\node\9.tree\a']
//但是可以这样写
// fs.rmdir('a/b',(err)=>{console.log(err)})

// fs.readdir('a', (err, dirs) => {
//     console.log(dirs)//这样子读取出来只有儿子这一层 [ 'a.js', 'b' ]
//     let newDir = dirs.map(item => path.join('a',item))
//     console.log(newDir) //[ 'a\\a.js', 'a\\b' ]
// }) 

// fs.readdir('a', (err, dirs) => {
//     dirs = dirs.map(item => {
//         let p = path.join('a', item);
//         fs.stat(p, function (err, stat) {
//             console.log(stat.isDirectory());
//             if(stat.isFile()){
//                 fs.unlink(p,()=>{})
//             }
//         })
//         return p
//     })
// })


// function rmdir(dir, cb) {
//     fs.stat(dir, (err, state) => {
//         if (state.isFile()) {
//             fs.unlink(dir, cb)
//         } else {
//             //去读取文件夹中的内容
//             fs.readdir(dir, (err, dirs) => {
//                 dirs = dirs.map(item => path.join(dir, item));
//                 // console.log(dirs)
//                 //删除children在删除parent
//                 let index = 0;
//                 function next() {
//                     if (index == dirs.length) return fs.rmdir(dir,cb);
//                     let current = dirs[index++];
//                     rmdir(current, next)
//                 }
//                 next()
//             })

//         }
//     })
// }
// rmdir('a', function () {
//     console.log('删除成功')
// })


function rmdir(dir, cb) {
    fs.stat(dir, (err, state) => {
        if (state.isFile()) {
            fs.unlink(dir, cb)
        } else {
            //去读取文件夹中的内容
            fs.readdir(dir, (err, dirs) => {
                dirs = dirs.map(item => path.join(dir, item));
                //并发删除多个children，删除完毕之后再通知parent
                if (dirs.length == 0) {
                    return fs.rmdir(dir, cb)
                }
                let index = 0;
                function done() {
                    if (++index == dirs.length) {
                        fs.rmdir(dir, cb)
                    }
                }
                for (let i = 0; i < dirs.length; i++) {
                    const dir = dirs[i];
                    rmdir(dir, done)

                }
            })

        }
    })
}
rmdir('a', function () {
    console.log('删除成功')
})