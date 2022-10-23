function core(){
    console.log('core');
}

Function.prototype.nefore = function(before){
    return (...args) => {
        before()
        console.log('before')
        this()
    }
}