const koa = require('koa');

const app = new koa();
const Router = require('koa-router');
const router = new Router();
//Koa中专门用了一个字段来描述签名xxx.sign = 8tNxZ8XOLDDyYagdNPC9SpIOl5s

//Koa中签名的实现原理
// const crypto = require('crypto');
// console.log(crypto.createHmac('sha1','testpx').update('visit=13').digest('base64')) //8tNxZ8XOLDDyYagdNPC9SpIOl5s

app.keys = ['testpx'];
const session = {}; //用来记录映射关系的
const cardName = 'connect.sid'; //类似于卡号
router.get('/visit', (ctx, next) => {
    let cardId = ctx.cookies.get(cardName);
    if (cardId && session[cardId]) {
        session[cardId].mny -= 10;
        ctx.body = `您有${ session[cardId].mny}钱`
    } else {
        //Math.random() + Date.now().toString() 创建一个唯一的标志（示例使用而已）
        let cardId = Math.random() + Date.now().toString();
        ctx.cookies.set(cardName, cardId);
        session[cardId] = {mny:100};
        ctx.body = `您有${ session[cardId].mny}钱`
    }
    // let visit = ctx.cookies.get('visit', { signed: true });
    // if (visit) {
    //     visit++;
    // } else {
    //     visit = 1
    // }
    // ctx.cookies.set('visit', visit, { signed: true });
    // ctx.body = `当前用户访问第${visit}次`
})
app.use(router.routes())
app.listen(3000)
//由于cookie在客户端可以被修改，安全性不高，所以需要搭配服务端的session来使用



//cookie跟session的区别

// cookie既可以在客户端设置也可以在服务端设置，但是cookie每次请求都会携带上，同时cookie不安全，因为cookie存放在客户端上（客户端可以随便修改它）
// session是借助cookie去使用的，使用时会注册一个唯一标识，根据唯一的标识去获取对应的数据，且session是存放在服务端上的。不可以随意更改