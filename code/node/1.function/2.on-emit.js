

let obj = {

};

let event = {
    arr:[],
    on(fn){
        this.arr.push(fn)
    },
    emit(){
        this.arr.forEach(fn => fn())
    }
}

const fs = require('fs');

fs.readFile('age.text','utf8',function(err,data){
    if(err) {
       return console.log(err)
    }
    obj.age = data;
    event.emit();
})
fs.readFile('name.text','utf8',function(err,data){
    if(err) {
       return console.log(err)
    }
    obj.name = data;
    event.emit();
})
event.on(() => {
    if(Object.values(obj).length == 2){
        console.log(obj)
    }
})