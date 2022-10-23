function EventEmitter(){
    this._events = {};//这里这样写，会导致一个this指向问题
}
EventEmitter.prototype.on = function(eventName,callback){
    if(!this._events){
        this._events = Object.create(null)
    }
    if(eventName !== 'newListener'){
        this.emit('newListener',eventName)
    }
    if(this._events[eventName]){
        this._events[eventName].push(callback)
    }else{
        this._events[eventName] = [callback]
    }
}
EventEmitter.prototype.emit = function(eventName,...args){
    if(!this._events[eventName]) return;
    if(this._events[eventName]){
        this._events[eventName].forEach(fn => fn(...args));
    } 
}
EventEmitter.prototype.off = function(eventName,callback){
    if(!this._events[eventName]) return;
    this._events[eventName] = this._events[eventName].filter(fn => ((fn !== callback)&&(fn.l !== callback)));
}
EventEmitter.prototype.once = function(eventsName,callback){
    //临时接收包装一下 poa模式
    const once = (...args) => {
        callback(...args)
        this.off(eventsName,once)
    }
    //记录一下callback是谁的
    once.l = callback;
    this.on(eventsName,once)
}

module.exports = EventEmitter