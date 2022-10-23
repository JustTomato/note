// class Subject{
//     constructor(name){
//         this.name = name;
//         this.observers = [];
//         this.state = 'playing'
//     }
//     attach(o){
//         this.observers.push(o)
//     }
//     setState(newState){
//         if(newState != this.state){
//             this.state = newState;
//             this.observers.forEach(o => o.updateState(this))
//         }
//     }
// }

// class Observer{
//     constructor(name){
//         this.name = name;
//     }
//     updateState(obj){
//         console.log(`${obj.name}跟${this.name}说：${obj.state}`)
//     }
// }

class Subject{
    constructor(name){
        this.name = name;
        this.observers = [];
        this.state = 'playing';
    }
    attach(o){
        this.observers.push(o)
    }
    setState(newState){
        if(this.state != newState){
            this.state = newState;
            this.observers.forEach(o => o.updateState(this))
        }
    }
}

class Observer{
    constructor(name){
        this.name = name;
    }
    updateState(baby){
        console.log(`${baby.name}对${this.name}说:${baby.state}`);
    }
}


let baby = new Subject('小宝宝')
let father = new Observer('爸爸')
baby.attach(father);

baby.setState('啊啊啊啊啊啊啊')