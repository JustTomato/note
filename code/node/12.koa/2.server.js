const Koa = require('koa');

const app = new Koa();



const sleep= function(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
            console.log('sleep')
        },1000)
    })
}
app.use(async function(ctx,next){
    console.log(1)
    next()
    console.log(2)
})
app.use(async function(ctx,next){
    console.log(3)
    await sleep()
    next()
    console.log(4)
})

app.use(async function(ctx,next){
    console.log(5)
    next()
    console.log(6)
})

//中间件的用处
//1.可以决定是否继续向下执行。【常见的使用场景是做权限：对访问路径进统一的拦截，如果路径不合法则不必向下执行】
//2.可以在中间件中拓展属性或者添加方法，【从第一个中间拓展一个方法之后，后面的中间件都可以获取得到】
//3.可以基于中间件写一个需要的插件【分割逻辑】

//Koa中的特点归纳
//1.Koa中所有的use函数中传入的方法都会被包装成promise【无论在传入的方法前面加不加async,都是】
//2.会把所有的promise集合变成一个promise链【想让每个中间件依次执行，则需要在next方法前面加await或者return。【return：一个promise返回一个promise】】例如
//3.所有的异步逻辑代码都需要包装成promise【koa的规范要求】
// app.use(async function(ctx,next){
//     console.log(ctx.a)
//     await next()
// })

// app.use(async function(ctx,next){
//     console.log(ctx.a)
//     await next()
// })

app.listen(3000)