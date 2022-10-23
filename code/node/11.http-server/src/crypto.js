//md5：摘要算法，不叫加密算法，因为加密算法通常都有解密的方式。而md5无法解密
//摘要：自己简单的理解就是摘出来部分关键的信息，随机的。正式因为这样，我们才无法使用摘要反推出来文章的内容
//md5特点
//1.两段不同内容摘要出来结果的长度相同
//2.如果传入的参数不同，则输出的结果也不同（传入的参数一样，则结果一样）
//3.MD5不可逆
//4.网上说的md5解密是指撞库暴力破解，即生成对应的摘要放库里，撞出来相同的即解密出来了

const crpto = require('crypto');
console.log(crpto.createHash('md5').update('1234').digest('base64'))
console.log(crpto.createHash('md5').update('1235').digest('base64'))
//gdyb21LQTcIANtvYMT7QVQ==
//mZZTXgclinu/2LEyQ1xZYg==
//update方法里可以放buffer或者字符串

//不适合大文件摘要，因为在读取大文件内容时，就很消耗性能了